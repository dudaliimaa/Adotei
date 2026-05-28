import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Share,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { db } from '../../src/config/firebase';
import { collection, getDocs } from 'firebase/firestore';

// ============ DADOS SIMULADOS ============
const solicitacoesEnviadasSimuladas = [
  {
    id: 'env_1',
    petNome: 'Thor',
    petFoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=150',
    doadorNome: 'Carlos Eduardo',
    status: 'Pendente',
  },
  {
    id: 'env_2',
    petNome: 'Luna',
    petFoto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=150',
    doadorNome: 'Mariana Silva',
    status: 'Adotado',
  },
];

const solicitacoesRecebidasSimuladas = [
  {
    id: 'rec_1',
    petNome: 'Bidu',
    petFoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=150',
    adotanteNome: 'Eduarda de Lima Sales',
    adotanteAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150',
    status: 'Pendente',
    telefone: '(13) 98888-8888',
  },
  {
    id: 'rec_2',
    petNome: 'Mel',
    petFoto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=150',
    adotanteNome: 'João Pedro',
    adotanteAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
    status: 'Pendente',
    telefone: '(13) 97777-7777',
  },
];

export default function AdotarScreen() {
  const router = useRouter();
  const [usuarioLogado] = useState(true);
  const [pets, setPets] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);

  const buscarPets = async () => {
    setCarregando(true);
    try {
      const querySnapshot = await getDocs(collection(db, "pets"));
      const listaPets: any[] = [];
      querySnapshot.forEach((doc) => {
        const dados = doc.data();
        if (dados && dados.nome) {
          listaPets.push({ id: doc.id, ...dados });
        }
      });
      setPets(listaPets);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarPets();
    }, [])
  );

  // ---- modais e estados ----
  const [modalFiltrosVisivel, setModalFiltrosVisivel] = useState(false);
  const [petSelecionado, setPetSelecionado] = useState<any>(null);
  const [favoritos, setFavoritos] = useState<any[]>([]);

  // ---- abas de solicitações ----
  const [modalSolicitacoesVisivel, setModalSolicitacoesVisivel] = useState(false);
  const [abaSolicitacao, setAbaSolicitacao] = useState<'enviadas' | 'recebidas'>('enviadas');
  const [solicitacoesRecebidas, setSolicitacoesRecebidas] = useState(solicitacoesRecebidasSimuladas);

  // ---- filtros ----
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroCachorro, setFiltroCachorro] = useState(true);
  const [filtroGato, setFiltroGato] = useState(true);
  const [filtroPassaro, setFiltroPassaro] = useState(true);
  const [filtroFemea, setFiltroFemea] = useState(true);
  const [filtroMacho, setFiltroMacho] = useState(true);
  const [porteFiltro, setPorteFiltro] = useState('');
  const [corFiltro, setCorFiltro] = useState('');
  const [racaFiltro, setRacaFiltro] = useState('');
  const [idadeFiltro, setIdadeFiltro] = useState('');
  const [temperamentoFiltro, setTemperamentoFiltro] = useState('');
  const [distancia, setDistancia] = useState(10);
  const [castradoOpcao, setCastradoOpcao] = useState('tanto_faz');
  const [indexDestaque, setIndexDestaque] = useState(0);

  const alternarFavorito = (pet: any) => {
    const jaFavoritado = favoritos.find((f: any) => f.id === pet.id);
    if (jaFavoritado) {
      setFavoritos(favoritos.filter((f: any) => f.id !== pet.id));
    } else {
      setFavoritos([...favoritos, pet]);
    }
  };

  const verificarAcao = (callback: () => void) => {
    if (!usuarioLogado) {
      Alert.alert(
        "Acesso Restrito",
        "Você precisa estar logado para realizar uma adoção.",
        [
          { text: "Fazer Login", onPress: () => router.push('/login') },
          { text: "Cancelar", style: "cancel" }
        ]
      );
    } else {
      callback();
    }
  };

  const confirmarAdocao = (solicitacaoId: string) => {
    setSolicitacoesRecebidas(prev =>
      prev.map(s => s.id === solicitacaoId ? { ...s, status: 'Adotado' } : s)
    );
    setModalSolicitacoesVisivel(false);
    // Direciona pro perfil aba chat
    router.push('/perfil');
    Alert.alert("Adoção confirmada! 🎉", "Você foi redirecionado para o chat com o adotante.");
  };

  const petsFiltrados = pets.filter(pet => {
    const nome = (pet.nome || '').toLowerCase();
    const especie = (pet.especie || '').toLowerCase();
    const genero = (pet.genero || '').toLowerCase();
    const porte = (pet.porte || '').toLowerCase();
    const raca = (pet.raca || '').toLowerCase();
    const cor = (pet.cor || '').toLowerCase();
    const idade = (pet.idade || '').toString();
    const temp = (pet.descricao || '').toLowerCase();
    const castrado = (pet.castrado || '').toLowerCase();
    const busca = buscaTexto.toLowerCase();

    const bateTexto = nome.includes(busca) || pet.id === buscaTexto;
    const bateEspecie =
      (especie.includes('cachorro') && filtroCachorro) ||
      (especie.includes('gato') && filtroGato) ||
      (especie.includes('pássaro') && filtroPassaro);
    const bateGenero =
      (genero.includes('fêmea') && filtroFemea) ||
      (genero.includes('macho') && filtroMacho);
    const batePorte = porteFiltro ? porte.includes(porteFiltro.toLowerCase()) : true;
    const bateRaca = racaFiltro ? raca.includes(racaFiltro.toLowerCase()) : true;
    const bateCor = corFiltro ? cor.includes(corFiltro.toLowerCase()) : true;
    const bateIdade = idadeFiltro ? idade.includes(idadeFiltro) : true;
    const bateTemp = temperamentoFiltro ? temp.includes(temperamentoFiltro.toLowerCase()) : true;
    let bateCastrado = true;
    if (castradoOpcao === 'sim') bateCastrado = castrado === 'sim';
    if (castradoOpcao === 'nao') bateCastrado = castrado === 'não';

    return bateTexto && bateEspecie && bateGenero && batePorte && bateRaca && bateCor && bateIdade && bateTemp && bateCastrado;
  });

  const totalPendentes = solicitacoesRecebidas.filter(s => s.status === 'Pendente').length;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>

        {/* BOTÃO SOLICITAÇÕES */}
        <TouchableOpacity
          style={styles.btnSolicitacoes}
          onPress={() => setModalSolicitacoesVisivel(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="notifications-circle" size={24} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.btnSolicitacoesText}>Solicitações de Adoção</Text>
          </View>
          {totalPendentes > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalPendentes}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* CARROSSEL DESTAQUE */}
        {pets.length > 0 && (
          <View style={styles.boxDestaque}>
            <View style={styles.destaqueHeaderRow}>
              <View>
                <Text style={styles.destaqueTitle}>Adote amor: Seu novo amigo te espera! 🐾</Text>
                <Text style={styles.destaqueSubtitle}>Clique para saber mais:</Text>
              </View>
              <TouchableOpacity onPress={() => setPetSelecionado(pets[indexDestaque])}>
                <Text style={styles.verMaisLink}>Ver mais</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.destaqueImageWrapper}>
              <TouchableOpacity style={styles.arrowLeft} onPress={() => setIndexDestaque(prev => prev === 0 ? pets.length - 1 : prev - 1)}>
                <Ionicons name="chevron-back" size={24} color="#8DC4A6" />
              </TouchableOpacity>
              <Image source={{ uri: pets[indexDestaque].fotos ? pets[indexDestaque].fotos[0] : pets[indexDestaque].foto }} style={styles.destaqueImg} />
              <TouchableOpacity style={styles.arrowRight} onPress={() => setIndexDestaque(prev => prev === pets.length - 1 ? 0 : prev + 1)}>
                <Ionicons name="chevron-forward" size={24} color="#8DC4A6" />
              </TouchableOpacity>
            </View>

            <Text style={styles.destaquePetName}>{pets[indexDestaque].nome}</Text>
            <Text style={styles.destaquePetInfo}>{pets[indexDestaque].idade} • {pets[indexDestaque].porte}</Text>
          </View>
        )}

        {/* BOTÃO FILTROS */}
        <TouchableOpacity style={styles.btnFiltros} onPress={() => setModalFiltrosVisivel(true)}>
          <Ionicons name="funnel-outline" size={18} color="#8DC4A6" />
          <Text style={styles.btnFiltrosText}>Filtros</Text>
        </TouchableOpacity>

        {/* LISTAGEM DE PETS */}
        <View style={styles.boxListagem}>
          <Text style={styles.listagemTitle}>Encontre seu novo melhor amigo:</Text>
          <Text style={styles.listagemSubtitle}>Juntos, podemos transformar vidas — uma adoção de cada vez.</Text>

          {carregando ? (
            <ActivityIndicator size="large" color="#8DC4A6" style={{ marginTop: 20 }} />
          ) : petsFiltrados.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="paw-outline" size={40} color="#CBD5E0" />
              <Text style={styles.emptyText}>Nenhum animal encontrado.</Text>
            </View>
          ) : (
            petsFiltrados.map((pet) => (
              <View key={pet.id} style={styles.petCardRow}>
                <Image source={{ uri: pet.fotos ? pet.fotos[0] : pet.foto }} style={styles.petCardImg} />
                <View style={styles.petCardDetails}>
                  <View style={styles.infoGrid}>
                    <View style={styles.gridCol}>
                      <Text style={styles.gridLabel}>Nome</Text>
                      <Text style={styles.gridValue}>{pet.nome}</Text>
                    </View>
                    <View style={styles.gridCol}>
                      <Text style={styles.gridLabel}>Espécie</Text>
                      <Text style={styles.gridValue}>{pet.especie}</Text>
                    </View>
                  </View>
                  <View style={styles.infoGridMargin}>
                    <View style={styles.gridCol}>
                      <Text style={styles.gridLabel}>Gênero</Text>
                      <Text style={styles.gridValue}>{pet.genero}</Text>
                    </View>
                    <View style={styles.gridCol}>
                      <Text style={styles.gridLabel}>Idade</Text>
                      <Text style={styles.gridValue}>{pet.idade}</Text>
                    </View>
                  </View>
                  <Text style={styles.miniCardDesc} numberOfLines={2}>{pet.descricao || pet.desc}</Text>
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.btnCardAdotar}
                      onPress={() => verificarAcao(() => {
                        setPetSelecionado(pet);
                        // ao adotar vai pra aba enviadas
                        setAbaSolicitacao('enviadas');
                        setModalSolicitacoesVisivel(true);
                      })}
                    >
                      <Text style={styles.btnCardAdotarText}>Adotar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btnCardFav, favoritos.find((f: any) => f.id === pet.id) && styles.btnCardFavActive]}
                      onPress={() => alternarFavorito(pet)}
                    >
                      <Ionicons
                        name={favoritos.find((f: any) => f.id === pet.id) ? "heart" : "heart-outline"}
                        size={20}
                        color={favoritos.find((f: any) => f.id === pet.id) ? "#FFF" : "#718096"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* ======= MODAL SOLICITAÇÕES ======= */}
      <Modal animationType="slide" transparent={true} visible={modalSolicitacoesVisivel} onRequestClose={() => setModalSolicitacoesVisivel(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Solicitações</Text>
              <TouchableOpacity onPress={() => setModalSolicitacoesVisivel(false)}>
                <Ionicons name="close" size={24} color="#1A202C" />
              </TouchableOpacity>
            </View>

            {/* ABAS */}
            <View style={styles.abaRow}>
              <TouchableOpacity
                style={[styles.abaBtn, abaSolicitacao === 'enviadas' && styles.abaBtnActive]}
                onPress={() => setAbaSolicitacao('enviadas')}
              >
                <Text style={[styles.abaBtnText, abaSolicitacao === 'enviadas' && styles.abaBtnTextActive]}>Enviadas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.abaBtn, abaSolicitacao === 'recebidas' && styles.abaBtnActive]}
                onPress={() => setAbaSolicitacao('recebidas')}
              >
                <Text style={[styles.abaBtnText, abaSolicitacao === 'recebidas' && styles.abaBtnTextActive]}>Recebidas</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 15 }}>

              {/* ABA ENVIADAS */}
              {abaSolicitacao === 'enviadas' && (
                <>
                  {solicitacoesEnviadasSimuladas.map((sol) => (
                    <View key={sol.id} style={styles.solCard}>
                      <Image source={{ uri: sol.petFoto }} style={styles.solPetImg} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.solPetNome}>{sol.petNome}</Text>
                        <Text style={styles.solSub}>Doador: {sol.doadorNome}</Text>
                      </View>
                      <View style={[
                        styles.statusTag,
                        sol.status === 'Pendente' ? styles.tagPendente : styles.tagAdotado
                      ]}>
                        <Text style={styles.statusTagText}>{sol.status}</Text>
                      </View>
                    </View>
                  ))}
                </>
              )}

              {/* ABA RECEBIDAS */}
              {abaSolicitacao === 'recebidas' && (
                <>
                  {solicitacoesRecebidas.map((sol) => (
                    <View key={sol.id} style={styles.solCard}>
                      <Image source={{ uri: sol.adotanteAvatar }} style={styles.solPetImg} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.solPetNome}>{sol.adotanteNome}</Text>
                        <Text style={styles.solSub}>Quer adotar: <Text style={{ color: '#8DC4A6', fontWeight: 'bold' }}>{sol.petNome}</Text></Text>
                      </View>
                      <View style={[
                        styles.statusTag,
                        sol.status === 'Pendente' ? styles.tagPendente : styles.tagAdotado
                      ]}>
                        <Text style={styles.statusTagText}>{sol.status}</Text>
                      </View>

                      {sol.status === 'Pendente' && (
                        <TouchableOpacity
                          style={styles.btnConfirmar}
                          onPress={() => confirmarAdocao(sol.id)}
                        >
                          <Text style={styles.btnConfirmarText}>Confirmar</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.btnFecharModal} onPress={() => setModalSolicitacoesVisivel(false)}>
              <Text style={styles.btnFecharModalText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ======= MODAL FILTROS ======= */}
      <Modal visible={modalFiltrosVisivel} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContentFiltros}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <TouchableOpacity onPress={() => setModalFiltrosVisivel(false)}>
                <Ionicons name="close" size={24} color="#1A202C" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.filterLabel}>NOME OU ID</Text>
              <TextInput style={styles.filterInput} value={buscaTexto} onChangeText={setBuscaTexto} placeholder="Buscar..." />

              <Text style={styles.filterLabel}>ESPÉCIE</Text>
              <TouchableOpacity style={styles.checkRow} onPress={() => setFiltroCachorro(!filtroCachorro)}>
                <View style={[styles.checkbox, filtroCachorro && styles.checkboxActive]}>
                  {filtroCachorro && <Ionicons name="checkmark" size={12} color="#FFF" />}
                </View>
                <Text style={styles.checkText}>Cachorro</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkRow} onPress={() => setFiltroGato(!filtroGato)}>
                <View style={[styles.checkbox, filtroGato && styles.checkboxActive]}>
                  {filtroGato && <Ionicons name="checkmark" size={12} color="#FFF" />}
                </View>
                <Text style={styles.checkText}>Gato</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkRow} onPress={() => setFiltroPassaro(!filtroPassaro)}>
                <View style={[styles.checkbox, filtroPassaro && styles.checkboxActive]}>
                  {filtroPassaro && <Ionicons name="checkmark" size={12} color="#FFF" />}
                </View>
                <Text style={styles.checkText}>Pássaro</Text>
              </TouchableOpacity>

              <Text style={styles.filterLabel}>GÊNERO</Text>
              <TouchableOpacity style={styles.checkRow} onPress={() => setFiltroFemea(!filtroFemea)}>
                <View style={[styles.checkbox, filtroFemea && styles.checkboxActive]}>
                  {filtroFemea && <Ionicons name="checkmark" size={12} color="#FFF" />}
                </View>
                <Text style={styles.checkText}>Fêmea</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkRow} onPress={() => setFiltroMacho(!filtroMacho)}>
                <View style={[styles.checkbox, filtroMacho && styles.checkboxActive]}>
                  {filtroMacho && <Ionicons name="checkmark" size={12} color="#FFF" />}
                </View>
                <Text style={styles.checkText}>Macho</Text>
              </TouchableOpacity>

              <Text style={styles.filterLabel}>PORTE</Text>
              <TextInput style={styles.filterInput} value={porteFiltro} onChangeText={setPorteFiltro} placeholder="Qualquer" />

              <Text style={styles.filterLabel}>COR</Text>
              <TextInput style={styles.filterInput} value={corFiltro} onChangeText={setCorFiltro} placeholder="Qualquer" />

              <Text style={styles.filterLabel}>RAÇA</Text>
              <TextInput style={styles.filterInput} value={racaFiltro} onChangeText={setRacaFiltro} placeholder="Qualquer" />

              <Text style={styles.filterLabel}>IDADE</Text>
              <TextInput style={styles.filterInput} value={idadeFiltro} onChangeText={setIdadeFiltro} placeholder="Qualquer" />

              <Text style={styles.filterLabel}>TEMPERAMENTO</Text>
              <TextInput style={styles.filterInput} value={temperamentoFiltro} onChangeText={setTemperamentoFiltro} placeholder="Qualquer" />

              <Text style={styles.filterLabel}>DISTÂNCIA MÁXIMA: {distancia}km</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={100}
                step={1}
                value={distancia}
                onValueChange={setDistancia}
                minimumTrackTintColor="#8DC4A6"
                maximumTrackTintColor="#E2E8F0"
                thumbTintColor="#8DC4A6"
              />

              <Text style={styles.filterLabel}>CASTRADO</Text>
              <TouchableOpacity style={styles.radioRow} onPress={() => setCastradoOpcao('tanto_faz')}>
                <View style={[styles.radio, castradoOpcao === 'tanto_faz' && styles.radioActive]} />
                <Text style={styles.checkText}>Tanto faz</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioRow} onPress={() => setCastradoOpcao('sim')}>
                <View style={[styles.radio, castradoOpcao === 'sim' && styles.radioActive]} />
                <Text style={styles.checkText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioRow} onPress={() => setCastradoOpcao('nao')}>
                <View style={[styles.radio, castradoOpcao === 'nao' && styles.radioActive]} />
                <Text style={styles.checkText}>Não</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnAplicar} onPress={() => setModalFiltrosVisivel(false)}>
                <Text style={styles.btnAplicarText}>Aplicar Filtros</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL DETALHES PET */}
      <Modal visible={petSelecionado !== null} animationType="slide">
        {petSelecionado && (
          <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.detailsImgWrapper}>
              <Image source={{ uri: petSelecionado.fotos ? petSelecionado.fotos[0] : petSelecionado.foto }} style={styles.detailsImg} />
              <TouchableOpacity style={styles.btnCloseDetails} onPress={() => setPetSelecionado(null)}>
                <Ionicons name="close" size={24} color="#1A202C" />
              </TouchableOpacity>
            </View>
            <View style={styles.detailsContentBox}>
              <Text style={styles.detailsPetName}>{petSelecionado.nome}</Text>
              <Text style={styles.detailsDescText}>{petSelecionado.descricao || petSelecionado.desc}</Text>
            </View>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF9' },
  scrollPadding: { paddingBottom: 30 },

  btnSolicitacoes: { backgroundColor: '#8DC4A6', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 20 },
  btnSolicitacoesText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  badge: { backgroundColor: '#E53E3E', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },

  boxDestaque: { margin: 20, padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#8DC4A6', backgroundColor: '#FFF' },
  destaqueHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  destaqueTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', maxWidth: '80%', lineHeight: 22 },
  destaqueSubtitle: { fontSize: 12, color: '#718096', marginTop: 4 },
  verMaisLink: { fontSize: 13, color: '#8DC4A6', fontWeight: 'bold' },
  destaqueImageWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 },
  arrowLeft: { padding: 5 },
  arrowRight: { padding: 5 },
  destaqueImg: { width: '75%', height: 200, borderRadius: 16 },
  destaquePetName: { fontSize: 18, fontWeight: 'bold', color: '#1A202C', marginTop: 10, textAlign: 'center' },
  destaquePetInfo: { fontSize: 12, color: '#718096', textAlign: 'center', marginTop: 2 },

  btnFiltros: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 20, height: 42, borderRadius: 12, borderWidth: 1, borderColor: '#8DC4A6', backgroundColor: '#FFF' },
  btnFiltrosText: { fontSize: 14, color: '#8DC4A6', fontWeight: '500' },

  boxListagem: { marginHorizontal: 20, marginTop: 25 },
  listagemTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C' },
  listagemSubtitle: { fontSize: 12, color: '#718096', marginTop: 6, lineHeight: 18 },

  petCardRow: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', padding: 12, marginTop: 15, gap: 12 },
  petCardImg: { width: 100, height: 110, borderRadius: 16, backgroundColor: '#F7FAFC' },
  petCardDetails: { flex: 1 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  infoGridMargin: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  gridCol: { width: '48%' },
  gridLabel: { fontSize: 11, color: '#A0AEC0', textTransform: 'uppercase', fontWeight: '500' },
  gridValue: { fontSize: 13, color: '#2D3748', marginTop: 1 },
  miniCardDesc: { fontSize: 12, color: '#718096', marginTop: 8, lineHeight: 16 },
  cardActionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  btnCardAdotar: { backgroundColor: '#8DC4A6', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8 },
  btnCardAdotarText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  btnCardFav: { width: 34, height: 34, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  btnCardFavActive: { backgroundColor: '#8DC4A6', borderColor: '#8DC4A6' },

  emptyBox: { width: '100%', padding: 40, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginTop: 15, gap: 10 },
  emptyText: { fontSize: 13, color: '#A0AEC0', textAlign: 'center' },

  // Modal base
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { width: '100%', height: '80%', backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContentFiltros: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3748' },

  // Abas
  abaRow: { flexDirection: 'row', marginHorizontal: 20, marginTop: 15, borderRadius: 10, backgroundColor: '#F7FAFC', padding: 4 },
  abaBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  abaBtnActive: { backgroundColor: '#8DC4A6' },
  abaBtnText: { fontSize: 13, color: '#718096', fontWeight: '600' },
  abaBtnTextActive: { color: '#FFF' },

  // Cards solicitações
  solCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 12, marginBottom: 10, flexWrap: 'wrap', gap: 6 },
  solPetImg: { width: 48, height: 48, borderRadius: 10 },
  solPetNome: { fontSize: 13, fontWeight: 'bold', color: '#2D3748' },
  solSub: { fontSize: 12, color: '#718096', marginTop: 2 },
  statusTag: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  statusTagText: { fontSize: 11, fontWeight: 'bold' },
  tagPendente: { backgroundColor: '#FEFCBF' },
  tagAdotado: { backgroundColor: '#EBF7F0' },
  btnConfirmar: { width: '100%', marginTop: 8, backgroundColor: '#8DC4A6', height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnConfirmarText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  btnFecharModal: { backgroundColor: '#EDF2F7', marginHorizontal: 20, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnFecharModalText: { fontSize: 13, color: '#4A5568', fontWeight: 'bold' },

  // Filtros
  filterLabel: { fontSize: 12, fontWeight: 'bold', color: '#2D3748', marginTop: 16, marginBottom: 6 },
  filterInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, height: 42, paddingHorizontal: 12, fontSize: 14, color: '#2D3748' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#CBD5E0', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#8DC4A6', borderColor: '#8DC4A6' },
  checkText: { fontSize: 14, color: '#2D3748' },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#CBD5E0' },
  radioActive: { borderColor: '#8DC4A6', backgroundColor: '#8DC4A6' },
  btnAplicar: { backgroundColor: '#8DC4A6', height: 45, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 25, marginBottom: 10 },
  btnAplicarText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },

  // Detalhes pet
  detailsContainer: { flex: 1, backgroundColor: '#FEFDF9' },
  detailsImgWrapper: { width: '100%', height: 260, position: 'relative' },
  detailsImg: { width: '100%', height: '100%' },
  btnCloseDetails: { position: 'absolute', top: 40, right: 20, width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  detailsContentBox: { padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#FEFDF9', marginTop: -20 },
  detailsPetName: { fontSize: 24, fontWeight: 'bold', color: '#1A202C' },
  detailsDescText: { fontSize: 14, color: '#4A5568', lineHeight: 22, marginTop: 20 },
});