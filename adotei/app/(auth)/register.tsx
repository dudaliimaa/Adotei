import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from '../../src/services/auth.service';

export default function RegisterScreen() {
  const router = useRouter();
  const { control, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data);
    } catch (error) {
      alert('Erro ao criar conta. Verifique os dados.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, styles.bottomCard]}>
          <Text style={styles.title}>Já tem uma conta?</Text>
          <Text style={styles.subtitle}>Faça login aqui</Text>
          <TouchableOpacity style={styles.outlineButton} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.outlineButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para adotar, doar ou colaborar com ONGs.</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialIcon}><Ionicons name="logo-facebook" size={24} color="#1877F2" /></TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}><Ionicons name="logo-google" size={24} color="#DB4437" /></TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}><Ionicons name="logo-apple" size={24} color="#000" /></TouchableOpacity>
          </View>

          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="Nome" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="E-mail / CPF / CNPJ" value={value} onChangeText={onChange} autoCapitalize="none" />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="Senha" value={value} onChangeText={onChange} secureTextEntry />
            )}
          />

          <TouchableOpacity style={styles.mainButton} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
            <Text style={styles.mainButtonText}>{isSubmitting ? 'Cadastrando...' : 'Cadastrar'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' },
  scrollContent: { padding: 20, gap: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 25, padding: 25, borderWidth: 1, borderColor: '#8DC4A6', alignItems: 'center' },
  bottomCard: { backgroundColor: '#D9EDE2', borderWidth: 0, borderColor: 'transparent' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2D3748', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#718096', textAlign: 'center', marginBottom: 20 },
  socialRow: { flexDirection: 'row', gap: 20, marginBottom: 25 },
  socialIcon: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  input: { width: '100%', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16 },
  mainButton: { backgroundColor: '#8DC4A6', width: '100%', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  mainButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  outlineButton: { width: '100%', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#8DC4A6', backgroundColor: '#FFF', alignItems: 'center', marginTop: 10 },
  outlineButtonText: { color: '#8DC4A6', fontWeight: 'bold', fontSize: 16 }
});