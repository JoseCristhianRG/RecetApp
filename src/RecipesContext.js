import React, { createContext, useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, addDoc, where } from 'firebase/firestore';

export const RecipesContext = createContext({
  recipes: [],
  addRecipe: async () => {},
});

export function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    const q = query(
      collection(db, 'recipes'),
      where('isPublic', '==', true),
      orderBy('name')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecipes(recs);
    });
    return unsubscribe;
  }, []);

  // Function to add a new recipe to Firestore
  const addRecipe = async (recipe) => {
    const docRef = await addDoc(collection(db, 'recipes'), recipe);
    return docRef.id;
  };

  return (
    <RecipesContext.Provider value={{ recipes, addRecipe }}>
      {children}
    </RecipesContext.Provider>
  );
}