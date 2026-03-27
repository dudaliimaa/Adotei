import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { logoutUser } from '@/src/services/auth.service';
import { useAuthStore } from '@/src/stores/auth.store';

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(false);

  // Usa as propriedades corretas do AuthState: userProfile (Firestore) e firebaseUser (Auth)
  const userProfile = useAuthStore((state) => state.userProfile);
  const firebaseUser = useAuthStore((state) => state.firebaseUser);

  // Nome de exibição: preferência ao nome completo do Firestore, fallback para o email do Firebase
  const displayName = userProfile?.fullName ?? firebaseUser?.email ?? 'Usuário';
  const email = userProfile?.email ?? firebaseUser?.email ?? '';

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await logoutUser(); // Encerra a sessão no Firebase Auth
              // O onAuthStateChanged no _layout.tsx detecta o logout
              // e redireciona para /login automaticamente
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      {/* Card com dados do usuário vindos do Firestore ou do Firebase Auth */}
      <View style={styles.infoCard}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{email}</Text>

        {/* Exibe telefone e cidade se o perfil do Firestore já foi carregado */}
        {userProfile?.phone && (
          <Text style={styles.detail}>📞 {userProfile.phone}</Text>
        )}
        {userProfile?.address?.city && (
          <Text style={styles.detail}>
            📍 {userProfile.address.city} — {userProfile.address.state}
          </Text>
        )}
      </View>

      {/* Botão de logout vermelho — ação destrutiva */}
      <TouchableOpacity
        style={[styles.logoutButton, isLoading && styles.buttonDisabled]}
        onPress={handleLogout}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.logoutText}>Sair da conta</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    gap: 6, // espaço entre cada linha de informação
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  detail: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#e74c3c', // vermelho para ação destrutiva
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
