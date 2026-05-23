import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [senha, setSenha] = useState('');

  // LÓGICA DO ESQUECEU A SENHA ATIVADA
  const handleEsqueceuSenha = () => {
    if (!emailOrCpf.trim()) {
      Alert.alert(
        'Recuperação de Senha',
        'Por favor, digite seu E-mail, CPF ou CNPJ no campo acima para sabermos qual conta recuperar.'
      );
      return;
    }

    Alert.alert(
      'Link Enviado!',
      `Um link de redefinição de senha foi enviado para o canal associado a: ${emailOrCpf}. Verifique sua caixa de entrada.`
    );
  };

  const handleEntrar = () => {
    if (!emailOrCpf.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos para entrar.');
      return;
    }
    
    Alert.alert('Sucesso', 'Login efetuado com sucesso!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      
      {/* Textos principais sem o bloco de redes sociais */}
      <Text style={styles.title}>Entre com sua conta</Text>
      <Text style={styles.subtitle}>Conecte-se para gerenciar adoções e acompanhar atualizações!</Text>

      {/* Inputs arredondados originais do design */}
      <TextInput 
        style={styles.input} 
        placeholder="E-mail / CPF / CNPJ" 
        value={emailOrCpf}
        onChangeText={setEmailOrCpf}
        placeholderTextColor="#A0AEC0"
        autoCapitalize="none"
      />

      <TextInput 
        style={styles.input} 
        placeholder="Senha" 
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholderTextColor="#A0AEC0"
      />

      {/* Clique aqui funcional */}
      <TouchableOpacity style={styles.forgotLink} onPress={handleEsqueceuSenha}>
        <Text style={styles.forgotText}>Esqueceu a senha? Clique aqui</Text>
      </TouchableOpacity>

      {/* Botão Verde Menta */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleEntrar}>
        <Text style={styles.primaryButtonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Links de navegação inferiores discretos */}
      <View style={styles.signUpRow}>
        <Text style={styles.signUpText}>Não tem uma conta? </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.signUpLink}>Cadastre-se aqui</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backHomeLink} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.backHomeLinkText}>Voltar para a tela inicial</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFDF9',
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    marginBottom: 35,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#FFF',
    color: '#2D3748',
    marginBottom: 16,
  },
  forgotLink: {
    alignItems: 'center',
    marginBottom: 25,
  },
  forgotText: {
    color: '#718096',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  primaryButton: {
    backgroundColor: '#8DC4A6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 25,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  signUpText: {
    color: '#718096',
    fontSize: 14,
  },
  signUpLink: {
    color: '#8DC4A6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backHomeLink: {
    alignItems: 'center',
    marginTop: 5,
  },
  backHomeLinkText: {
    color: '#A0AEC0',
    fontSize: 13,
    fontWeight: '500',
  },
});