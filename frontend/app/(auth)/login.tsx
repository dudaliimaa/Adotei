import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';

// Importa o serviço de autenticação e o store do Zustand
import { loginUser, logoutUser } from '../../src/services/auth.service';
import { useAuthStore } from '../../src/stores/auth.store';

// Schema Zod somente para o formulário de login (email + senha)
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

// Tipo inferido do schema — usado para tipagem do formulário
type LoginFormData = z.infer<typeof loginSchema>;

// Mapeia os códigos de erro do Firebase Auth para mensagens em português
function getFirebaseErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/user-not-found': 'Nenhuma conta encontrada com este e-mail.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  };
  return messages[code] ?? 'Ocorreu um erro. Tente novamente.';
}

export default function LoginScreen() {
  // Estado local de loading para feedback visual durante o login
  const [isLoading, setIsLoading] = useState(false);

  // Configura o React Hook Form com validação via Zod
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Função chamada ao submeter o formulário com dados válidos
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Chama o serviço de login — retorna UserCredential do Firebase
      await loginUser(data.email, data.password);

      // Redireciona para o catálogo após login bem-sucedido
      router.replace('/(tabs)/catalog');
    } catch (error: any) {
      // Exibe mensagem de erro amigável traduzida do código Firebase
      const message = getFirebaseErrorMessage(error?.code ?? '');
      Alert.alert('Erro ao entrar', message);
    } finally {
      setIsLoading(false);
    }
  };

  // Lida com o botão "Criar nova conta": desloga usuário atual (se houver)
  // e navega para o cadastro — resolve o bug de ficar preso ao haver sessão ativa
  const handleGoToRegister = async () => {
    try {
      await logoutUser(); // Garante que qualquer sessão ativa seja encerrada
    } catch (_) {
      // Ignora erro de logout (ex: já estava deslogado)
    }
    router.push('/(auth)/register');
  };

  return (
    // KeyboardAvoidingView evita que o teclado cubra os campos no iOS
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" // Fecha teclado ao tocar fora dos inputs
      >
        {/* Cabeçalho da tela */}
        <View style={styles.header}>
          <Text style={styles.title}>Adotei 🐾</Text>
          <Text style={styles.subtitle}>Entre na sua conta</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>

          {/* Campo: E-mail */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>E-mail</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="seu@email.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"    // Abre teclado com @
                  autoCapitalize="none"           // Não capitaliza automaticamente
                  autoCorrect={false}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!isLoading}           // Desabilita durante o loading
                />
              )}
            />
            {/* Exibe mensagem de erro inline se houver */}
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>

          {/* Campo: Senha */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Senha</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Sua senha"
                  placeholderTextColor="#999"
                  secureTextEntry    // Esconde os caracteres da senha
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!isLoading}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>

          {/* Botão principal de login */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {/* Alterna entre spinner e texto conforme estado de loading */}
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Divisor visual */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botão secundário: navegar para o cadastro
              Também faz logout do usuário atual para evitar o bug de sessão ativa */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGoToRegister}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Criar nova conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,           // Garante que o conteúdo ocupe o espaço mínimo da tela
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B35',      // Cor primária do app
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    // Sombra para dar profundidade ao card do formulário
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,          // Sombra no Android
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#e74c3c',  // Borda vermelha ao ter erro de validação
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,  // Feedback visual de botão desabilitado durante loading
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 14,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
});
