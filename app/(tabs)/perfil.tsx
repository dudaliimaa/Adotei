import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ActivityIndicator,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function PerfilScreen() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState('perfil'); 

  // ================= ESTADOS DO PERFIL =================
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [nomeCompleto, setNomeCompleto] = useState('Eduarda de Lima Sales');
  const [username, setUsername] = useState('duda_lima');
  const [email, setEmail] = useState('eduarda@fatec.sp.gov.br');
  const [telefone, setTelefone] = useState('(13) 99999-8888');
  const [cep, setCep] = useState('11740000');
  const [cidade, setCidade] = useState('Itanhaém');
  const [estado, setEstado] = useState('SP');
  const [bairro, setBairro] = useState('Centro');
  const [numero, setNumero] = useState('100');
  const [tipoLugar, setTipoLugar] = useState('Casa');
  const [buscandoCep, setBuscandoCep] = useState(false);

  // ================= ESTADOS DO CHAT =================
  const [chatSelecionado, setChatSelecionado] = useState<any | null>(null);
  const [textoMensagem, setTextoMensagem] = useState('');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  
  const [conversas, setConversas] = useState([
    { id: '1', nome: 'Ana Silva', ultimaMsg: 'Ele é um cachorro lindo!!! adorei!!!!', hora: '10:30', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150', petNome: 'Thor', petStatus: 'Disponível' },
    { id: '2', nome: 'Carlos Roberto', ultimaMsg: 'Espero que se adapte bem.', hora: '09:45', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150', petNome: 'Pipoca', petStatus: 'Disponível' },
    { id: '3', nome: 'Maria Santos', ultimaMsg: '📷 Foto enviada', hora: '08:20', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150', petNome: 'Mel', petStatus: 'Disponível' },
    { id: '4', nome: 'João Pedro', ultimaMsg: '...', hora: 'Ontem', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150', petNome: 'Bidu', petStatus: 'Disponível' }
  ]);

  const [mensagensPorChat, setMensagensPorChat] = useState<{ [key: string]: any[] }>({
    '1': [
      { id: 'm1', texto: 'Olá! Vi o anúncio do Thor e fiquei interessada.', remetente: 'outro', tipo: 'texto' },
      { id: 'm2', texto: 'Quero adotar este pet!', remetente: 'outro', tipo: 'texto' },
      { id: 'm3', texto: 'Ele é um cachorro lindo!!! adorei!!!!', remetente: 'outro', tipo: 'texto' }
    ]
  });

  const [petsFavoritos, setPetsFavoritos] = useState([
    { id: '1', nome: 'Thor', especie: 'Cachorro', idade: '2 meses', foto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300' },
    { id: '2', nome: 'Pipoca', especie: 'Gato', idade: '1 ano', foto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=300' }
  ]);

  const conversasFiltradas = conversas.filter(c => 
    c.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const lidarBuscaCep = async (valorCep: string) => {
    const cepLimpo = valorCep.replace(/\D/g, '');
    setCep(cepLimpo);
    if (cepLimpo.length === 8) {
      setBuscandoCep(true);
      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();
        if (!dados.erro) {
          setCidade(dados.localidade); setBairro(dados.bairro); setEstado(dados.uf);
        }
      } catch (e) { console.log(e); } finally { setBuscandoCep(false); }
    }
  };

  const handleEnviarMensagem = () => {
    if (!textoMensagem.trim() || !chatSelecionado) return;

    const novaMsg = {
      id: String(Date.now()),
      texto: textoMensagem,
      remetente: 'eu',
      tipo: 'texto'
    };

    const msgsAtuais = mensagensPorChat[chatSelecionado.id] || [];
    setMensagensPorChat({
      ...mensagensPorChat,
      [chatSelecionado.id]: [...msgsAtuais, novaMsg]
    });

    setConversas(conversas.map(c => c.id === chatSelecionado.id ? { ...c, ultimaMsg: textoMensagem } : c));
    setTextoMensagem('');
  };

  const handleAnexarMidia = async (tipo: 'camera' | 'galeria') => {
    let resultado;
    if (tipo === 'camera') {
      await ImagePicker.requestCameraPermissionsAsync();
      resultado = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.8 });
    } else {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.8 });
    }

    if (!resultado.canceled && resultado.assets[0].uri) {
      const novaMsg = {
        id: String(Date.now()),
        texto: resultado.assets[0].uri,
        remetente: 'eu',
        tipo: resultado.assets[0].type === 'video' ? 'video' : 'imagem'
      };

      const msgsAtuais = mensagensPorChat[chatSelecionado.id] || [];
      setMensagensPorChat({ ...mensagensPorChat, [chatSelecionado.id]: [...msgsAtuais, novaMsg] });
    }
  };

  const handleMarcarComoAdotado = () => {
    if (!chatSelecionado) return;

    Alert.alert(
      'Confirmar Adoção 🎉',
      `Você confirma que o pet ${chatSelecionado.petNome} foi adotado por ${chatSelecionado.nome}? Ele sairá da lista pública.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, Confirmar!',
          onPress: () => {
            setConversas(conversas.map(c => c.id === chatSelecionado.id ? { ...c, petStatus: 'Adotado' } : c));
            Alert.alert('Sucesso!', 'O status do animal foi updated e o anúncio público foi finalizado.');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      
      {/* ================= BARRA LATERAL FIXA DA ESQUERDA (SIDEBAR) ================= */}
      <View style={styles.sidebar}>
        <TouchableOpacity style={[styles.sidebarBtn, abaAtiva === 'perfil' && styles.sidebarBtnActive]} onPress={() => setAbaAtiva('perfil')}>
          <Ionicons name="person-outline" size={20} color={abaAtiva === 'perfil' ? '#8DC4A6' : '#4A5568'} />
          <Text style={[styles.sidebarBtnText, abaAtiva === 'perfil' && styles.sidebarBtnTextActive]}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sidebarBtn, abaAtiva === 'chat' && styles.sidebarBtnActive]} onPress={() => { setAbaAtiva('chat'); setChatSelecionado(null); }}>
          <Ionicons name="chatbubbles-outline" size={20} color={abaAtiva === 'chat' ? '#8DC4A6' : '#4A5568'} />
          <Text style={[styles.sidebarBtnText, abaAtiva === 'chat' && styles.sidebarBtnTextActive]}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sidebarBtn, abaAtiva === 'favoritos' && styles.sidebarBtnActive]} onPress={() => setAbaAtiva('favoritos')}>
          <Ionicons name="heart-outline" size={20} color={abaAtiva === 'favoritos' ? '#8DC4A6' : '#4A5568'} />
          <Text style={[styles.sidebarBtnText, abaAtiva === 'favoritos' && styles.sidebarBtnTextActive]}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sidebarBtn, abaAtiva === 'relatorios' && styles.sidebarBtnActive]} onPress={() => setAbaAtiva('relatorios')}>
          <Ionicons name="document-text-outline" size={20} color={abaAtiva === 'relatorios' ? '#8DC4A6' : '#4A5568'} />
          <Text style={[styles.sidebarBtnText, abaAtiva === 'relatorios' && styles.sidebarBtnTextActive]}>Relatórios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sidebarBtn, abaAtiva === 'localizacao' && styles.sidebarBtnActive]} onPress={() => setAbaAtiva('localizacao')}>
          <Ionicons name="location-outline" size={20} color={abaAtiva === 'localizacao' ? '#8DC4A6' : '#4A5568'} />
          <Text style={[styles.sidebarBtnText, abaAtiva === 'localizacao' && styles.sidebarBtnTextActive]}>Localização</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sidebarBtnSair} onPress={() => router.replace('/tutorial')}>
          <Ionicons name="log-out-outline" size={18} color="#E53E3E" />
          <Text style={styles.sidebarBtnTextSair}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* ================= ÁREA DE CONTEÚDO DA DIREITA ================= */}
      <View style={styles.contentArea}>
        
        {/* ABA: PERFIL */}
        {abaAtiva === 'perfil' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarPlaceholder}><Ionicons name="person" size={40} color="#A0AEC0" /></View>
              <Text style={styles.profileNameText}>{nomeCompleto}</Text>
              <Text style={styles.profileUsernameText}>@{username}</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.fieldLabel}>Nome</Text>
              <TextInput style={styles.input} value={nomeCompleto} onChangeText={setNomeCompleto} />

              <Text style={styles.fieldLabel}>Nome de Usuário (Username)</Text>
              <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" />

              <Text style={styles.fieldLabel}>E-mail</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

              <Text style={styles.fieldLabel}>Telefone</Text>
              <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

              <Text style={styles.fieldLabel}>CEP</Text>
              <View style={styles.cepRow}>
                <TextInput style={[styles.input, { flex: 1 }]} value={cep} onChangeText={lidarBuscaCep} keyboardType="numeric" maxLength={8} />
                {buscandoCep && <ActivityIndicator size="small" color="#8DC4A6" style={styles.loader} />}
              </View>

              <Text style={styles.fieldLabel}>Cidade / Estado</Text>
              <TextInput style={styles.inputDisabled} editable={false} value={`${cidade} - ${estado}`} />

              <View style={styles.inlineFieldsRow}>
                <View style={{ flex: 1, marginRight: 10 }}><Text style={styles.fieldLabel}>Número</Text><TextInput style={styles.input} value={numero} onChangeText={setNumero} /></View>
                <View style={{ flex: 2 }}><Text style={styles.fieldLabel}>Bairro</Text><TextInput style={styles.inputDisabled} editable={false} value={bairro} /></View>
              </View>

              <Text style={styles.fieldLabel}>Tipo de Espaço</Text>
              <View style={styles.selectorContainer}>
                {['Casa', 'Apartamento', 'Comércio'].map((item) => (
                  <TouchableOpacity key={item} style={[styles.selectorBtn, tipoLugar === item && styles.selectorBtnActive]} onPress={() => setTipoLugar(item)}>
                    <Text style={[styles.selectorBtnText, tipoLugar === item && styles.selectorBtnTextActive]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        )}

        {/* ABA: CHAT */}
        {abaAtiva === 'chat' && (
          <View style={{ flex: 1 }}>
            {!chatSelecionado ? (
              <View style={{ flex: 1 }}>
                <Text style={styles.subPageTitle}>Conversas</Text>
                
                <View style={styles.searchBarContainer}>
                  <Ionicons name="search-outline" size={18} color="#A0AEC0" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar..."
                    placeholderTextColor="#A0AEC0"
                    value={termoPesquisa}
                    onChangeText={setTermoPesquisa}
                  />
                </View>

                <FlatList
                  data={conversasFiltradas}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.chatCardFullRow} onPress={() => setChatSelecionado(item)}>
                      <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={styles.chatOngName}>{item.nome}</Text>
                          <Text style={styles.chatTime}>{item.hora}</Text>
                        </View>
                        <Text style={styles.chatLastMsg} numberOfLines={1}>{item.ultimaMsg}</Text>
                        <Text style={[styles.miniPetContext, item.petStatus === 'Adotado' && { color: '#E53E3E' }]}>
                          Contexto: {item.petNome} ({item.petStatus})
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            ) : (
              <View style={styles.chatWindowFullContainer}>
                <View style={styles.chatWindowHeader}>
                  <TouchableOpacity style={styles.btnVoltarChat} onPress={() => setChatSelecionado(null)}>
                    <Ionicons name="chevron-back" size={22} color="#4A5568" />
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <Image source={{ uri: chatSelecionado.avatar }} style={{ width: 36, height: 36, borderRadius: 18 }} />
                    <View>
                      <Text style={styles.activeChatName}>{chatSelecionado.nome}</Text>
                      <Text style={{ fontSize: 11, color: '#718096' }}>Interesse em: {chatSelecionado.petNome}</Text>
                    </View>
                  </View>

                  {chatSelecionado.petStatus === 'Disponível' ? (
                    <TouchableOpacity style={styles.btnMarcarAdotado} onPress={handleMarcarComoAdotado}>
                      <Ionicons name="checkmark-circle-outline" size={15} color="#FFF" />
                      <Text style={styles.btnMarcarAdotadoText}>Doado!</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.badgeAdotadoSucesso}>
                      <Text style={styles.badgeAdotadoSucessoText}>Adotado 🎉</Text>
                    </View>
                  )}
                </View>

                <ScrollView style={{ flex: 1, padding: 12 }} showsVerticalScrollIndicator={false}>
                  {(mensagensPorChat[chatSelecionado.id] || []).map((msg) => (
                    <View key={msg.id} style={[styles.bubble, msg.remetente === 'eu' ? styles.bubbleEu : styles.bubbleOutro]}>
                      {msg.tipo === 'texto' && <Text style={msg.remetente === 'eu' ? styles.textEu : styles.textOutro}>{msg.texto}</Text>}
                      {msg.tipo === 'imagem' && <Image source={{ uri: msg.texto }} style={{ width: 180, height: 180, borderRadius: 10 }} />}
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.chatInputBar}>
                  <TouchableOpacity style={styles.inputActionBtn} onPress={() => handleAnexarMidia('camera')}>
                    <Ionicons name="camera-outline" size={22} color="#718096" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inputActionBtn} onPress={() => handleAnexarMidia('galeria')}>
                    <Ionicons name="image-outline" size={22} color="#718096" />
                  </TouchableOpacity>

                  <TextInput 
                    style={styles.chatTextInput} 
                    value={textoMensagem} 
                    onChangeText={setTextoMensagem} 
                    placeholder="Conversar..." 
                    placeholderTextColor="#A0AEC0"
                  />

                  <TouchableOpacity style={styles.btnSendMsg} onPress={handleEnviarMensagem}>
                    <Ionicons name="send" size={15} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ABA: FAVORITOS */}
        {abaAtiva === 'favoritos' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.subPageTitle}>Meus Pets Salvos</Text>
            {petsFavoritos.map(pet => (
              <View key={pet.id} style={styles.favCardRow}>
                <Image source={{ uri: pet.foto }} style={styles.favPetImg} />
                <View style={styles.favPetDetails}>
                  <Text style={styles.favPetName}>{pet.nome}</Text>
                  <Text style={styles.favPetMeta}>{pet.especie} • {pet.idade}</Text>
                </View>
                <TouchableOpacity onPress={() => setPetsFavoritos(petsFavoritos.filter(p => p.id !== pet.id))}>
                  <Ionicons name="trash-outline" size={18} color="#E53E3E" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* ABAS ADICIONAIS SECUNDÁRIAS */}
        {abaAtiva === 'relatorios' && <Text style={styles.subPageTitle}>Histórico e Relatórios de Adoção</Text>}
        {abaAtiva === 'localizacao' && <Text style={styles.subPageTitle}>Minhas Localizações</Text>}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#FEFDF9' },
  sidebar: { width: 105, backgroundColor: '#FFF', borderRightWidth: 1, borderRightColor: '#E2E8F0', paddingTop: 70, gap: 8, alignItems: 'center' },
  sidebarBtn: { width: '90%', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 4 },
  sidebarBtnActive: { backgroundColor: '#EBF7F0' },
  sidebarBtnText: { fontSize: 11, color: '#4A5568', fontWeight: '500' },
  sidebarBtnTextActive: { color: '#8DC4A6', fontWeight: 'bold' },
  sidebarBtnSair: { width: '90%', paddingVertical: 12, alignItems: 'center', gap: 4, marginTop: 'auto', marginBottom: 20 },
  sidebarBtnTextSair: { fontSize: 11, color: '#E53E3E', fontWeight: 'bold' },
  contentArea: { flex: 1, padding: 15 },
  subPageTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3748', marginBottom: 15 },
  avatarSection: { alignItems: 'center', marginBottom: 15 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EDF2F7', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#CBD5E0' },
  profileNameText: { fontSize: 15, fontWeight: 'bold', color: '#2D3748', marginTop: 8 },
  profileUsernameText: { fontSize: 12, color: '#718096' },
  formCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 5 },
  fieldLabel: { fontSize: 12, color: '#4A5568', fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 8, height: 38, paddingHorizontal: 10, fontSize: 13 },
  inputDisabled: { backgroundColor: '#E2E8F0', borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 8, height: 38, paddingHorizontal: 10, fontSize: 13, color: '#4A5568' },
  cepRow: { flexDirection: 'row', alignItems: 'center' },
  loader: { position: 'absolute', right: 10 },
  inlineFieldsRow: { flexDirection: 'row' },
  selectorContainer: { flexDirection: 'row', gap: 10, marginTop: 4, marginBottom: 20 },
  selectorBtn: { flex: 1, height: 36, alignItems: 'center', justifyContent: 'center' },
  selectorBtnActive: { borderBottomWidth: 2, borderBottomColor: '#8DC4A6' },
  selectorBtnText: { fontSize: 13, color: '#718096' },
  selectorBtnTextActive: { color: '#2D3748', fontWeight: 'bold' },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 10, paddingHorizontal: 12, height: 40, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#2D3748' },
  chatCardFullRow: { flexDirection: 'row', padding: 14, backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', gap: 12, marginBottom: 10, alignItems: 'center' },
  chatAvatar: { width: 44, height: 44, borderRadius: 22 },
  chatOngName: { fontSize: 13, fontWeight: 'bold', color: '#1A202C' },
  chatTime: { fontSize: 10, color: '#A0AEC0' },
  chatLastMsg: { fontSize: 12, color: '#718096', marginTop: 2 },
  miniPetContext: { fontSize: 10, color: '#8DC4A6', fontWeight: '500', marginTop: 3 },
  chatWindowFullContainer: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  chatWindowHeader: { height: 55, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 4 },
  btnVoltarChat: { padding: 6, marginRight: 2 },
  activeChatName: { fontSize: 13, fontWeight: 'bold', color: '#2D3748' },
  btnMarcarAdotado: { backgroundColor: '#8DC4A6', flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  btnMarcarAdotadoText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  badgeAdotadoSucesso: { backgroundColor: '#E53E3E', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  badgeAdotadoSucessoText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  bubble: { padding: 11, borderRadius: 14, marginVertical: 5, maxWidth: '75%' },
  bubbleEu: { backgroundColor: '#8DC4A6', alignSelf: 'flex-end', borderBottomRightRadius: 0 },
  bubbleOutro: { backgroundColor: '#FFF', alignSelf: 'flex-start', borderBottomLeftRadius: 0, borderWidth: 1, borderColor: '#E2E8F0' },
  textEu: { color: '#FFF', fontSize: 13, lineHeight: 17 },
  textOutro: { color: '#2D3748', fontSize: 13, lineHeight: 17 },
  chatInputBar: { height: 52, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 8 },
  inputActionBtn: { padding: 4 },
  chatTextInput: { flex: 1, backgroundColor: '#F1F5F9', height: 36, borderRadius: 18, paddingHorizontal: 14, fontSize: 13, borderWidth: 1, borderColor: '#E2E8F0', color: '#2D3748' },
  btnSendMsg: { backgroundColor: '#8DC4A6', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  favCardRow: { flexDirection: 'row', padding: 10, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', gap: 10, marginBottom: 8 },
  favPetImg: { width: 44, height: 44, borderRadius: 8 },
  favPetDetails: { flex: 1 },
  favPetName: { fontSize: 13, fontWeight: 'bold', color: '#1A202C' },
  favPetMeta: { fontSize: 11, color: '#718096' }
});