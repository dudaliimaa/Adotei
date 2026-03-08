import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../src/config/firebase';

export default function RootLayout() {
  const router = useRouter(); //permite navegar entre telas via código
  const segments = useSegments(); //retorna em qual parte do app o usuário está

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => { //função do Firebase que fica escutando se o usuário está logado ou não
      const inAuthGroup = segments[0] === '(auth)';
      if (!user && !inAuthGroup) { //Caso não tem usuário logado E não está nas telas de auth
        router.replace('/(auth)/login'); //redireciona para o login
      } else if (user && inAuthGroup) { //se tem usuário logado E ainda está nas telas de auth
        router.replace('/(tabs)/catalog'); //redireciona para o catálogo
      }
    });
    return unsubscribe; //quando o componente é desmontado, ele para de escutar o Firebase para não causar vazamento de memória
  }, [segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}