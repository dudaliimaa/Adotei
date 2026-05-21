import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/auth.store';

export default function Index() {
  const { user } = useAuthStore();

  // Se o usuário já estiver logado, vai direto para a Home (catalog)
  // Se não, vai para a tela de Login
  if (user) {
    return <Redirect href="/(tabs)/catalog" />;
  }

  return <Redirect href="/(auth)/login" />;
}