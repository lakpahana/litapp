import React, { useState, useEffect } from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { tomorrow as theme } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import Storage from '../components/Storage';
// import Chat from '../components/Chat';
import TextEditorDataService from '../services/TextEditorDataService';
import { onValue, DataSnapshot } from 'firebase/database';
import Editor from 'react-simple-code-editor';
import { useAuthContext } from '@asgardeo/auth-react';

// import { highlight, languages } from 'prismjs/components/prism-core';

import { highlight, languages } from 'prismjs';
import Chat from './chat';
import Storage from './storage';
interface File {
  fkey: string;
  fname: string;
  owner: string;
  oname: string;
  dateAdded: string;
}

const Classroom: React.FC = () => {
  const [codeText, setCodeText] = useState<string>('Hello World');
  const [fileName, setFileName] = useState<string>('');
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentFileKey, setCurrentFileKey] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [currentFileOwner, setCurrentFileOwner] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [readOnly, setReadOnly] = useState<boolean>(true  );
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: string, text: string } | null>(null);
  const { isAuthenticated,getBasicUserInfo,state } = useAuthContext();
  const [user, setCurrentUser] = useState(null);

  // const user = {
  //   uid: '123',
  //   displayName: 'John Doe',
  //   name: 'John Doe'
  // };

  const userFunctions = async () => {

    const userBasic = await getBasicUserInfo();
    
    TextEditorDataService.getUserByUid(userBasic?.sub).then((snapshot) => {
      console.log('snapshot', snapshot.val());
      let user = {
        uid: userBasic?.sub,
        displayName: snapshot.val().firstName,
        name: snapshot.val().firstName
      }

      setCurrentUser(user);
    });
 
  }


  useEffect(() => {
    setLoading(true);
    userFunctions();
    console.log('user', user);
    const handleValue = (snapshot: DataSnapshot) => {
      const filesArray: File[] = [];
      snapshot.forEach((child) => {
        const file = child.val();
        filesArray.push({
          fkey: child.key!,
          fname: file.name,
          owner: file.owner,
          oname: file.ownerName,
          dateAdded: file.dateAdded || 'Thu Dec 29 2022',
        });
      });
      setFiles(filesArray);
      setFirstLoad(false);
      setLoading(false);
    };

    const filesRef = TextEditorDataService.getref();
    const unsubscribe = onValue(filesRef, handleValue);

    return () => unsubscribe();
  }, []);

  const addFile = () => {
    if (!fileName) {
      alert('Please enter a file name');
      return;
    }

    setLoading(true);

    const data = {
      name: fileName,
      code: codeText,
      owner: user.uid,
      ownerName: user.displayName,
      dateAdded: new Date().toDateString(),
    };

    TextEditorDataService.create(data)
      .then((resp) => {
        setFileKey(resp.key);
        setNotification({ type: 'success', text: 'File Added Successfully' });
        loadToEditorAfterAdding();
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const loadToEditorAfterAdding = () => {
    if (!fileKey) return;

    setCurrentFileName(fileName);
    setFileName('');

    TextEditorDataService.getSingle(fileKey).then((snapshot) => {
      const file = snapshot.val();
      setCurrentFile(file);
      setCodeText(`//Write Anything Here. \n//It will automatically get saved. Happy Coding!`);
      setCurrentFileOwner(file.ownerName);
      setReadOnly(file.owner !== user.uid);
    });
  };

  const loadToEditor = (key: string) => {
    setFileKey(key);

    TextEditorDataService.getSingle(key).then((snapshot) => {
      const file = snapshot.val();
      setCurrentFile(file);
      setCodeText(file.code);
      setCurrentFileName(file.name);
      setCurrentFileOwner(file.ownerName);
      setReadOnly(file.owner !== user.uid);
    });
  };

  const deleteFile = (key: string) => {
    if (!window.confirm('Do you really want to delete?')) return;

    setLoading(true);

    TextEditorDataService.delete(key)
      .then(() => {
        setLoading(false);
        setCodeText('Hello World');
        setFileName('');
        setCurrentFileName(null);
        setCurrentFile(null);
        setCurrentFileKey(null);
        setFileKey(null);
        setCurrentFileOwner(null);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (fileKey) {
      TextEditorDataService.update(fileKey, { code: codeText })
        .then(() => {
          console.log('Saved updated successfully!');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [codeText, fileKey]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeText);
    setNotification({ type: 'success', text: 'Code copied to your clipboard' });
  };

  return (
    <div className="classroom">
      {/* loading  */}
      {loading && <div className="spinner-border" role="status">
        <span className="sr-only"></span>
      </div>}
      <br />
      <div className="row">
        <div className="col-3">
          <div className="row">
            <div className="input-group mb-3">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="form-control"
                placeholder="File Name"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
              <div className="input-group-prepend">
                <input
                  onClick={addFile}
                  className="input-group-text btn btn-primary"
                  type="button"
                  value="+"
                />
              </div>
            </div>

            <br />
            <br />
            <ul id="fileList1" className="list-group">
              {files.map((file) => (
                <li key={file.fkey} className="list-group-item d-flex">
                  <p className="p-0 m-0 flex-grow-1" onClick={() => loadToEditor(file.fkey)}>
                    <b>{file.fname}</b> : <i style={{ fontSize: 'small' }}>{file.oname} ( {file.dateAdded} )</i>
                  </p>
                  {user && file.owner === user.uid && (
                    <input
                      onClick={() => deleteFile(file.fkey)}
                      className="input-group-text-5"
                      type="button"
                      value="🗑"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-6">
          {currentFileName && (
            <div className="row">
              <div className="col-10">
                <p>{currentFileName} by {currentFileOwner}</p>
              </div>
              <div className="col-2">
                <button className="btn btn-success" onClick={copyToClipboard}>Copy</button>
              </div>
            </div>
          )}
          {/* <SyntaxHighlighter readOnly={false} language="javascript" style={theme} showLineNumbers>
            {codeText}
          </SyntaxHighlighter> */}
          <Editor
            value={codeText}
            onValueChange={(codeText) => setCodeText(codeText)}
            highlight={codeText => highlight(codeText, languages.javascript, 'javascript')}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              backgroundColor: '#f5f5f5',
              border: '1px solid #ccc',
              borderRadius: 5,
            }}
            readOnly={readOnly}
          ></Editor>
        </div>
        <div className="col-3">
          {/* <Storage />
          <Chat /> */}
          {/* if user is not null then render Stroagte */}
           {
            user && <Storage user={user} />
           } 
          {/* <Storage
          user={user}
          /> */}
          {
            user && <Chat user={user} />
          }
          
          {/* <Chat></Chat> */}
        </div>
      </div>
    </div>
  );
};

export default Classroom;
