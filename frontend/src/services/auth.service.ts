import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export const authService = {
  // Realiza o login
  loginUser: async (email: string, pass: string) => {
    return await signInWithEmailAndPassword(auth, email, pass);
  },

  // Realiza o cadastro 🐾
  registerUser: async (email: string, pass: string) => {
    return await createUserWithEmailAndPassword(auth, email, pass);
  },

  // Realiza o logout
  logoutUser: async () => {
    return await signOut(auth);
  }
};