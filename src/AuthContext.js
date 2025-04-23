import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from './firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { db } from './firebase';
import { getDoc, doc as docRef, setDoc } from 'firebase/firestore';

// Context for authentication state and methods
export const AuthContext = createContext({
  user: null,
  userRole: null,
  signup: async () => {},
  signin: async () => {},
  signout: async () => {},
  signinWithGoogle: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Obtener el rol del usuario desde Firestore
        try {
          const snap = await getDoc(docRef(db, 'users', firebaseUser.uid));
          if (snap.exists()) {
            setUserRole(snap.data()?.role || null);
          }
        } catch {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);
  const signin = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  const signout = () => signOut(auth);

  const signinWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Si es nuevo usuario, podrías guardar en Firestore aquí
    return result;
  };

  if (loading) return <div>Cargando sesión...</div>;

  return (
    <AuthContext.Provider value={{ user, userRole, signup, signin, signout, signinWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

// Component to require authentication for routes
export function RequireAuth({ children, requiredRole }) {
  console.log('RequireAuth', { requiredRole });
  const { user, userRole } = useContext(AuthContext);
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}