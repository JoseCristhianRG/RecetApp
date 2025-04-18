import React, { createContext, useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';

// Context for ingredients stored in Firestore
export const IngredientsContext = createContext({
  ingredients: [],
  addIngredient: async () => {},
});

export function IngredientsProvider({ children }) {
  const [ingredients, setIngredients] = useState([]);
  useEffect(() => {
    const q = query(collection(db, 'ingredients'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setIngredients(ings);
    });
    return () => unsubscribe();
  }, []);

  // Add a new ingredient to Firestore
  const addIngredient = async (name) => {
    const docRef = await addDoc(collection(db, 'ingredients'), { name: name.trim() });
    return docRef.id;
  };

  return (
    <IngredientsContext.Provider value={{ ingredients, addIngredient }}>
      {children}
    </IngredientsContext.Provider>
  );
}