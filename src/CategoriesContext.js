import React, { createContext, useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (querySnapshot) => {
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    });
    return () => unsubscribe();
  }, []);

  const addCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  return (
    <CategoriesContext.Provider value={{ categories, addCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
};