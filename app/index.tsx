import { Redirect } from 'expo-router';

export default function Index() {
  // Isso força o Expo a pular direto para a sua Home do catálogo
  return <Redirect href="/(tabs)" />;
}