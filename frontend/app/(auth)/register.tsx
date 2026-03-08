import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { userSchema, type UserFormData } from '@/src/schemas/user.schema';
import { registerUser } from '@/src/services/auth.service';


// Exibe alertas compatíveis com web e mobile
function showAlert(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

// ─── Componente reutilizável de campo de formulário ───────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {/* Exibe mensagem de erro de validação abaixo do campo */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ─── Tela principal de cadastro ───────────────────────────────────────────────

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Inicializa o React Hook Form com validação via Zod
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      cpf: '',
      phone: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
  });

  // Função chamada quando o formulário é submetido com dados válidos
  async function onSubmit(data: UserFormData) {
    setIsLoading(true);
    try {
      await registerUser(data);
      // Redireciona para o catálogo após cadastro bem-sucedido
      router.replace('/(tabs)/catalog');
    } catch (error: any) {
      // Trata erros específicos do Firebase Auth com mensagens amigáveis
      let mensagem = 'Ocorreu um erro. Tente novamente.';
      if (error.code === 'auth/email-already-in-use') {
        mensagem = 'Este e-mail já está cadastrado. Tente fazer login.';
      } else if (error.code === 'auth/invalid-email') {
        mensagem = 'E-mail inválido.';
      } else if (error.code === 'auth/weak-password') {
        mensagem = 'Senha muito fraca. Use ao menos 6 caracteres.';
      } else if (error.message) {
        mensagem = error.message;
      }
      showAlert('Erro no cadastro', mensagem);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.logo}>🐾 Adotei</Text>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
        </View>

        {/* ── Seção: Dados pessoais ── */}
        <Text style={styles.sectionTitle}>Dados pessoais</Text>

        <Field label="Nome completo" error={errors.fullName?.message}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Ex: Maria Silva Santos"
                placeholderTextColor="#aaa"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="words"
              />
            )}
          />
        </Field>

        <Field label="E-mail" error={errors.email?.message}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="seu@email.com"
                placeholderTextColor="#aaa"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
        </Field>

        <Field label="Senha" error={errors.password?.message}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#aaa"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />
        </Field>

        <Field label="CPF" error={errors.cpf?.message}>
          <Controller
            control={control}
            name="cpf"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.cpf && styles.inputError]}
                placeholder="000.000.000-00"
                placeholderTextColor="#aaa"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
              />
            )}
          />
        </Field>

        <Field label="Telefone (com DDD)" error={errors.phone?.message}>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="11987654321"
                placeholderTextColor="#aaa"
                onBlur={onBlur}
                onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
                value={value}
                keyboardType="phone-pad"
              />
            )}
          />
        </Field>

        {/* ── Seção: Endereço ── */}
        <Text style={styles.sectionTitle}>Endereço</Text>

        <Field label="Rua" error={errors.address?.street?.message}>
          <Controller
            control={control}
            name="address.street"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.address?.street && styles.inputError]}
                placeholder="Nome da rua ou avenida"
                placeholderTextColor="#aaa"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="words"
              />
            )}
          />
        </Field>

        {/* Número e Complemento lado a lado */}
        <View style={styles.row}>
          <View style={styles.rowFieldSmall}>
            <Field label="Número" error={errors.address?.number?.message}>
              <Controller
                control={control}
                name="address.number"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.address?.number && styles.inputError]}
                    placeholder="100"
                    placeholderTextColor="#aaa"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                  />
                )}
              />
            </Field>
          </View>

          <View style={styles.rowFieldLarge}>
            <Field label="Complemento (opcional)" error={errors.address?.complement?.message}>
              <Controller
                control={control}
                name="address.complement"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Apto, bloco..."
                    placeholderTextColor="#aaa"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </Field>
          </View>
        </View>

        <Field label="Bairro" error={errors.address?.neighborhood?.message}>
          <Controller
            control={control}
            name="address.neighborhood"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.address?.neighborhood && styles.inputError]}
                placeholder="Nome do bairro"
                placeholderTextColor="#aaa"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="words"
              />
            )}
          />
        </Field>

        <Field label="Cidade" error={errors.address?.city?.message}>
          <Controller
            control={control}
            name="address.city"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.address?.city && styles.inputError]}
                placeholder="São Paulo"
                placeholderTextColor="#aaa"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="words"
              />
            )}
          />
        </Field>

        {/* Estado e CEP lado a lado */}
        <View style={styles.row}>
          <View style={styles.rowFieldSmall}>
            <Field label="Estado" error={errors.address?.state?.message}>
              <Controller
                control={control}
                name="address.state"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.address?.state && styles.inputError]}
                    placeholder="SP"
                    placeholderTextColor="#aaa"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text.toUpperCase())}
                    value={value}
                    maxLength={2}
                    autoCapitalize="characters"
                  />
                )}
              />
            </Field>
          </View>

          <View style={styles.rowFieldLarge}>
            <Field label="CEP" error={errors.address?.zipCode?.message}>
              <Controller
                control={control}
                name="address.zipCode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.address?.zipCode && styles.inputError]}
                    placeholder="01310100"
                    placeholderTextColor="#aaa"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
                    value={value}
                    keyboardType="numeric"
                    maxLength={8}
                  />
                )}
              />
            </Field>
          </View>
        </View>

        {/* Botão de cadastro */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Criar conta</Text>
          )}
        </TouchableOpacity>

        {/* Link para tela de login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const ORANGE = '#E87722';
const ORANGE_DARK = '#C9611A';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 24,
    paddingBottom: 48,
  },

  // Cabeçalho
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  logo: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },

  // Seções
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ORANGE,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 8,
  },

  // Campos
  fieldWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#e53935',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 4,
  },

  // Layout de linha (dois campos lado a lado)
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowFieldSmall: {
    flex: 1,
  },
  rowFieldLarge: {
    flex: 2,
  },

  // Botão
  button: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: ORANGE_DARK,
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Rodapé
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
  footerLink: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: '700',
  },
});