import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/config/firebase'; // Verifique se o caminho está certo
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Vigia se o usuário logou ou deslogou
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Se não tem usuário, trava no login
        router.replace('/(auth)/login');
      } else {
        // Se logou, libera para as abas
        router.replace('/(tabs)');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}