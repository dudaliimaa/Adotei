import { useEffect, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/src/stores/auth.store';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  // Lê o estado de autenticação diretamente do store Zustand
  // O store é a fonte única de verdade — não usamos onAuthStateChanged aqui
  const firebaseUser = useAuthStore((state) => state.firebaseUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initialise = useAuthStore((state) => state.initialise);

  // Ref para evitar que segments entre como dependência do useEffect de redirecionamento
  const segmentsRef = useRef(segments);
  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

  // Inicializa o listener do Firebase UMA vez ao montar o layout raiz
  // O store passa a ouvir login/logout e atualiza firebaseUser e userProfile
  useEffect(() => {
    const unsubscribe = initialise(); // registra o onAuthStateChanged interno do store
    return unsubscribe;              // cancela o listener ao desmontar (evita memory leak)
  }, []);

  // Reage às mudanças de firebaseUser vindas do store para redirecionar o usuário
  useEffect(() => {
    if (isLoading) return; // aguarda o Firebase resolver o estado inicial antes de redirecionar

    const inAuthGroup = segmentsRef.current[0] === '(auth)';

    if (!firebaseUser && !inAuthGroup) {
      // Sem sessão e fora da área de auth → vai para o login
      router.replace('/(auth)/login');
    } else if (firebaseUser && inAuthGroup) {
      // Com sessão e ainda na área de auth → só redireciona se estiver no login
      // Se estiver em /register, deixa ficar para permitir novo cadastro
      const inLoginScreen = segmentsRef.current[1] === 'login';
      if (inLoginScreen) {
        router.replace('/(tabs)/catalog');
      }
    }
  }, [firebaseUser, isLoading]); // roda sempre que o estado de auth ou loading mudar

  return <Stack screenOptions={{ headerShown: false }} />;
}
