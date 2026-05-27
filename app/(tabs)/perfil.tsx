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

  // ================= CONTROLE DE TIPO DE CONTA (REGRA DO TCC) =================
  // Altere para 'ong' para testar e apresentar a interface da instituição!
  const [tipoConta, setTipoConta] = useState<'tutor' | 'ong'>('tutor');

  // ================= ESTADOS DO PERFIL DO TUTOR =================
  const [editando, setEditando] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [tipoLugar, setTipoLugar] = useState('Casa');
  const [buscandoCep, setBuscandoCep] = useState(false);

  // ================= ESTADOS EXCLUSIVOS DA ONG =================
  const [nomeONG, setNomeONG] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [descricaoONG, setDescricaoONG] = useState('');

  // Lista de eventos que a ONG cadastrou para a página de ONGs
  const [meusEventos, setMeusEventos] = useState([
    { id: 'e1', titulo: 'Feira de Adoção e Castração Regional', data: '14/06/2026', local: 'Praça Central' }
  ]);

  // ================= ESTADOS DO CHAT =================
  const [chatSelecionado, setChatSelecionado] = useState<any | null>(null);
  const [textoMensagem, setTextoMensagem] = useState('');
  const [termoPesquisa, setTermoPesquisa] = useState('');

  const [conversas, setConversas] = useState([
    { id: '1', nome: 'Ana Silva', ultimaMsg: 'Ele é um cachorro lindo!!! adorei!!!!', hora: '10:30', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150', petNome: 'Thor', petStatus: 'Disponível' }
  ]);

  const [mensagensPorChat, setMensagensPorChat] = useState<{ [key: string]: any[] }>({
    '1': [
      { id: 'm1', texto: 'Olá! Vi o anúncio do Thor e fiquei interessada.', remetente: 'outro' },
      { id: 'm2', texto: 'Quero adotar este pet!', remetente: 'outro' }
    ]
  });

  // ================= ESTADOS DE FAVORITOS (RESTAURADO E AMPLO) =================
  const [petsFavoritos, setPetsFavoritos] = useState([
    { id: 'f1', nome: 'Mel', especie: 'Gata', idade: '3 meses', ong: 'Anjos de Patas', foto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=300', status: 'Disponível' },
    { id: 'f2', nome: 'Thor', especie: 'Cachorro', idade: '2 meses', ong: 'Protetores Itanhaém', foto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300', status: 'Adotado' }
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
    const novaMsg = { id: String(Date.now()), texto: textoMensagem, remetente: 'eu' };
    const msgsAtuais = mensagensPorChat[chatSelecionado.id] || [];
    setMensagensPorChat({ ...mensagensPorChat, [chatSelecionado.id]: [...msgsAtuais, novaMsg] });
    setTextoMensagem('');
  };

  // Cadastrar Novo Evento da ONG para injetar na aba de ONGs
  const handleCriarEvento = () => {
    Alert.alert('Novo Evento', 'Evento publicado! Ele será listado automaticamente na aba oficial de ONGs do aplicativo.');
  };

  return (
    <View style={styles.container}>

      {/* ================= SIDEBAR LATERAL FIXA ================= */}
      <View style={styles.sidebar}>

        {/* Chaveador rápido de teste para vocês mostrarem na apresentação */}
        <TouchableOpacity
          style={styles.toggleAccountBtn}
          onPress={() => {
            const novoTipo = tipoConta === 'tutor' ? 'ong' : 'tutor';
            setTipoConta(novoTipo);
            setAbaAtiva('perfil');
            setEditando(false);
          }}
        >
          <Text style={styles.toggleAccountText}>Simular: {tipoConta.toUpperCase()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sidebarBtn, abaAtiva === 'perfil' && styles.sidebarBtnActive]} onPress={() => { setAbaAtiva('perfil'); setEditando(false); }}>
          <Ionicons name="person-outline" size={20} color={abaAtiva === 'perfil' ? '#8DC4A6' : '#4A5568'} />
          <Text style={[styles.sidebarBtnText, abaAtiva === 'perfil' && styles.sidebarBtnTextActive]}>
            {tipoConta === 'tutor' ? 'Perfil' : 'Painel ONG'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sidebarBtn, abaAtiva === 'chat' && styles.sidebarBtnActive]} onPress={() => { setAbaAtiva('chat'); setChatSelecionado(null); }}>
          <Ionicons name="chatbubbles-outline" size={20} color={abaAtiva === 'chat' ? '#8DC4A6' : '#4A5568'} />
          <Text style={[styles.sidebarBtnText, abaAtiva === 'chat' && styles.sidebarBtnTextActive]}>Chat</Text>
        </TouchableOpacity>

        {/* Adotantes veem Favoritos, ONGs veem Gerenciamento de Eventos */}
        {tipoConta === 'tutor' ? (
          <TouchableOpacity style={[styles.sidebarBtn, abaAtiva === 'favoritos' && styles.sidebarBtnActive]} onPress={() => setAbaAtiva('favoritos')}>
            <Ionicons name="heart-outline" size={20} color={abaAtiva === 'favoritos' ? '#8DC4A6' : '#4A5568'} />
            <Text style={[styles.sidebarBtnText, abaAtiva === 'favoritos' && styles.sidebarBtnTextActive]}>Favoritos</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.sidebarBtn, abaAtiva === 'eventos_ong' && styles.sidebarBtnActive]} onPress={() => setAbaAtiva('eventos_ong')}>
            <Ionicons name="calendar-outline" size={20} color={abaAtiva === 'eventos_ong' ? '#8DC4A6' : '#4A5568'} />
            <Text style={[styles.sidebarBtnText, abaAtiva === 'eventos_ong' && styles.sidebarBtnTextActive]}>Meus Eventos</Text>
          </TouchableOpacity>
        )}

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

      {/* ================= ÁREA DE CONTEÚDO DINÂMICO ================= */}
      <View style={styles.contentArea}>

        {/* ABA: PERFIL DINÂMICO (TUTOR OU ONG) */}
        {abaAtiva === 'perfil' && (
          <ScrollView showsVerticalScrollIndicator={false}>

            {/* INTERFACE DO TUTOR COMUM */}
            {tipoConta === 'tutor' && (
              <View>
                <View style={styles.avatarSection}>
                  <View style={styles.avatarPlaceholder}><Ionicons name="person" size={40} color="#A0AEC0" /></View>
                  <Text style={styles.profileNameText}>{nomeCompleto || 'Tutor Adotante'}</Text>
                  <Text style={styles.profileUsernameText}>@{username || 'username'}</Text>
                </View>

                {!editando ? (
                  <View style={styles.infoCardCard}>
                    <Text style={styles.infoTitle}>Dados de Perfil</Text>
                    <Text style={styles.infoMetaLabel}>E-mail:</Text>
                    <Text style={styles.infoMetaValue}>{email || 'Não informado'}</Text>
                    <Text style={styles.infoMetaLabel}>Telefone:</Text>
                    <Text style={styles.infoMetaValue}>{telefone || 'Não informado'}</Text>
                    <Text style={styles.infoMetaLabel}>Residência:</Text>
                    <Text style={styles.infoMetaValue}>{cidade ? `${bairro}, ${cidade} - ${estado}` : 'Sem endereço'}</Text>

                    <TouchableOpacity style={styles.btnEditarPerfil} onPress={() => setEditando(true)}>
                      <Ionicons name="create-outline" size={16} color="#FFF" />
                      <Text style={styles.btnEditarPerfilText}>Editar Informações</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.formCard}>
                    <Text style={styles.infoTitle}>Atualizar Dados</Text>
                    <TextInput style={styles.input} value={nomeCompleto} onChangeText={setNomeCompleto} placeholder="Nome Completo" />
                    <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" style={{ marginTop: 8 }} />
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="E-mail" style={{ marginTop: 8 }} />
                    <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="Telefone" style={{ marginTop: 8 }} />
                    <View style={[styles.cepRow, { marginTop: 8 }]}>
                      <TextInput style={[styles.input, { flex: 1 }]} value={cep} onChangeText={lidarBuscaCep} placeholder="CEP" maxLength={8} />
                    </View>
                    <TextInput style={styles.inputDisabled} editable={false} value={cidade ? `${cidade} - ${estado}` : ''} placeholder="Preenchido pelo CEP" style={{ marginTop: 8 }} />
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
                      <TouchableOpacity style={styles.btnCancelarForm} onPress={() => setEditando(false)}><Text style={styles.btnCancelarFormText}>Cancelar</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.btnSalvarForm} onPress={() => setEditando(false)}><Text style={styles.btnSalvarFormText}>Salvar</Text></TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* INTERFACE EXCLUSIVA DA ONG */}
            {tipoConta === 'ong' && (
              <View>
                <View style={styles.avatarSection}>
                  <View style={[styles.avatarPlaceholder, { borderColor: '#8DC4A6' }]}><Ionicons name="business" size={40} color="#8DC4A6" /></View>
                  <Text style={styles.profileNameText}>{nomeONG || 'Nome Institucional da ONG'}</Text>
                  <Text style={styles.profileUsernameText}>CNPJ: {cnpj || '00.000.000/0001-00'}</Text>
                </View>

                {!editando ? (
                  <View style={styles.infoCardCard}>
                    <Text style={styles.infoTitle}>Dados Institucionais (ONG)</Text>
                    <Text style={styles.infoMetaLabel}>Descrição / Missão:</Text>
                    <Text style={styles.infoMetaValue}>{descricaoONG || 'Nenhuma biografia adicionada.'}</Text>
                    <Text style={styles.infoMetaLabel}>E-mail de Contato:</Text>
                    <Text style={styles.infoMetaValue}>{email || 'Não informado'}</Text>

                    <TouchableOpacity style={styles.btnEditarPerfil} onPress={() => setEditando(true)}>
                      <Ionicons name="construct-outline" size={16} color="#FFF" />
                      <Text style={styles.btnEditarPerfilText}>Configurar Perfil da ONG</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.formCard}>
                    <Text style={styles.infoTitle}>Editar Perfil Corporativo</Text>
                    <Text style={styles.fieldLabel}>Razão Social / Nome da ONG</Text>
                    <TextInput style={styles.input} value={nomeONG} onChangeText={setNomeONG} placeholder="Ex: Anjos de Patas" />
                    <Text style={styles.fieldLabel}>CNPJ</Text>
                    <TextInput style={styles.input} value={cnpj} onChangeText={setCnpj} placeholder="00.000.000/0001-00" />
                    <Text style={styles.fieldLabel}>E-mail Institucional</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="contato@ong.org" />
                    <Text style={styles.fieldLabel}>Biografia / Missão da ONG</Text>
                    <TextInput style={[styles.input, { height: 70 }]} multiline value={descricaoONG} onChangeText={setDescricaoONG} placeholder="Fale um pouco sobre o trabalho da instituição..." />

                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
                      <TouchableOpacity style={styles.btnCancelarForm} onPress={() => setEditando(false)}><Text style={styles.btnCancelarFormText}>Cancelar</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.btnSalvarForm} onPress={() => setEditando(false)}><Text style={styles.btnSalvarFormText}>Salvar Perfil</Text></TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

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
                  <TextInput style={styles.searchInput} placeholder="Pesquisar..." value={termoPesquisa} onChangeText={setTermoPesquisa} />
                </View>
                <FlatList
                  data={conversasFiltradas}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.chatCardFullRow} onPress={() => setChatSelecionado(item)}>
                      <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={styles.chatOngName}>{item.nome}</Text>
                          <Text style={styles.chatTime}>{item.hora}</Text>
                        </View>
                        <Text style={styles.chatLastMsg} numberOfLines={1}>{item.ultimaMsg}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            ) : (
              <View style={styles.chatWindowFullContainer}>
                <View style={styles.chatWindowHeader}>
                  <TouchableOpacity style={styles.btnVoltarChat} onPress={() => setChatSelecionado(null)}><Ionicons name="chevron-back" size={22} color="#4A5568" /></TouchableOpacity>
                  <Text style={styles.activeChatName}>{chatSelecionado.nome}</Text>
                </View>
                <ScrollView style={{ flex: 1, padding: 12 }}>
                  {(mensagensPorChat[chatSelecionado.id] || []).map((msg) => (
                    <View key={msg.id} style={[styles.bubble, msg.remetente === 'eu' ? styles.bubbleEu : styles.bubbleOutro]}>
                      <Text style={msg.remetente === 'eu' ? styles.textEu : styles.textOutro}>{msg.texto}</Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.chatInputBar}>
                  <TextInput style={styles.chatTextInput} value={textoMensagem} onChangeText={setTextoMensagem} placeholder="Conversar..." />
                  <TouchableOpacity style={styles.btnSendMsg} onPress={handleEnviarMensagem}><Ionicons name="send" size={15} color="#FFF" /></TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ABA: FAVORITOS DO ADOTANTE (CARDS AMPLOS E CORRIGIDOS) */}
        {abaAtiva === 'favoritos' && tipoConta === 'tutor' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.subPageTitle}>Meus Pets Salvos</Text>
            {petsFavoritos.length === 0 ? (
              <Text style={{ color: '#A0AEC0', textAlign: 'center', marginTop: 40 }}>Nenhum pet favoritado ainda.</Text>
            ) : (
              petsFavoritos.map(pet => (
                <View key={pet.id} style={styles.favWideCard}>
                  <Image source={{ uri: pet.foto }} style={styles.favWideImg} />
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.favPetNameText}>{pet.nome}</Text>
                      <View style={[styles.statusBadge, pet.status === 'Adotado' && { backgroundColor: '#FED7D7' }]}>
                        <Text style={[styles.statusBadgeText, pet.status === 'Adotado' && { color: '#E53E3E' }]}>{pet.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.favPetMetaText}>{pet.especie} • {pet.idade}</Text>
                    <Text style={styles.favPetOngText}>Responsável: {pet.ong}</Text>
                  </View>
                  <TouchableOpacity style={styles.btnRemoveFav} onPress={() => setPetsFavoritos(petsFavoritos.filter(p => p.id !== pet.id))}>
                    <Ionicons name="heart" size={22} color="#E53E3E" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* ABA: EXCLUSIVA DA ONG CADASTRAR EVENTOS */}
        {abaAtiva === 'eventos_ong' && tipoConta === 'ong' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.subPageTitle}>Gerenciar Campanhas e Eventos</Text>
            <TouchableOpacity style={styles.btnSalvarForm} onPress={handleCriarEvento}>
              <Text style={styles.btnSalvarFormText}>+ Criar Nova Feira / Campanha</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitleText, { marginTop: 20 }]}>Meus Eventos Publicados</Text>
            {meusEventos.map(ev => (
              <View key={ev.id} style={styles.infoCardCard}>
                <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#2D3748' }}>{ev.titulo}</Text>
                <Text style={{ fontSize: 12, color: '#718096', marginTop: 4 }}>Data: {ev.data} | Local: {ev.local}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* OUTRAS ABAS */}
        {abaAtiva === 'relatorios' && <Text style={styles.subPageTitle}>Histórico e Relatórios de Adoção</Text>}
        {abaAtiva === 'localizacao' && <Text style={styles.subPageTitle}>Minhas Localizações</Text>}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#FEFDF9' },
  sidebar: { width: 105, backgroundColor: '#FFF', borderRightWidth: 1, borderRightColor: '#E2E8F0', paddingTop: 30, gap: 8, alignItems: 'center' },
  sidebarBtn: { width: '90%', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 4 },
  sidebarBtnActive: { backgroundColor: '#EBF7F0' },
  sidebarBtnText: { fontSize: 11, color: '#4A5568', fontWeight: '500' },
  sidebarBtnTextActive: { color: '#8DC4A6', fontWeight: 'bold' },
  sidebarBtnSair: { width: '90%', paddingVertical: 12, alignItems: 'center', gap: 4, marginTop: 'auto', marginBottom: 20 },
  sidebarBtnTextSair: { fontSize: 11, color: '#E53E3E', fontWeight: 'bold' },
  contentArea: { flex: 1, padding: 15 },
  subPageTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3748', marginBottom: 15 },

  toggleAccountBtn: { backgroundColor: '#4A5568', paddingVertical: 4, paddingHorizontal: 6, borderRadius: 6, marginBottom: 10 },
  toggleAccountText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },

  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EDF2F7', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#CBD5E0' },
  profileNameText: { fontSize: 16, fontWeight: 'bold', color: '#2D3748', marginTop: 8 },
  profileUsernameText: { fontSize: 12, color: '#718096' },

  infoCardCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10 },
  infoTitle: { fontSize: 14, fontWeight: 'bold', color: '#2D3748', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#EDF2F7', paddingBottom: 6 },
  infoMetaLabel: { fontSize: 11, color: '#718096', fontWeight: 'bold', marginTop: 8 },
  infoMetaValue: { fontSize: 13, color: '#2D3748', marginBottom: 4 },
  btnEditarPerfil: { backgroundColor: '#8DC4A6', flexDirection: 'row', height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 15 },
  btnEditarPerfilText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  sectionTitleText: { fontSize: 14, fontWeight: 'bold', color: '#2D3748', marginBottom: 10 },

  // FORM CARDS
  formCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  fieldLabel: { fontSize: 12, color: '#4A5568', fontWeight: 'bold', marginTop: 8, marginBottom: 4 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 8, height: 38, paddingHorizontal: 10, fontSize: 13, width: '100%' },
  inputDisabled: { backgroundColor: '#E2E8F0', borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 8, height: 38, paddingHorizontal: 10, fontSize: 13, color: '#4A5568' },
  cepRow: { flexDirection: 'row', alignItems: 'center' },
  inlineFieldsRow: { flexDirection: 'row' },
  btnCancelarForm: { flex: 1, height: 38, borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnCancelarFormText: { color: '#718096', fontSize: 13, fontWeight: 'bold' },
  btnSalvarForm: { flex: 2, height: 38, backgroundColor: '#8DC4A6', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnSalvarFormText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },

  // CARDS DE FAVORITOS AMPLOS
  favWideCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', gap: 14, marginBottom: 10, alignItems: 'center' },
  favWideImg: { width: 65, height: 65, borderRadius: 12 },
  favPetNameText: { fontSize: 15, fontWeight: 'bold', color: '#2D3748' },
  favPetMetaText: { fontSize: 12, color: '#718096', marginTop: 2 },
  favPetOngText: { fontSize: 11, color: '#8DC4A6', fontWeight: '500', marginTop: 2 },
  statusBadge: { backgroundColor: '#EBF7F0', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  statusBadgeText: { color: '#8DC4A6', fontSize: 10, fontWeight: 'bold' },
  btnRemoveFav: { padding: 10, marginLeft: 'auto' },

  // CHAT STYLES
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 10, paddingHorizontal: 12, height: 40, marginBottom: 15 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13 },
  chatCardFullRow: { flexDirection: 'row', padding: 14, backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', gap: 12, marginBottom: 10 },
  chatAvatar: { width: 44, height: 44, borderRadius: 22 },
  chatOngName: { fontSize: 13, fontWeight: 'bold', color: '#1A202C' },
  chatTime: { fontSize: 10, color: '#A0AEC0' },
  chatLastMsg: { fontSize: 12, color: '#718096', marginTop: 2 },
  miniPetContext: { fontSize: 10, color: '#8DC4A6', fontWeight: '500', marginTop: 3 },
  chatWindowFullContainer: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  chatWindowHeader: { height: 55, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  btnVoltarChat: { padding: 6 },
  activeChatName: { fontSize: 13, fontWeight: 'bold', color: '#2D3748', marginLeft: 8 },
  bubble: { padding: 11, borderRadius: 14, marginVertical: 5, maxWidth: '75%' },
  bubbleEu: { backgroundColor: '#8DC4A6', alignSelf: 'flex-end' },
  bubbleOutro: { backgroundColor: '#FFF', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#E2E8F0' },
  textEu: { color: '#FFF', fontSize: 13 },
  textOutro: { color: '#2D3748', fontSize: 13 },
  chatInputBar: { height: 52, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 8 },
  chatTextInput: { flex: 1, backgroundColor: '#F1F5F9', height: 36, borderRadius: 18, paddingHorizontal: 14, fontSize: 13 },
  btnSendMsg: { backgroundColor: '#8DC4A6', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' }
});