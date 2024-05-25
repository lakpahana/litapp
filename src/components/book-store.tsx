
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
export const BookStore: FunctionComponent = (): ReactElement => {
  const {
    getAccessToken,getBasicUserInfo
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
        // setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    
  


 
    return (
      <>
      Loading ..
      {user && <div> Welcome {user.username} </div>}
      </>

    );
};
