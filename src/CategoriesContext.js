import React, { createContext, useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';

// Context for categories stored in Firestore
export const CategoriesContext = createContext({
  categories: [],
  addCategory: async () => {},
});

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(cats);
    });
    return () => unsubscribe();
  }, []);

  // Add a new category to Firestore
  const addCategory = async (name) => {
    const docRef = await addDoc(collection(db, 'categories'), { name: name.trim() });
    return docRef.id;
  };

  return (
    <CategoriesContext.Provider value={{ categories, addCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
}