
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { db } from "../firebase";
import Classroom from "./classroom";


export const BookStore: FunctionComponent = (): ReactElement => {
  const {
    state,
    getAccessToken,
    getBasicUserInfo
  } = useAuthContext();

  const [user, setUser] = useState(null);

    // const API = process.env.BACKEND_ENDPOINT

    
  
    useEffect(() => {
      fetchBooks();
    }, []);
  
    const fetchBooks = async () => {
      try {
        const accessToken = await getAccessToken();
        console.log(accessToken);
        const getBasicUserInfos = await getBasicUserInfo();
        console.log(getBasicUserInfos);
        setUser(getBasicUserInfos);

        console.log('user', state);
        // setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    
  


 
    return (
      <>
      
      <Classroom />
      {/* {user && <div> Welcome {user.username} </div>} */}
      </>

    );
};
