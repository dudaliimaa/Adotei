import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
// CAMINHO CORRIGIDO E AUTENTICAÇÃO ADICIONADA
import { db, auth } from '../../src/config/firebase'; 
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegisterScreen() {
  const router = useRouter();

  // Estados Adicionados
  const [tipoUsuario, setTipoUsuario] = useState('tutor'); 
  const [documento, setDocumento] = useState('');

  // Estados Originais
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [ddi, setDdi] = useState('+55');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('UF');
  const [pais, setPais] = useState('Brasil');
  const [tipoImovel, setTipoImovel] = useState('Tipo de Imóvel');
  const [loadingCep, setLoadingCep] = useState(false);
  const [erroTelefone, setErroTelefone] = useState('');
  const [erroNumero, setErroNumero] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [erroConfirmarSenha, setErroConfirmarSenha] = useState('');

  const [modalDdiVisivel, setModalDdiVisivel] = useState(false);
  const [modalUfVisivel, setModalUfVisivel] = useState(false);
  const [modalPaisVisivel, setModalPaisVisivel] = useState(false);
  const [modalImovelVisivel, setModalImovelVisivel] = useState(false);

  const listaDdis = ['+55 (BR)', '+1 (US/CA)', '+351 (PT)', '+34 (ES)', '+44 (UK)', '+54 (AR)', '+56 (CL)', '+598 (UY)', '+595 (PY)', '+591 (BO)'];
  const listaPaises = ['Brasil', 'Estados Unidos', 'Portugal', 'Espanha', 'Reino Unido', 'Argentina', 'Chile'];
  const listaUfs = ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS', 'BA', 'PE', 'CE'];
  const listaTiposImovel = ['Casa', 'Apartamento', 'Comércio', 'Outro'];

  const regexSenhaForte = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/;

  const handleSenhaChange = (texto: string) => {
    setSenha(texto);
    if (texto.length === 0) setErroSenha('');
    else if (!regexSenhaForte.test(texto)) setErroSenha('A senha deve conter no mínimo 8 caracteres, incluindo pelo menos 1 número e 1 caractere especial.');
    else setErroSenha('');
    if (confirmarSenha.length > 0 && texto !== confirmarSenha) setErroConfirmarSenha('As senhas não coincidem.');
    else setErroConfirmarSenha('');
  };

  const handleConfirmarSenhaChange = (texto: string) => {
    setConfirmarSenha(texto);
    if (texto.length === 0) setErroConfirmarSenha('');
    else if (texto !== senha) setErroConfirmarSenha('As senhas não coincidem.');
    else setErroConfirmarSenha('');
  };

  const handleTelefoneChange = (texto: string) => {
    setTelefone(texto.replace(/\D/g, ''));
    setErroTelefone(texto.length > 0 && /\D/g.test(texto) ? 'Apenas números são permitidos.' : '');
  };

  const handleNumeroChange = (texto: string) => {
    setNumero(texto.replace(/\D/g, ''));
    setErroNumero(texto.length > 0 && /\D/g.test(texto) ? 'Apenas números são permitidos.' : '');
  };

  const handleCepChange = async (texto: string) => {
    const cepLimpo = texto.replace(/\D/g, '');
    setCep(cepLimpo);
    if (cepLimpo.length === 8) {
      setLoadingCep(true);
      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();
        if (!dados.erro) {
          setRua(dados.logradouro || '');
          setBairro(dados.bairro || '');
          setCidade(dados.localidade || '');
          setEstado(dados.uf || 'UF');
        } else { Alert.alert('Aviso', 'CEP não encontrado.'); }
      } catch (error) { Alert.alert('Erro', 'Falha ao buscar CEP.'); }
      finally { setLoadingCep(false); }
    }
  };

  const validarFormularioAoSalvar = async () => {
    if (!nome || !email || !documento || !telefone || !cep || !numero || !senha || !confirmarSenha || tipoImovel === 'Tipo de Imóvel') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // 1. Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.toLowerCase(), senha);
      
      // 2. Salva os dados no Firestore usando o E-mail como ID
      await setDoc(doc(db, "users", email.toLowerCase()), {
        uid: userCredential.user.uid,
        nome,
        email: email.toLowerCase(),
        documento,
        tipo: tipoUsuario,
        telefone,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        pais,
        tipoImovel,
        dataCriacao: new Date().toISOString()
      });

      Alert.alert('Sucesso', 'Cadastro efetuado com sucesso!', [
        { text: 'OK', onPress: () => router.push('/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao salvar: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Crie sua conta</Text>
        <Text style={styles.cardSubtitle}>Cadastre-se para adotar, doar ou colaborar com ONGs.</Text>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity style={[styles.toggleButton, tipoUsuario === 'tutor' && styles.activeTutor]} onPress={() => {setTipoUsuario('tutor'); setDocumento('');}}>
          <Text style={tipoUsuario === 'tutor' ? styles.activeText : styles.inactiveText}>Tutor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleButton, tipoUsuario === 'ong' && styles.activeONG]} onPress={() => {setTipoUsuario('ong'); setDocumento('');}}>
          <Text style={tipoUsuario === 'ong' ? styles.activeText : styles.inactiveText}>ONG</Text>
        </TouchableOpacity>
      </View>

      <TextInput style={styles.input} placeholder={tipoUsuario === 'tutor' ? "CPF" : "CNPJ"} value={documento} onChangeText={setDocumento} keyboardType="numeric" placeholderTextColor="#A0AEC0" />
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} placeholderTextColor="#A0AEC0" />
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#A0AEC0" />
      
      <View style={{ marginBottom: 15 }}>
        <View style={styles.row}>
          <View style={{ flex: 1.4 }}>
            <TouchableOpacity style={[styles.input, styles.pickerSelector, { marginBottom: 0 }]} onPress={() => setModalDdiVisivel(true)}>
              <Text style={styles.pickerText}>{ddi.split(' ')[0]}</Text>
              <Text style={styles.arrowIcon}>▾</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 3, marginLeft: 10 }}>
            <TextInput style={[styles.input, { marginBottom: 0 }]} placeholder="Telefone (com DDD)" value={telefone} onChangeText={handleTelefoneChange} keyboardType="numeric" placeholderTextColor="#A0AEC0" />
          </View>
        </View>
        {erroTelefone ? <Text style={styles.errorHintText}>{erroTelefone}</Text> : null}
      </View>

      <View style={styles.cepWrapper}>
        <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="CEP" value={cep} onChangeText={handleCepChange} keyboardType="numeric" maxLength={8} placeholderTextColor="#A0AEC0" />
        {loadingCep && <ActivityIndicator color="#8DC4A6" style={styles.loader} />}
      </View>

      <TextInput style={styles.input} placeholder="Rua" value={rua} onChangeText={setRua} placeholderTextColor="#A0AEC0" />
      
      <View style={{ marginBottom: 15 }}>
        <View style={styles.row}>
          <View style={{ flex: 2.5 }}>
            <TextInput style={[styles.input, { marginBottom: 0 }]} placeholder="Bairro" value={bairro} onChangeText={setBairro} placeholderTextColor="#A0AEC0" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <TextInput style={[styles.input, { marginBottom: 0 }]} placeholder="Nº" value={numero} onChangeText={handleNumeroChange} keyboardType="numeric" placeholderTextColor="#A0AEC0" />
          </View>
        </View>
        {erroNumero ? <Text style={styles.errorHintText}>{erroNumero}</Text> : null}
      </View>

      <TouchableOpacity style={[styles.input, styles.pickerSelector]} onPress={() => setModalImovelVisivel(true)}>
        <Text style={{ color: tipoImovel === 'Tipo de Imóvel' ? '#A0AEC0' : '#2D3748', fontSize: 15 }}>{tipoImovel}</Text>
        <Text style={styles.arrowIcon}>▾</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <View style={{ flex: 2.2 }}>
          <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} placeholderTextColor="#A0AEC0" />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <TouchableOpacity style={[styles.input, styles.pickerSelector]} onPress={() => setModalUfVisivel(true)}>
            <Text style={{ color: estado === 'UF' ? '#A0AEC0' : '#2D3748', fontSize: 15 }}>{estado}</Text>
            <Text style={styles.arrowIcon}>▾</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={[styles.input, styles.pickerSelector]} onPress={() => setModalPaisVisivel(true)}>
        <Text style={styles.pickerText}>{pais}</Text>
        <Text style={styles.arrowIcon}>▾</Text>
      </TouchableOpacity>

      <TextInput style={[styles.input, { marginBottom: erroSenha ? 10 : 15 }]} placeholder="Senha" value={senha} onChangeText={handleSenhaChange} secureTextEntry placeholderTextColor="#A0AEC0" />
      {erroSenha ? <Text style={styles.passwordHintDynamic}>{erroSenha}</Text> : null}

      <TextInput style={[styles.input, { marginTop: 5, marginBottom: erroConfirmarSenha ? 10 : 15 }]} placeholder="Confirmar Senha" value={confirmarSenha} onChangeText={handleConfirmarSenhaChange} secureTextEntry placeholderTextColor="#A0AEC0" />
      {erroConfirmarSenha ? <Text style={styles.passwordHintDynamic}>{erroConfirmarSenha}</Text> : null}

      <TouchableOpacity style={styles.primaryButton} onPress={validarFormularioAoSalvar}>
        <Text style={styles.primaryButtonText}>Cadastrar</Text>
      </TouchableOpacity>

      <View style={styles.footerLinkRow}>
        <Text style={styles.footerText}>Já tem uma conta? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginLink}>Clique aqui para entrar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backLink} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.backLinkText}>Voltar para a tela inicial</Text>
      </TouchableOpacity>

      <Modal visible={modalDdiVisivel} transparent animationType="fade"><TouchableOpacity style={styles.modalOverlay} onPress={() => setModalDdiVisivel(false)}><View style={styles.modalContent}><FlatList data={listaDdis} keyExtractor={(item) => item} renderItem={({ item }) => (<TouchableOpacity style={styles.modalItem} onPress={() => { setDdi(item); setModalDdiVisivel(false); }}><Text style={styles.modalItemText}>{item}</Text></TouchableOpacity>)} /></View></TouchableOpacity></Modal>
      <Modal visible={modalImovelVisivel} transparent animationType="fade"><TouchableOpacity style={styles.modalOverlay} onPress={() => setModalImovelVisivel(false)}><View style={styles.modalContent}><FlatList data={listaTiposImovel} keyExtractor={(item) => item} renderItem={({ item }) => (<TouchableOpacity style={styles.modalItem} onPress={() => { setTipoImovel(item); setModalImovelVisivel(false); }}><Text style={styles.modalItemText}>{item}</Text></TouchableOpacity>)} /></View></TouchableOpacity></Modal>
      <Modal visible={modalUfVisivel} transparent animationType="fade"><TouchableOpacity style={styles.modalOverlay} onPress={() => setModalUfVisivel(false)}><View style={styles.modalContent}><FlatList data={listaUfs} keyExtractor={(item) => item} renderItem={({ item }) => (<TouchableOpacity style={styles.modalItem} onPress={() => { setEstado(item); setModalUfVisivel(false); }}><Text style={styles.modalItemText}>{item}</Text></TouchableOpacity>)} /></View></TouchableOpacity></Modal>
      <Modal visible={modalPaisVisivel} transparent animationType="fade"><TouchableOpacity style={styles.modalOverlay} onPress={() => setModalPaisVisivel(false)}><View style={styles.modalContent}><FlatList data={listaPaises} keyExtractor={(item) => item} renderItem={({ item }) => (<TouchableOpacity style={styles.modalItem} onPress={() => { setPais(item); setModalPaisVisivel(false); }}><Text style={styles.modalItemText}>{item}</Text></TouchableOpacity>)} /></View></TouchableOpacity></Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF9' },
  content: { padding: 25, paddingTop: 30, paddingBottom: 40 },
  cardHeader: { alignItems: 'center', marginBottom: 25 },
  cardTitle: { fontSize: 26, fontWeight: 'bold', color: '#1A202C' },
  cardSubtitle: { fontSize: 13, color: '#718096', textAlign: 'center', marginTop: 5, lineHeight: 18 },
  input: { borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, backgroundColor: '#FFF', color: '#2D3748', marginBottom: 15 },
  row: { flexDirection: 'row' },
  pickerSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pickerText: { color: '#2D3748', fontSize: 15 },
  arrowIcon: { color: '#A0AEC0', fontSize: 14, fontWeight: 'bold' },
  cepWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  loader: { position: 'absolute', right: 16 },
  errorHintText: { color: '#E53E3E', fontSize: 12, fontWeight: '600', marginTop: 4, textAlign: 'center' },
  passwordHintDynamic: { color: '#E53E3E', fontSize: 12, fontWeight: '500', paddingHorizontal: 4, marginBottom: 12, lineHeight: 16 },
  primaryButton: { backgroundColor: '#8DC4A6', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 15 },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footerLinkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 25, marginBottom: 5 },
  footerText: { color: '#718096', fontSize: 14 },
  loginLink: { color: '#8DC4A6', fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline' },
  backLink: { marginTop: 15, alignItems: 'center' },
  backLinkText: { color: '#A0AEC0', fontSize: 13, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', maxHeight: '50%', backgroundColor: '#FFF', borderRadius: 16, padding: 10, borderWidth: 1, borderColor: '#8DC4A6', elevation: 5 },
  modalItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingHorizontal: 15 },
  modalItemText: { fontSize: 16, color: '#2D3748', fontWeight: '500' },
  toggleContainer: { flexDirection: 'row', marginBottom: 15, borderRadius: 12, borderWidth: 1, borderColor: '#8DC4A6', overflow: 'hidden' },
  toggleButton: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#FFF' },
  activeTutor: { backgroundColor: '#8DC4A6' },
  activeONG: { backgroundColor: '#8DC4A6' },
  activeText: { color: '#FFF', fontWeight: 'bold' },
  inactiveText: { color: '#8DC4A6', fontWeight: 'bold' }
});