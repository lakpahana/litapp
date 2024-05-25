
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import axios from 'axios';
import './book-store.css'
import { useAuthContext } from "@asgardeo/auth-react";
interface Book {
    id: number;
    book_title: string;
    author: string;
    category: string;
    published_year: number;
    price: number;
    copies_in_stock: number;
  }

export const BookStore: FunctionComponent = (): ReactElement => {
  const {
    getAccessToken,getBasicUserInfo
  } = useAuthContext();


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
        // setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    
  


 
    return (
      <>
      Loading ..
      </>

    );
};
