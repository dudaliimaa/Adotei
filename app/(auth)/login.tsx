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

// FIREBASE ADICIONADO
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/config/firebase';

export default function LoginScreen() {
  const router = useRouter();
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [senha, setSenha] = useState('');
  
  // Estado para o seletor Tutor/ONG
  const [tipoUsuario, setTipoUsuario] = useState('tutor');

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

  // FUNÇÃO DE LOGIN ATUALIZADA
  const handleEntrar = async () => {
    if (!emailOrCpf.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos para entrar.');
      return;
    }
    
    try {
      // Tenta autenticar com Firebase Auth
      await signInWithEmailAndPassword(auth, emailOrCpf.toLowerCase(), senha);
      
      // Se der certo, redireciona para a home
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erro de Login', 'E-mail ou senha inválidos.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      
      <Text style={styles.title}>Entre com sua conta</Text>
      <Text style={styles.subtitle}>Conecte-se para gerenciar adoções e acompanhar atualizações!</Text>

      {/* Seleção Tutor/ONG */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, tipoUsuario === 'tutor' && styles.activeTutor]} 
          onPress={() => setTipoUsuario('tutor')}
        >
          <Text style={tipoUsuario === 'tutor' ? styles.activeText : styles.inactiveText}>Tutor</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, tipoUsuario === 'ong' && styles.activeONG]} 
          onPress={() => setTipoUsuario('ong')}
        >
          <Text style={tipoUsuario === 'ong' ? styles.activeText : styles.inactiveText}>ONG</Text>
        </TouchableOpacity>
      </View>

      <TextInput 
        style={styles.input} 
        placeholder={tipoUsuario === 'tutor' ? "E-mail / CPF" : "E-mail / CNPJ"} 
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

      <TouchableOpacity style={styles.forgotLink} onPress={handleEsqueceuSenha}>
        <Text style={styles.forgotText}>Esqueceu a senha? Clique aqui</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={handleEntrar}>
        <Text style={styles.primaryButtonText}>Entrar</Text>
      </TouchableOpacity>

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
  // Estilos do Seletor
  toggleContainer: { flexDirection: 'row', marginBottom: 16, borderRadius: 12, borderWidth: 1, borderColor: '#8DC4A6', overflow: 'hidden' },
  toggleButton: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#FFF' },
  activeTutor: { backgroundColor: '#8DC4A6' },
  activeONG: { backgroundColor: '#8DC4A6' },
  activeText: { color: '#FFF', fontWeight: 'bold' },
  inactiveText: { color: '#8DC4A6', fontWeight: 'bold' },
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