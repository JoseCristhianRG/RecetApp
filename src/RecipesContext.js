import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, addDoc, where } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const RecipesContext = createContext({
  recipes: [],
  addRecipe: async () => {},
});

export function RecipesProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [publicRecipes, setPublicRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);

  // Fetch public recipes
  useEffect(() => {
    const q = query(
      collection(db, 'recipes'),
      where('isPublic', '==', true),
      orderBy('name')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPublicRecipes(recs);
    });
    return unsubscribe;
  }, []);

  // Fetch user's own recipes (including private ones)
  useEffect(() => {
    if (!user) {
      setUserRecipes([]);
      return;
    }

    const q = query(
      collection(db, 'recipes'),
      where('createdBy', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserRecipes(recs);
    }, (error) => {
      console.error('Error fetching user recipes:', error);
    });
    return unsubscribe;
  }, [user]);

  // Combine and deduplicate recipes
  const recipes = React.useMemo(() => {
    const allRecipes = [...publicRecipes];
    userRecipes.forEach((userRecipe) => {
      if (!allRecipes.find((r) => r.id === userRecipe.id)) {
        allRecipes.push(userRecipe);
      }
    });
    return allRecipes.sort((a, b) => a.name.localeCompare(b.name));
  }, [publicRecipes, userRecipes]);

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