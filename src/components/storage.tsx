import React, { useState, useEffect, useRef } from 'react';
// import StorageService from '../firebase/StorageServiceService';
import { listAll } from 'firebase/storage';
import StorageService from '../services/StorageService';

const Storage = ({ user }: { user: any }) => {
  const [files, setFiles] = useState([]);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadingStarted, setUploadingStarted] = useState(false);
  const fileInput = useRef(null);

  useEffect(() => {
    retrieveFiles();
  }, []);

  const retrieveFiles = () => {
    setFiles([]);
    listAll(StorageService.getRef()).then((res) => {
      const retrievedFiles = res.items.map((itemRef) => ({
        skey: itemRef.name.split('##')[1],
        name: itemRef.name.split('##')[2],
        path: itemRef.fullPath,
      }));
      setFiles(retrievedFiles);
    });
  };

  const deleteFile = (filePath:any) => {
    if (window.confirm('Do you really want to delete?')) {
      StorageService.deleteFile(filePath).then(() => {
        retrieveFiles();
      });
    }
  };

  const downloadFile = (filePath:any) => {
    StorageService.downloadFile(filePath).then((url) => {
      window.open(url);
    });
  };

  const uploadFile = (event:any) => {
    event.preventDefault();
    const file = fileInput.current.files[0];
    const fileName = `##${user.uid}##${file.name}`;

    if (file && !file.name.includes('##')) {
      const uploadTask = StorageService.uploadFile(file, fileName);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          setUploadingStarted(true);
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadPercentage(progress);
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error(error);
        },
        () => {
          setUploadingStarted(false);
          setUploadPercentage(0);
          retrieveFiles();
        }
      );
    } else {
      console.log('No file selected or check file name');
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-12"></div>
      </div>
      <div className="row">
        <div className="col-12">
          <form onSubmit={uploadFile} style={{ display: uploadingStarted ? 'none' : 'block' }}>
            <div>
              <label htmlFor="file" style={{ width: '70%' }}>
                <input type="file" ref={fileInput} />
              </label>
              <button className="btn btn-primary" type="submit">
                Upload!
              </button>
            </div>
          </form>

        {uploadingStarted && (
            <div className="progress" style={{ height: '22px', marginBottom: '10px' }}>
                <br />
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${uploadPercentage}%` }}
                    aria-valuenow={uploadPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                ></div>
                <br />
            </div>
        )}
          <ul className="list-group" style={{ marginTop: '10px' }}>
            {files.map((file) => (
              <li key={file.path} className="list-group-item d-flex">
                <p className="p-0 m-0 flex-grow-1" onClick={() => downloadFile(file.path)}>
                  {file.name}
                </p>
                {file.skey === user.uid && (
                  <input
                    className="btn btn-danger"
                    type="button"
                    value="🗑"
                    onClick={() => deleteFile(file.path)}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Storage;
