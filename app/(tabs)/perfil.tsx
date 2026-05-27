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
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PerfilScreen() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState('perfil');

  // ================= ESTADOS DO PERFIL (COMEÇANDO EM BRANCO) =================
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

  // O tipo de conta agora muda automaticamente com base no Tipo de Espaço selecionado!
  const [tipoLugar, setTipoLugar] = useState('Casa');
  const tipoConta = (tipoLugar === 'Casa' || tipoLugar === 'Apartamento') ? 'tutor' : 'ong';

  // Dados da ONG (Preenchidos quando tipoLugar for "Comércio/ONG")
  const [nomeONG, setNomeONG] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [descricaoONG, setDescricaoONG] = useState('');
  const [meusEventos, setMeusEventos] = useState([
    { id: 'e1', titulo: 'Feira de Adoção e Castração Regional', data: '14/06/2026', local: 'Praça Central' }
  ]);

  // ================= ESTADOS DO CHAT =================
  const [chatSelecionado, setChatSelecionado] = useState<any | null>(null);
  const [textoMensagem, setTextoMensagem] = useState('');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [conversas, setConversas] = useState([
    { id: '1', nome: 'Ana Silva (Anjos de Patas)', ultimaMsg: 'Ele é um cachorro lindo!!! adorei!!!!', hora: '10:30', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150' }
  ]);

  // ================= ESTADOS DE FAVORITOS =================
  const [petsFavoritos, setPetsFavoritos] = useState([
    { id: 'f1', nome: 'Mel', especie: 'Gata', idade: '3 meses', ong: 'Anjos de Patas', foto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=300', status: 'Disponível' }
  ]);

  // ================= ESTADOS DE RELATÓRIOS =================
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<any | null>(null);
  const [modalRelatorioVisivel, setModalRelatorioVisivel] = useState(false);
  const [historicoRelatorios, setHistoricoRelatorios] = useState([
    {
      id: 'AD-MAI26-001',
      dataAdocao: '26/05/2026',
      pet: { nome: 'Bidu', especie: 'Cachorro', idade: '5 meses', porte: 'Médio', foto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=150' },
      doador: { nome: 'ONG Anjos de Patas Itanhaém', documento: '12.345.678/0001-99', contato: 'contato@anjosdepatas.org' },
      adotante: { nome: 'Eduarda de Lima Sales', documento: '444.555.666-77', contato: 'eduarda.sales@fatec.sp.gov.br', endereco: 'Centro, Itanhaém - SP' }
    }
  ]);

  const abrirRelatorio = (relatorio: any) => {
    setRelatorioSelecionado(relatorio);
    setModalRelatorioVisivel(true);
  };

  const conversasFiltradas = conversas.filter(c =>
    c.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  // Cadastrar Novo Evento da ONG para injetar na aba de ONGs
  const handleCriarEvento = () => {
    Alert.alert('Novo Evento', 'Evento publicado! Ele será listado automaticamente na aba oficial de ONGs do aplicativo.');
  };

  return (
    <View style={styles.container}>

      {/* ================= SIDEBAR LATERAL FIXA (LIMPA SEM O BOTÃO SIMULAR) ================= */}
      <View style={styles.sidebar}>
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
                    <Text style={styles.infoMetaLabel}>Espaço de Criação:</Text>
                    <Text style={styles.infoMetaValue}>{tipoLugar}</Text>
                    <TouchableOpacity style={styles.btnEditarPerfil} onPress={() => setEditando(true)}><Ionicons name="create-outline" size={16} color="#FFF" /><Text style={styles.btnEditarPerfilText}>Editar Informações</Text></TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.formCard}>
                    <Text style={styles.infoTitle}>Atualizar Dados</Text>
                    <TextInput style={styles.input} value={nomeCompleto} onChangeText={setNomeCompleto} placeholder="Nome Completo" />
                    <TextInput style={[styles.input, { marginTop: 8 }]} value={username} onChangeText={setUsername} placeholder="Username" />
                    <TextInput style={[styles.input, { marginTop: 8 }]} value={email} onChangeText={setEmail} placeholder="E-mail" />
                    <TextInput style={[styles.input, { marginTop: 8 }]} value={telefone} onChangeText={setTelefone} placeholder="Telefone" />

                    <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Tipo de Espaço</Text>
                    <View style={styles.selectorContainer}>
                      {['Casa', 'Apartamento', 'Comércio'].map((item) => (
                        <TouchableOpacity key={item} style={[styles.selectorBtn, tipoLugar === item && styles.selectorBtnActive]} onPress={() => setTipoLugar(item)}>
                          <Text style={[styles.selectorBtnText, tipoLugar === item && styles.selectorBtnTextActive]}>{item === 'Comércio' ? 'ONG / Abrigo' : item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}><TouchableOpacity style={styles.btnCancelarForm} onPress={() => setEditando(false)}><Text style={styles.btnCancelarFormText}>Cancelar</Text></TouchableOpacity><TouchableOpacity style={styles.btnSalvarForm} onPress={() => setEditando(false)}><Text style={styles.btnSalvarFormText}>Salvar</Text></TouchableOpacity></View>
                  </View>
                )}
              </View>
            )}

            {/* INTERFACE EXCLUSIVA DA ONG */}
            {tipoConta === 'ong' && (
              <View>
                <View style={styles.avatarSection}>
                  <View style={[styles.avatarPlaceholder, { borderColor: '#8DC4A6' }]}><Ionicons name="business" size={40} color="#8DC4A6" /></View>
                  <Text style={styles.profileNameText}>{nomeONG || 'Nome da Instituição'}</Text>
                  <Text style={styles.profileUsernameText}>CNPJ: {cnpj || 'Não informado'}</Text>
                </View>
                {!editando ? (
                  <View style={styles.infoCardCard}>
                    <Text style={styles.infoTitle}>Painel Corporativo (ONG)</Text>
                    <Text style={styles.infoMetaLabel}>Missão / Descrição:</Text>
                    <Text style={styles.infoMetaValue}>{descricaoONG || 'Nenhuma descrição adicionada.'}</Text>
                    <Text style={styles.infoMetaLabel}>E-mail Institucional:</Text>
                    <Text style={styles.infoMetaValue}>{email || 'Não informado'}</Text>
                    <TouchableOpacity style={styles.btnEditarPerfil} onPress={() => setEditando(true)}><Ionicons name="create-outline" size={16} color="#FFF" /><Text style={styles.btnEditarPerfilText}>Editar Perfil ONG</Text></TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.formCard}>
                    <Text style={styles.infoTitle}>Configurar Perfil Institucional</Text>
                    <TextInput style={styles.input} value={nomeONG} onChangeText={setNomeONG} placeholder="Nome da ONG / Instituição" />
                    <TextInput style={[styles.input, { marginTop: 8 }]} value={cnpj} onChangeText={setCnpj} placeholder="CNPJ (00.000.000/0001-00)" />
                    <TextInput style={[styles.input, { marginTop: 8 }]} value={email} onChangeText={setEmail} placeholder="E-mail de Contato" />
                    <TextInput style={[styles.input, { height: 60, marginTop: 8 }]} multiline value={descricaoONG} onChangeText={setDescricaoONG} placeholder="Fale sobre o trabalho da ONG..." />

                    <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Alterar Tipo de Conta</Text>
                    <View style={styles.selectorContainer}>
                      {['Casa', 'Apartamento', 'Comércio'].map((item) => (
                        <TouchableOpacity key={item} style={[styles.selectorBtn, tipoLugar === item && styles.selectorBtnActive]} onPress={() => setTipoLugar(item)}>
                          <Text style={[styles.selectorBtnText, tipoLugar === item && styles.selectorBtnTextActive]}>{item === 'Comércio' ? 'ONG / Abrigo' : item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}><TouchableOpacity style={styles.btnCancelarForm} onPress={() => setEditando(false)}><Text style={styles.btnCancelarFormText}>Cancelar</Text></TouchableOpacity><TouchableOpacity style={styles.btnSalvarForm} onPress={() => setEditando(false)}><Text style={styles.btnSalvarFormText}>Salvar</Text></TouchableOpacity></View>
                  </View>
                )}
              </View>
            )}

          </ScrollView>
        )}

        {/* OUTRAS ABAS MANTIDAS IGUAIS */}
        {abaAtiva === 'chat' && <Text style={styles.subPageTitle}>Conversas no Chat</Text>}
        {abaAtiva === 'favoritos' && <Text style={styles.subPageTitle}>Meus Pets Salvos</Text>}
        {abaAtiva === 'eventos_ong' && <Text style={styles.subPageTitle}>Gerenciar Campanhas da ONG</Text>}

        {/* ABA RELATÓRIOS COMPARTILHADOS */}
        {abaAtiva === 'relatorios' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.subPageTitle}>Certificados e Relatórios de Adoção</Text>
            {historicoRelatorios.map((rel) => (
              <TouchableOpacity key={rel.id} style={styles.reportRowCard} onPress={() => abrirRelatorio(rel)}>
                <Image source={{ uri: rel.pet.foto }} style={styles.reportPetThumb} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={styles.reportCodeText}>{rel.id}</Text><Text style={styles.reportDateLabel}>{rel.dataAdocao}</Text></View>
                  <Text style={styles.reportMainTitle}>Adoção: {rel.pet.nome}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {abaAtiva === 'localizacao' && <Text style={styles.subPageTitle}>Minhas Localizações</Text>}

      </View>

      {/* MODAL DO RELATÓRIO OFICIAL */}
      <Modal animationType="slide" transparent={true} visible={modalRelatorioVisivel} onRequestClose={() => setModalRelatorioVisivel(false)}>
        <View style={styles.modalOverlayContainer}>
          <View style={styles.modalScrollBox}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <View style={styles.docHeader}>
                <View style={styles.docSealBadgeContent}><Ionicons name="shield-checkmark" size={20} color="#FFF" /><Text style={styles.docSealText}>SELO ADOTEI</Text></View>
                <Text style={styles.docTitle}>RELATÓRIO OFICIAL DE ADOÇÃO</Text>
                <Text style={{ fontSize: 11, color: '#718096' }}>Registro: {relatorioSelecionado?.id}</Text>
              </View>
              <Text style={styles.docSectionTitle}>1. DADOS DO PET</Text>
              <Text style={styles.docValue}>Nome: {relatorioSelecionado?.pet.nome} ({relatorioSelecionado?.pet.especie})</Text>
              <Text style={styles.docSectionTitle}>2. DOADOR RESPONÁVEL</Text>
              <Text style={styles.docValue}>{relatorioSelecionado?.doador.nome}</Text>
              <Text style={styles.docSectionTitle}>3. NOVO TUTOR ADOTANTE</Text>
              <Text style={styles.docValue}>{relatorioSelecionado?.adotante.nome}</Text>
              <TouchableOpacity style={styles.btnCloseDocBtn} onPress={() => setModalRelatorioVisivel(false)}><Text style={{ color: '#FFF', fontWeight: 'bold' }}>Fechar Documento</Text></TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#FEFDF9' },
  sidebar: { width: 105, backgroundColor: '#FFF', borderRightWidth: 1, borderRightColor: '#E2E8F0', paddingTop: 45, gap: 8, alignItems: 'center' },
  sidebarBtn: { width: '90%', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 4 },
  sidebarBtnActive: { backgroundColor: '#EBF7F0' },
  sidebarBtnText: { fontSize: 11, color: '#4A5568', fontWeight: '500' },
  sidebarBtnTextActive: { color: '#8DC4A6', fontWeight: 'bold' },
  sidebarBtnSair: { width: '90%', paddingVertical: 12, alignItems: 'center', gap: 4, marginTop: 'auto', marginBottom: 20 },
  sidebarBtnTextSair: { fontSize: 11, color: '#E53E3E', fontWeight: 'bold' },
  contentArea: { flex: 1, padding: 15 },
  subPageTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3748', marginBottom: 5 },

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
  btnSendMsg: { backgroundColor: '#8DC4A6', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },

  // SELECTOR STYLES (TUTOR E ONG)
  selectorContainer: { flexDirection: 'row', gap: 8, marginTop: 8 },
  selectorBtn: { flex: 1, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E0', alignItems: 'center', justifyContent: 'center' },
  selectorBtnActive: { backgroundColor: '#8DC4A6', borderColor: '#8DC4A6' },
  selectorBtnText: { fontSize: 12, color: '#718096', fontWeight: '500' },
  selectorBtnTextActive: { color: '#FFF', fontWeight: 'bold' },

  // REPORT STYLES
  reportRowCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 12, marginBottom: 10, alignItems: 'center' },
  reportPetThumb: { width: 60, height: 60, borderRadius: 8 },
  reportCodeText: { fontSize: 11, color: '#A0AEC0', fontWeight: 'bold' },
  reportDateLabel: { fontSize: 11, color: '#A0AEC0' },
  reportMainTitle: { fontSize: 13, fontWeight: 'bold', color: '#2D3748', marginTop: 4 },

  // MODAL STYLES
  modalOverlayContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalScrollBox: { backgroundColor: '#FFF', borderRadius: 16, width: '90%', maxHeight: '80%' },
  docHeader: { backgroundColor: '#F1F5F9', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
  docSealBadgeContent: { flexDirection: 'row', backgroundColor: '#8DC4A6', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, alignItems: 'center', gap: 6, marginBottom: 8 },
  docSealText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  docTitle: { fontSize: 14, fontWeight: 'bold', color: '#2D3748', marginBottom: 4 },
  docSectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#2D3748', marginTop: 12, marginBottom: 4 },
  docValue: { fontSize: 12, color: '#718096', marginBottom: 4 },
  btnCloseDocBtn: { backgroundColor: '#8DC4A6', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 20 }
});