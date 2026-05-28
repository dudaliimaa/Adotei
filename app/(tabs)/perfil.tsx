import React, { useState, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { db, auth } from '../../src/config/firebase';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';

import { enviarMensagemWhats } from '../../src/utils/whatsapp.utils';
import { abrirNoMapa } from '../../src/utils/maps.utils';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const conversasSimuladas = [
  { 
    id: 'c1', 
    nome: 'Dona Margarida', 
    ultimaMsg: 'Olá! O Bidu está pronto para adoção?', 
    hora: '10:30', 
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150',
    telefone: '(13) 98888-8888',
    mensagens: [
      { id: 'm1', texto: 'Olá Eduarda, tudo bem? Vi seu interesse no Bidu!', enviadoPorMim: false, tipo: 'texto' },
      { id: 'm2', texto: 'Oi! Tudo bem sim. Ele se dá bem com outros cães?', enviadoPorMim: true, tipo: 'texto' },
      { id: 'm3', texto: 'Sim! Ele é super sociável e brincalhão.', enviadoPorMim: false, tipo: 'texto' },
      { id: 'm4', texto: 'Que ótimo! O Bidu está pronto para adoção?', enviadoPorMim: false, tipo: 'texto' },
    ]
  },
  { 
    id: 'c2', 
    nome: 'Seu Jorge Protetor', 
    ultimaMsg: 'A Mel é super dócil, já tomou a primeira vacina.', 
    hora: 'Ontem', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
    telefone: '(13) 97777-7777',
    mensagens: [
      { id: 'm5', texto: 'Olá! A Mel ainda está disponível para adoção?', enviadoPorMim: true, tipo: 'texto' },
      { id: 'm6', texto: 'Está sim! A Mel é super dócil, já tomou a primeira vacina.', enviadoPorMim: false, tipo: 'texto' },
    ]
  }
];

const relatoriosSimulados = [
  { id: 'AD-2026-01', pet: { nome: 'Bidu', especie: 'Cachorro' }, tipo: 'Adotado', data: '26/05/2026', entidade: 'ONG Proteção Animal', responsavel: 'Margarida Lopes' },
  { id: 'DO-2026-04', pet: { nome: 'Mel', especie: 'Gato' }, tipo: 'Doado', data: '15/04/2026', entidade: 'Adotei Sistema', responsavel: 'Eduarda de Lima Sales' }
];

export default function PerfilScreen() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState('perfil'); 
  const [carregando, setCarregando] = useState(false);

  const [petsFavoritos, setPetsFavoritos] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const carregarFavoritos = async () => {
        try {
          const dados = await AsyncStorage.getItem('@favoritos_adotei');
          if (dados) setPetsFavoritos(JSON.parse(dados));
        } catch (e) {
          console.error("Erro ao ler favoritos", e);
        }
      };
      carregarFavoritos();
    }, [])
  );

  const [editando, setEditando] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState(''); 
  const [localizacaoTexto, setLocalizacaoTexto] = useState(''); 
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState('');
  const [tipoLugar, setTipoLugar] = useState('Casa'); 
  const [petsAdotadosReais, setPetsAdotadosReais] = useState([]);
  const [petsDoadosReais, setPetsDoadosReais] = useState([]);

  useEffect(() => {
    const buscarDadosUsuario = async () => {
      const user = auth.currentUser;
      if (user && user.email) {
        setCarregando(true);
        try {
          const docRef = doc(db, "users", user.email.toLowerCase());
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setNomeCompleto(data.nome || '');
            setUsername(data.username || '');
            setEmail(data.email || '');
            setTelefone(data.telefone || '');
            setCep(data.cep || '');
            setLocalizacaoTexto(data.localizacao || '');
            setFotoPerfilUrl(data.foto_url || '');
          }
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        } finally {
          setCarregando(false);
        }
      }
    };
    buscarDadosUsuario();
  }, []);

  const [destinoFoto, setDestinoFoto] = useState<'perfil' | 'pet' | 'chat'>('perfil');
  const [modalRelatoSucessoVisivel, setModalRelatoSucessoVisivel] = useState(false);
  const [petDoRelato, setPetDoRelato] = useState('');
  const [textoRelatoSucesso, setTextoRelatoSucesso] = useState('');
  const [fotoPetRelato, setFotoPetRelato] = useState('');
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<any | null>(null);
  const [modalRelatorioVisivel, setModalRelatorioVisivel] = useState(false);
  const [chatSelecionado, setChatSelecionado] = useState<any | null>(null);
  const [mensagensDoChat, setMensagensDoChat] = useState<any[]>([]);
  const [modalChatVisivel, setModalChatVisivel] = useState(false);
  const [novaMensagemInterna, setNovaMensagemInterna] = useState('');

  const executarSairDoSistema = () => {
    setNomeCompleto('');
    setUsername('');
    setEmail('');
    setTelefone('');
    setCep('');
    setLocalizacaoTexto('');
    setFotoPerfilUrl('');
    setPetsAdotadosReais([]);
    setPetsDoadosReais([]);
    router.replace('/login');
  };

  const abrirMenuFoto = (destino: 'perfil' | 'pet' | 'chat') => {
    setDestinoFoto(destino);

    if (destino === 'pet') {
      setModalRelatoSucessoVisivel(false);
    }

    setTimeout(() => {
      Alert.alert(
        'Selecione uma opção',
        'De onde você quer escolher a foto?',
        [
          {
            text: 'Tirar Foto (Câmera)',
            onPress: () => gerenciarEscolhaMidia('camera', destino),
          },
          {
            text: 'Escolher da Galeria',
            onPress: () => gerenciarEscolhaMidia('galeria', destino),
          },
          {
            text: 'Excluir Foto Atual',
            style: 'destructive',
            onPress: () => {
              if (destino === 'perfil') setFotoPerfilUrl('');
              else if (destino === 'pet') {
                setFotoPetRelato('');
                setTimeout(() => setModalRelatoSucessoVisivel(true), 300);
              }
            },
          },
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => {
              if (destino === 'pet') setTimeout(() => setModalRelatoSucessoVisivel(true), 300);
            },
          },
        ]
      );
    }, destino === 'pet' ? 400 : 0);
  };

  const gerenciarEscolhaMidia = async (origem: 'camera' | 'galeria', destino: 'perfil' | 'pet' | 'chat') => {
    await new Promise(resolve => setTimeout(resolve, 300));

    let resultado;

    try {
      if (origem === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permissão necessária',
            'Vá em Configurações > Privacidade > Câmera e permita o acesso para este app.'
          );
          if (destino === 'pet') setTimeout(() => setModalRelatoSucessoVisivel(true), 300);
          return;
        }
        resultado = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permissão necessária',
            'Vá em Configurações > Privacidade > Fotos e permita o acesso para este app.'
          );
          if (destino === 'pet') setTimeout(() => setModalRelatoSucessoVisivel(true), 300);
          return;
        }
        resultado = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
      }

      if (!resultado || resultado.canceled) {
        if (destino === 'pet') setTimeout(() => setModalRelatoSucessoVisivel(true), 300);
        return;
      }

      const uriSelecionada = resultado.assets[0].uri;

      if (destino === 'perfil') {
        setFotoPerfilUrl(uriSelecionada);
      } else if (destino === 'pet') {
        setFotoPetRelato(uriSelecionada);
        setTimeout(() => setModalRelatoSucessoVisivel(true), 300);
      } else if (destino === 'chat') {
        const novaMsgFoto = {
          id: String(Date.now()),
          texto: uriSelecionada,
          enviadoPorMim: true,
          tipo: 'foto',
        };
        setMensagensDoChat(prev => [...prev, novaMsgFoto]);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível acessar a câmera ou galeria.');
      if (destino === 'pet') setTimeout(() => setModalRelatoSucessoVisivel(true), 300);
    }
  };

  const buscarCepNoFormulario = async (valorCep: string) => {
    setCep(valorCep);
    if (valorCep.length === 8) {
      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${valorCep}/json/`);
        const dados = await resposta.json();
        if (!dados.erro) {
          setLocalizacaoTexto(`${dados.bairro}, ${dados.localidade} - ${dados.uf}`);
        } else {
          Alert.alert("Aviso", "CEP não encontrado.");
        }
      } catch (error) {}
    }
  };

  const salvarPerfilTutor = async () => {
    if (!nomeCompleto || !email) {
      Alert.alert("Atenção", "Nome e E-mail são obrigatórios!");
      return;
    }
    setCarregando(true);
    try {
      await setDoc(doc(db, "users", email.toLowerCase()), {
        nome: nomeCompleto,
        username: username,
        email: email.toLowerCase(),
        telefone: telefone,
        cep: cep,
        localizacao: localizacaoTexto,
        tipo_espaco: tipoLugar,
        tipo_conta: 'tutor',
        foto_url: fotoPerfilUrl,
        atualizado_em: new Date().toISOString()
      }, { merge: true });
      Alert.alert("Sucesso 🎉", "Perfil atualizado com sucesso!");
      setEditando(false);
    } catch (error: any) {
      Alert.alert("Erro Firebase", error.message);
    } finally {
      setCarregando(false);
    }
  };

  const enviarRelatoSucessoAoFirebase = async () => {
    if (!textoRelatoSucesso.trim() || !petDoRelato.trim()) {
      Alert.alert("Atenção", "Preencha o nome do pet e o depoimento antes de enviar.");
      return;
    }
    setCarregando(true);
    try {
      await addDoc(collection(db, "historias_sucesso"), {
        autor: nomeCompleto,
        email_autor: email.toLowerCase(),
        pet_nome: petDoRelato,
        depoimento: textoRelatoSucesso,
        pet_foto_url: fotoPetRelato || "https://via.placeholder.com/150",
        criado_em: new Date().toISOString()
      });
      Alert.alert("Sucesso! 🐾", "História enviada com sucesso!");
      setTextoRelatoSucesso('');
      setPetDoRelato('');
      setFotoPetRelato('');
      setModalRelatoSucessoVisivel(false);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setCarregando(false);
    }
  };

  const abrirConversaInterna = (chat: any) => {
    setChatSelecionado(chat);
    setMensagensDoChat([...chat.mensagens]);
    setModalChatVisivel(true);
  };

  const enviarMensagemSimulada = () => {
    if (!novaMensagemInterna.trim()) return;
    const novaMsg = {
      id: String(Date.now()),
      texto: novaMensagemInterna,
      enviadoPorMim: true,
      tipo: 'texto',
    };
    setMensagensDoChat(prev => [...prev, novaMsg]);
    setNovaMensagemInterna('');
  };

  const tratarCliqueNoRelatorio = (item: any) => {
    setRelatorioSelecionado(item);
    setModalRelatorioVisivel(true);
  };

  return (
    <View style={styles.container}>
      
      {/* SIDEBAR */}
      <View style={styles.sidebar}>
        <TouchableOpacity style={[styles.sidebarBtn, abaAtiva === 'perfil' && styles.sidebarBtnActive]} onPress={() => { setAbaAtiva('perfil'); setEditando(false); }}>
          <Ionicons name="person-outline" size={20} color={abaAtiva === 'perfil' ? '#8DC4A6' : '#4A5568'} />
          <Text style={[styles.sidebarBtnText, abaAtiva === 'perfil' && styles.sidebarBtnTextActive]}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sidebarBtn, abaAtiva === 'chat' && styles.sidebarBtnActive]} onPress={() => setAbaAtiva('chat')}>
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

        <TouchableOpacity 
          style={[styles.sidebarBtn, { marginTop: 'auto', marginBottom: 15 }]} 
          onPress={() => {
            Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Sair", style: "destructive", onPress: executarSairDoSistema }
            ]);
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#E53E3E" />
          <Text style={[styles.sidebarBtnText, { color: '#E53E3E' }]}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* CONTEÚDO */}
      <View style={styles.contentArea}>
        {carregando && <ActivityIndicator size="large" color="#8DC4A6" style={{ marginBottom: 10 }} />}
        
        {/* ABA PERFIL */}
        {abaAtiva === 'perfil' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={() => abrirMenuFoto('perfil')} style={styles.avatarWrapper}>
                <Image source={{ uri: fotoPerfilUrl || 'https://via.placeholder.com/150' }} style={styles.avatarImage} />
                <View style={styles.cameraBadge}><Ionicons name="camera" size={12} color="#FFF" /></View>
              </TouchableOpacity>
              <Text style={styles.profileNameText}>{nomeCompleto}</Text>
              <Text style={styles.profileUsernameText}>@{username}</Text>
            </View>

            {!editando ? (
              <View>
                <View style={styles.infoCardCard}>
                  <Text style={styles.infoTitle}>Dados Pessoais</Text>
                  <Text style={styles.infoMetaLabel}>Nome Completo:</Text>
                  <Text style={styles.infoMetaValue}>{nomeCompleto}</Text>
                  <Text style={styles.infoMetaLabel}>E-mail de Cadastro:</Text>
                  <Text style={styles.infoMetaValue}>{email}</Text>
                  <Text style={styles.infoMetaLabel}>Endereço Completo:</Text>
                  <Text style={styles.infoMetaValue}>{localizacaoTexto} (CEP: {cep})</Text>
                  <TouchableOpacity style={styles.btnMapaUtilitario} onPress={() => abrirNoMapa(localizacaoTexto || cep)}>
                    <Ionicons name="map-outline" size={14} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.btnMapaUtilitarioText}>Ver no Google Maps</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnEditarPerfil} onPress={() => setEditando(true)}>
                    <Text style={styles.btnEditarPerfilText}>Editar Informações</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.btnEscreverRelatoHome} onPress={() => setModalRelatoSucessoVisivel(true)}>
                  <Ionicons name="star" size={14} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.btnEscreverRelatoHomeText}>Contar História de Sucesso</Text>
                </TouchableOpacity>

                {/* HISTÓRICO DE PETS */}
                <Text style={[styles.infoTitle, { marginTop: 18, marginBottom: 8, paddingLeft: 2 }]}>Histórico de Pets</Text>
                <View style={styles.tccGridColumns}>
                  <View style={styles.tccColumnBox}>
                    <View style={styles.columnHeaderAdotados}><Text style={styles.columnHeaderTitle}>Adotados</Text></View>
                    {[{ id: 'AD-2026-01', nome: 'Bidu', especie: 'Cachorro' }].map((p) => (
                      <View key={p.id} style={styles.miniRowDesign}>
                        <Ionicons name="paw" size={14} color="#3182CE" style={{ marginRight: 8 }} />
                        <View>
                          <Text style={styles.miniRowText}>{p.nome}</Text>
                          <Text style={{ fontSize: 10, color: '#A0AEC0' }}>{p.especie}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  <View style={styles.tccColumnBox}>
                    <View style={styles.columnHeaderDoados}><Text style={styles.columnHeaderTitle}>Doados</Text></View>
                    {[{ id: 'DO-2026-04', nome: 'Mel', especie: 'Gato' }].map((p) => (
                      <View key={p.id} style={styles.miniRowDesign}>
                        <Ionicons name="paw" size={14} color="#ED8936" style={{ marginRight: 8 }} />
                        <View>
                          <Text style={styles.miniRowText}>{p.nome}</Text>
                          <Text style={{ fontSize: 10, color: '#A0AEC0' }}>{p.especie}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.formCard}>
                <Text style={styles.infoTitle}>Modificar Meus Dados</Text>
                <Text style={styles.inputLabel}>Nome Completo</Text>
                <TextInput style={styles.input} value={nomeCompleto} onChangeText={setNomeCompleto} />
                <Text style={styles.inputLabel}>Nome de Usuário (@)</Text>
                <TextInput style={styles.input} value={username} onChangeText={setUsername} />
                <Text style={styles.inputLabel}>Número de Telefone</Text>
                <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
                <Text style={styles.inputLabel}>CEP (Busca Automática)</Text>
                <TextInput style={styles.input} value={cep} onChangeText={buscarCepNoFormulario} keyboardType="numeric" maxLength={8} />
                <Text style={styles.inputLabel}>Endereço Confirmado</Text>
                <TextInput style={[styles.input, { backgroundColor: '#F7FAFC', color: '#718096' }]} value={localizacaoTexto} editable={false} />
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
                  <TouchableOpacity style={styles.btnCancelarForm} onPress={() => setEditando(false)}><Text>Voltar</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.btnSalvarForm} onPress={salvarPerfilTutor}>
                    <Text style={styles.btnSalvarFormText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* ABA CHAT */}
        {abaAtiva === 'chat' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {conversasSimuladas.map((item) => (
              <TouchableOpacity key={item.id} style={styles.chatCard} onPress={() => abrirConversaInterna(item)}>
                <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.chatName}>{item.nome}</Text>
                  <Text style={styles.chatMsg} numberOfLines={1}>{item.ultimaMsg}</Text>
                </View>
                <Text style={styles.chatTime}>{item.hora}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.btnWhatsSuporteGeral} onPress={() => enviarMensagemWhats('(13) 99999-9999', 'Olá! Preciso de ajuda com o aplicativo Adotei.')}>
              <Ionicons name="logo-whatsapp" size={16} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.btnWhatsSuporteGeralText}>Acionar Suporte Geral</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ABA FAVORITOS */}
        {abaAtiva === 'favoritos' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.subPageTitle}>Meus Favoritos</Text>
            {petsFavoritos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="heart-outline" size={40} color="#CBD5E0" />
                <Text style={styles.emptyText}>Nenhum pet favoritado ainda.</Text>
              </View>
            ) : (
              petsFavoritos.map((pet: any) => (
                <View key={pet.id} style={styles.chatCard}>
                  <Image source={{ uri: pet.fotos ? pet.fotos[0] : pet.foto }} style={styles.chatAvatar} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.chatName}>{pet.nome}</Text>
                    <Text style={styles.chatMsg}>{pet.especie} • {pet.idade}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* ABA RELATÓRIOS */}
        {abaAtiva === 'relatorios' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.subPageTitle}>Meus Relatórios</Text>
            <View style={styles.tccGridColumns}>
              <View style={styles.tccColumnBox}>
                <View style={styles.columnHeaderAdotados}><Text style={styles.columnHeaderTitle}>Pets Adotados</Text></View>
                {relatoriosSimulados.filter(r => r.tipo === 'Adotado').map(r => (
                  <TouchableOpacity key={r.id} style={styles.reportRowClickable} onPress={() => tratarCliqueNoRelatorio(r)}>
                    <Ionicons name="document-text-outline" size={14} color="#4A5568" style={{ marginRight: 6 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reportTextTitle}>{r.pet.nome}</Text>
                      <Text style={styles.reportTextSub}>{r.data}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.tccColumnBox}>
                <View style={styles.columnHeaderDoados}><Text style={styles.columnHeaderTitle}>Pets Doados</Text></View>
                {relatoriosSimulados.filter(r => r.tipo === 'Doado').map(r => (
                  <TouchableOpacity key={r.id} style={styles.reportRowClickable} onPress={() => tratarCliqueNoRelatorio(r)}>
                    <Ionicons name="document-text-outline" size={14} color="#4A5568" style={{ marginRight: 6 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reportTextTitle}>{r.pet.nome}</Text>
                      <Text style={styles.reportTextSub}>{r.data}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* MODAL CHAT INTERNO */}
      <Modal animationType="slide" transparent={false} visible={modalChatVisivel} onRequestClose={() => setModalChatVisivel(false)}>
        <View style={styles.chatInternalContainer}>
          <View style={styles.chatInternalHeader}>
            <TouchableOpacity onPress={() => setModalChatVisivel(false)}>
              <Ionicons name="arrow-back" size={24} color="#4A5568" />
            </TouchableOpacity>
            <Image source={{ uri: chatSelecionado?.avatar }} style={styles.chatInternalAvatar} />
            <Text style={styles.chatInternalHeaderTitle}>{chatSelecionado?.nome}</Text>
            <TouchableOpacity onPress={() => enviarMensagemWhats(chatSelecionado?.telefone, `Olá! Estou respondendo sua mensagem do app Adotei.`)}>
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatInternalMessagesBox} contentContainerStyle={{ padding: 15 }}>
            {mensagensDoChat.map((msg: any) => (
              <View key={msg.id} style={[styles.msgBubble, msg.enviadoPorMim ? styles.msgBubbleMe : styles.msgBubbleThem]}>
                {msg.tipo === 'texto' ? (
                  <Text style={[styles.msgBubbleText, msg.enviadoPorMim ? styles.msgBubbleTextMe : styles.msgBubbleTextThem]}>
                    {msg.texto}
                  </Text>
                ) : (
                  <Image source={{ uri: msg.texto }} style={styles.msgBubbleImageAttachment} />
                )}
              </View>
            ))}
          </ScrollView>

          <View style={styles.chatInternalInputBar}>
            <TouchableOpacity style={styles.chatAttachBtn} onPress={() => abrirMenuFoto('chat')}>
              <Ionicons name="add" size={24} color="#8DC4A6" />
            </TouchableOpacity>
            <TextInput style={styles.chatInternalInput} value={novaMensagemInterna} onChangeText={setNovaMensagemInterna} placeholder="Digite sua mensagem..." />
            <TouchableOpacity style={styles.chatInternalSendBtn} onPress={enviarMensagemSimulada}>
              <Ionicons name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL RELATO DE SUCESSO */}
      <Modal animationType="slide" transparent={true} visible={modalRelatoSucessoVisivel} onRequestClose={() => setModalRelatoSucessoVisivel(false)}>
        <View style={styles.modalOverlayContainer}>
          <View style={styles.modalScrollBox}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <Text style={styles.infoTitle}>Escreva sua História de Sucesso! 🌟</Text>
              <Text style={styles.inputLabel}>Qual pet você adotou?</Text>
              <TextInput style={styles.input} value={petDoRelato} onChangeText={setPetDoRelato} placeholder="Ex: Bidu, Mel..." />
              <Text style={[styles.inputLabel, { marginTop: 10 }]}>Foto do Pet para o Carrossel</Text>
              <View style={styles.uploadPetContainer}>
                {fotoPetRelato ? (
                  <Image source={{ uri: fotoPetRelato }} style={styles.uploadedPetImage} />
                ) : (
                  <View style={styles.emptyPetImage}><Ionicons name="images-outline" size={24} color="#A0AEC0" /></View>
                )}
                <TouchableOpacity style={styles.btnUploadPet} onPress={() => abrirMenuFoto('pet')}>
                  <Text style={styles.btnUploadPetText}>{fotoPetRelato ? "Alterar Foto" : "Adicionar Foto"}</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Deixe seu depoimento completo:</Text>
              <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 8 }]} value={textoRelatoSucesso} onChangeText={setTextoRelatoSucesso} placeholder="Conte para nós como o pet se adaptou ao novo lar..." multiline={true} />
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                <TouchableOpacity style={styles.btnCancelarForm} onPress={() => setModalRelatoSucessoVisivel(false)}><Text>Cancelar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btnSalvarForm} onPress={enviarRelatoSucessoAoFirebase}>
                  <Text style={styles.btnSalvarFormText}>Enviar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL RELATÓRIO */}
      <Modal animationType="slide" transparent={true} visible={modalRelatorioVisivel} onRequestClose={() => setModalRelatorioVisivel(false)}>
        <View style={styles.modalOverlayContainerRelatorio}>
          <View style={styles.modalScrollBoxRelatorio}>
            <ScrollView contentContainerStyle={{ padding: 22 }}>
              <View style={styles.docHeader}>
                <View style={styles.sealBadge}>
                  <Ionicons name="ribbon" size={14} color="#FFF" />
                  <Text style={styles.docSealText}>SELO ADOTEI</Text>
                </View>
                <Text style={styles.docTitle}>RELATÓRIO OFICIAL DE ADOÇÃO RESPONSÁVEL</Text>
              </View>
              <Text style={styles.docSectionTitle}>1. ESPECIFICAÇÕES DO ANIMAL</Text>
              <Text style={styles.docValue}>Nome do Pet: <Text style={{fontWeight: 'bold'}}>{relatorioSelecionado?.pet.nome}</Text></Text>
              <Text style={styles.docValue}>Espécie / Categoria: {relatorioSelecionado?.pet.especie}</Text>
              <Text style={styles.docSectionTitle}>2. PROCEDÊNCIA E DOADOR</Text>
              <Text style={styles.docValue}>Instituição/Protetor: {relatorioSelecionado?.entidade}</Text>
              <Text style={styles.docValue}>Responsável Técnico: {relatorioSelecionado?.responsavel}</Text>
              <Text style={styles.docSectionTitle}>3. REGISTRO DO TUTOR ADOTANTE</Text>
              <Text style={styles.docValue}>Nome Completo: {nomeCompleto}</Text>
              <Text style={styles.docValue}>E-mail: {email}</Text>
              <Text style={styles.docValue}>Localidade: {localizacaoTexto}</Text>
              <Text style={styles.docSectionTitle}>4. DATA DE CERTIFICAÇÃO</Text>
              <Text style={styles.docValue}>Finalizado em: {relatorioSelecionado?.data}</Text>
              <TouchableOpacity style={styles.btnCloseDocBtn} onPress={() => setModalRelatorioVisivel(false)}>
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 13 }}>Fechar Documento</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#FEFDF9' },
  sidebar: { width: 100, backgroundColor: '#FFF', borderRightWidth: 1, borderRightColor: '#E2E8F0', paddingTop: 40, alignItems: 'center', gap: 10 },
  sidebarBtn: { width: '90%', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  sidebarBtnActive: { backgroundColor: '#EBF7F0' },
  sidebarBtnText: { fontSize: 11, color: '#4A5568', marginTop: 4 },
  sidebarBtnTextActive: { color: '#8DC4A6', fontWeight: 'bold' },
  contentArea: { flex: 1, padding: 15 },
  subPageTitle: { fontSize: 15, fontWeight: 'bold', color: '#2D3748', marginBottom: 12 },
  avatarSection: { alignItems: 'center', marginBottom: 15 },
  avatarWrapper: { position: 'relative' },
  avatarImage: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#EDF2F7' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#8DC4A6', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FEFDF9' },
  profileNameText: { fontSize: 15, fontWeight: 'bold', color: '#2D3748', marginTop: 6 },
  profileUsernameText: { fontSize: 12, color: '#718096' },
  infoCardCard: { backgroundColor: '#FFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  infoTitle: { fontSize: 13, fontWeight: 'bold', color: '#2D3748' },
  infoMetaLabel: { fontSize: 11, color: '#718096', fontWeight: 'bold', marginTop: 6 },
  infoMetaValue: { fontSize: 13, color: '#2D3748' },
  btnEditarPerfil: { backgroundColor: '#8DC4A6', height: 35, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  btnEditarPerfilText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  btnMapaUtilitario: { backgroundColor: '#4A5568', height: 32, borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnMapaUtilitarioText: { color: '#FFF', fontSize: 11, fontWeight: '500' },
  btnEscreverRelatoHome: { backgroundColor: '#EDC29A', height: 35, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  btnEscreverRelatoHomeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  uploadPetContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6, backgroundColor: '#F7FAFC', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  uploadedPetImage: { width: 50, height: 50, borderRadius: 6 },
  emptyPetImage: { width: 50, height: 50, borderRadius: 6, backgroundColor: '#EDF2F7', alignItems: 'center', justifyContent: 'center' },
  btnUploadPet: { backgroundColor: '#718096', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  btnUploadPetText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  formCard: { backgroundColor: '#FFF', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  inputLabel: { fontSize: 11, fontWeight: 'bold', color: '#718096', marginTop: 6 },
  input: { borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 6, height: 36, paddingHorizontal: 8, fontSize: 13, marginTop: 2, width: '100%' },
  btnCancelarForm: { flex: 1, height: 36, borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  btnSalvarForm: { flex: 2, height: 36, backgroundColor: '#8DC4A6', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  btnSalvarFormText: { color: '#FFF', fontWeight: 'bold' },
  chatCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 10, borderRadius: 10, marginBottom: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  chatAvatar: { width: 40, height: 40, borderRadius: 20 },
  chatName: { fontSize: 13, fontWeight: 'bold', color: '#2D3748' },
  chatMsg: { fontSize: 12, color: '#718096', marginTop: 2 },
  chatTime: { fontSize: 11, color: '#A0AEC0' },
  btnWhatsSuporteGeral: { backgroundColor: '#25D366', height: 36, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  btnWhatsSuporteGeralText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  emptyText: { fontSize: 13, color: '#718096', textAlign: 'center' },
  miniEmptyText: { fontSize: 11, color: '#A0AEC0', textAlign: 'center', marginVertical: 15 },
  tccGridColumns: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  tccColumnBox: { flex: 1, backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', minHeight: 100 },
  columnHeaderAdotados: { backgroundColor: '#8DC4A6', padding: 6, alignItems: 'center' },
  columnHeaderDoados: { backgroundColor: '#FFD3B6', padding: 6, alignItems: 'center' },
  columnHeaderTitle: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  miniRowDesign: { flexDirection: 'row', padding: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F7FAFC' },
  miniRowText: { fontSize: 13, color: '#2D3748', fontWeight: '500' },
  reportRowClickable: { flexDirection: 'row', padding: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F7FAFC' },
  reportTextTitle: { fontSize: 13, fontWeight: 'bold', color: '#2D3748' },
  reportTextSub: { fontSize: 11, color: '#A0AEC0', marginTop: 1 },
  modalOverlayContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalScrollBox: { width: '90%', backgroundColor: '#FFF', borderRadius: 15, padding: 10 },
  modalOverlayContainerRelatorio: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 15 },
  modalScrollBoxRelatorio: { width: '95%', maxHeight: '85%', backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#CBD5E0' },
  docHeader: { alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#8DC4A6', paddingBottom: 12, marginBottom: 5 },
  sealBadge: { flexDirection: 'row', backgroundColor: '#8DC4A6', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center', marginBottom: 6 },
  docSealText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  docTitle: { fontSize: 13, fontWeight: 'bold', color: '#1A202C', textAlign: 'center' },
  docSectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#4A5568', backgroundColor: '#F7FAFC', padding: 5, marginTop: 14, borderRadius: 4 },
  docValue: { fontSize: 13, color: '#2D3748', marginTop: 6, paddingLeft: 4 },
  btnCloseDocBtn: { backgroundColor: '#4A5568', height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  chatInternalContainer: { flex: 1, backgroundColor: '#F7FAFC' },
  chatInternalHeader: { flexDirection: 'row', height: 75, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingTop: 25, alignItems: 'center', paddingHorizontal: 15, gap: 10 },
  chatInternalAvatar: { width: 36, height: 36, borderRadius: 18 },
  chatInternalHeaderTitle: { flex: 1, fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
  chatInternalMessagesBox: { flex: 1 },
  msgBubble: { maxWidth: '75%', padding: 12, borderRadius: 12, marginBottom: 10 },
  msgBubbleMe: { backgroundColor: '#8DC4A6', alignSelf: 'flex-end', borderBottomRightRadius: 0 },
  msgBubbleThem: { backgroundColor: '#FFF', alignSelf: 'flex-start', borderBottomLeftRadius: 0, borderWidth: 1, borderColor: '#E2E8F0' },
  msgBubbleText: { fontSize: 13 },
  msgBubbleTextMe: { color: '#FFF' },
  msgBubbleTextThem: { color: '#2D3748' },
  msgBubbleImageAttachment: { width: 180, height: 180, borderRadius: 10 },
  chatInternalInputBar: { flexDirection: 'row', padding: 10, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', alignItems: 'center', gap: 10 },
  chatAttachBtn: { paddingHorizontal: 5 },
  chatInternalInput: { flex: 1, backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 20, height: 40, paddingHorizontal: 15, fontSize: 13 },
  chatInternalSendBtn: { backgroundColor: '#8DC4A6', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }
});