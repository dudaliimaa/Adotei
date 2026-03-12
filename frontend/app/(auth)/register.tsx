import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { authService } from '../../src/services/auth.service';

const registerSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onRegister = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await authService.registerUser(data.email, data.password);
      Alert.alert('Sucesso!', 'Sua conta foi criada com sucesso.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);
    } catch (error: any) {
      let msg = 'Erro ao criar conta.';
      if (error.code === 'auth/email-already-in-use') msg = 'Este e-mail já está em uso.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>🐾 Criar Conta</Text>

      <Text style={styles.label}>Nome</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Seu nome" value={value} onChangeText={onChange} />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Text style={styles.label}>E-mail</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="exemplo@email.com" value={value} onChangeText={onChange} autoCapitalize="none" keyboardType="email-address" />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Text style={styles.label}>Senha</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="******" value={value} onChangeText={onChange} secureTextEntry />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Text style={styles.label}>Confirmar Senha</Text>
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="******" value={value} onChangeText={onChange} secureTextEntry />
        )}
      />
      {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onRegister)} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => router.back()}>
        <Text style={styles.linkText}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 30, justifyContent: 'center', backgroundColor: '#FFF' },
  logo: { fontSize: 28, fontWeight: 'bold', color: '#E87722', textAlign: 'center', marginBottom: 30 },
  label: { fontSize: 14, color: '#666', marginBottom: 5, fontWeight: '500' },
  input: { borderBottomWidth: 1, borderColor: '#DDD', padding: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#E87722', padding: 15, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  error: { color: 'red', fontSize: 12, marginBottom: 10, marginTop: -10 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#E87722', fontWeight: '500' }
});