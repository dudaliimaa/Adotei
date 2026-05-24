import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Share
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Importação do componente real instalado
import Slider from '@react-native-community/slider';

export default function AdotarScreen() {
  const router = useRouter();

  // simulador de login (mude para false pra testar o bloqueio que joga pro login)
  const [usuarioLogado, setUsuarioLogado] = useState(true);

  // o banco de dados começa vazio esperando os cadastros reais do app
  const [pets, setPets] = useState<any[]>([]);

  // controles de modais e favoritos
  const [modalFiltrosVisivel, setModalFiltrosVisivel] = useState(false);
  const [petSelecionado, setPetSelecionado] = useState<any>(null);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // campos de estados do modal de filtros
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroCachorro, setFiltroCachorro] = useState(true);
  const [filtroGato, setFiltroGato] = useState(true);
  const [filtroPassaro, setFiltroPassaro] = useState(true);
  const [filtroFemea, setFiltroFemea] = useState(true);
  const [filtroMacho, setFiltroMacho] = useState(true);
  
  // controle da distancia maxima e do radio button de castrado
  const [distancia, setDistancia] = useState(10);
  const [castradoOpcao, setCastradoOpcao] = useState('tanto_faz'); // tanto_faz, sim, nao

  const [indexDestaque, setIndexDestaque] = useState(0);

  // adiciona ou remove o id do pet da lista de favoritos do perfil
  const alternarFavorito = (id: string) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(favId => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  // trava de seguranca: bloqueia a acao se o usuario nao estiver logado
  const verificarAcao = (callback: () => void) => {
    if (!usuarioLogado) {
      router.push('/login');
    } else {
      callback();
    }
  };

  // acao nativa do celular para compartilhar o pet
  const compartilharPet = async (nomePet: string) => {
    try {
      await Share.share({
        message: `Olha que lindo esse pet para adoção: ${nomePet}! Vi no app Adotei.`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // logica de filtros cruzados em cima dos pets cadastrados
  const petsFiltrados = pets.filter(pet => {
    const bateTexto = pet.nome.toLowerCase().includes(buscaTexto.toLowerCase()) || pet.id === buscaTexto;
    const bateEspecie = (pet.especie === 'Cachorro' && filtroCachorro) ||
                         (pet.especie === 'Gato' && filtroGato) ||
                         (pet.especie === 'Pássaro' && filtroPassaro);
    const bateGenero = (pet.genero === 'Fêmea' && filtroFemea) ||
                        (pet.genero === 'Macho' && filtroMacho);
    
    let bateCastrado = true;
    if (castradoOpcao === 'sim') bateCastrado = pet.castrado?.toLowerCase() === 'sim';
    if (castradoOpcao === 'nao') bateCastrado = pet.castrado?.toLowerCase() === 'não';

    return bateTexto && bateEspecie && bateGenero && bateCastrado;
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* 1. bloco do carrossel em destaque superior */}
        {pets.length > 0 ? (
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
              <TouchableOpacity 
                style={styles.arrowLeft} 
                onPress={() => setIndexDestaque(prev => prev === 0 ? pets.length - 1 : prev - 1)}
              >
                <Ionicons name="chevron-back" size={24} color="#8DC4A6" />
              </TouchableOpacity>

              <Image source={{ uri: pets[indexDestaque].foto }} style={styles.destaqueImg} />

              <TouchableOpacity 
                style={styles.arrowRight} 
                onPress={() => setIndexDestaque(prev => prev === pets.length - 1 ? 0 : prev + 1)}
              >
                <Ionicons name="chevron-forward" size={24} color="#8DC4A6" />
              </TouchableOpacity>
            </View>

            <Text style={styles.destaquePetName}>{pets[indexDestaque].nome}</Text>
            <Text style={styles.destaquePetInfo}>{pets[indexDestaque].idade} • {pets[indexDestaque].porte}</Text>
          </View>
        ) : null}

        {/* 2. botao principal para abrir o modal de filtros */}
        <TouchableOpacity style={styles.btnFiltros} onPress={() => setModalFiltrosVisivel(true)}>
          <Ionicons name="funnel-outline" size={18} color="#8DC4A6" />
          <Text style={styles.btnFiltrosText}>Filtros</Text>
        </TouchableOpacity>

        {/* 3. listagem principal vertical dos cards */}
        <View style={styles.boxListagem}>
          <Text style={styles.listagemTitle}>Encontre seu novo melhor amigo:</Text>
          <Text style={styles.listagemSubtitle}>Juntos, podemos transformar vidas — uma adoção de cada vez.</Text>

          {petsFiltrados.length === 0 ? (
            /* layout limpo com borda tracejada se nao houver nenhum pet */
            <View style={styles.emptyBox}>
              <Ionicons name="paw-outline" size={40} color="#CBD5E0" />
              <Text style={styles.emptyText}>Nenhum animal cadastrado ou encontrado.</Text>
            </View>
          ) : (
            /* mapeamento dos cards dos pets cadastrados */
            petsFiltrados.map((pet) => (
              <View key={pet.id} style={styles.petCardRow}>
                <Image source={{ uri: pet.foto }} style={styles.petCardImg} />
                
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

                  <Text style={styles.miniCardDesc} numberOfLines={2}>
                    {pet.desc}
                  </Text>

                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity 
                      style={styles.btnCardAdotar} 
                      onPress={() => verificarAcao(() => setPetSelecionado(pet))}
                    >
                      <Text style={styles.btnCardAdotarText}>Adotar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.btnCardFav, favoritos.includes(pet.id) && styles.btnCardFavActive]} 
                      onPress={() => alternarFavorito(pet.id)}
                    >
                      <Ionicons 
                        name={favoritos.includes(pet.id) ? "heart" : "heart-outline"} 
                        size={20} 
                        color={favoritos.includes(pet.id) ? "#FFF" : "#718096"} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* ================= MODAL DE FILTROS COMPLETO ================= */}
      <Modal visible={modalFiltrosVisivel} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContentFiltros}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Filtros</Text>
              <TouchableOpacity onPress={() => setModalFiltrosVisivel(false)}>
                <Ionicons name="close" size={24} color="#1A202C" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.filterSectionLabel}>Nome ou ID</Text>
              <TextInput 
                style={styles.filterInput}
                placeholder="Buscar..."
                placeholderTextColor="#A0AEC0"
                value={buscaTexto}
                onChangeText={setBuscaTexto}
              />

              <Text style={styles.filterSectionLabel}>Espécie</Text>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setFiltroCachorro(!filtroCachorro)}>
                <Ionicons name={filtroCachorro ? "checkbox" : "square-outline"} size={20} color="#8DC4A6" />
                <Text style={styles.checkboxText}>Cachorro</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setFiltroGato(!filtroGato)}>
                <Ionicons name={filtroGato ? "checkbox" : "square-outline"} size={20} color="#8DC4A6" />
                <Text style={styles.checkboxText}>Gato</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setFiltroPassaro(!filtroPassaro)}>
                <Ionicons name={filtroPassaro ? "checkbox" : "square-outline"} size={20} color="#8DC4A6" />
                <Text style={styles.checkboxText}>Pássaro</Text>
              </TouchableOpacity>

              <Text style={styles.filterSectionLabel}>Gênero</Text>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setFiltroFemea(!filtroFemea)}>
                <Ionicons name={filtroFemea ? "checkbox" : "square-outline"} size={20} color="#8DC4A6" />
                <Text style={styles.checkboxText}>Fêmea</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setFiltroMacho(!filtroMacho)}>
                <Ionicons name={filtroMacho ? "checkbox" : "square-outline"} size={20} color="#8DC4A6" />
                <Text style={styles.checkboxText}>Macho</Text>
              </TouchableOpacity>

              <Text style={styles.filterSectionLabel}>Porte</Text>
              <TextInput style={styles.filterInputDisabled} editable={false} value="Qualquer" />

              <Text style={styles.filterSectionLabel}>Cor</Text>
              <TextInput style={styles.filterInputDisabled} editable={false} value="Qualquer" />

              <Text style={styles.filterSectionLabel}>Raça</Text>
              <TextInput style={styles.filterInputDisabled} editable={false} value="Qualquer" />

              <Text style={styles.filterSectionLabel}>Idade</Text>
              <TextInput style={styles.filterInputDisabled} editable={false} value="Qualquer" />

              <Text style={styles.filterSectionLabel}>Temperamento</Text>
              <TextInput style={styles.filterInputDisabled} editable={false} value="Qualquer" />

              {/* Componente Slider real agora funcionando sem erros */}
              <Text style={styles.filterSectionLabel}>Distância máxima: {distancia}km</Text>
              <View style={styles.sliderWrapper}>
                <Slider 
                  minimumValue={1} 
                  maximumValue={50} 
                  step={1} 
                  value={distancia} 
                  onValueChange={setDistancia} 
                  minimumTrackTintColor="#E53E3E" // barra preenchida vermelha
                  maximumTrackTintColor="#E2E8F0" // barra vazia cinza
                  thumbTintColor="#E53E3E"        // bolinha vermelha do design
                  style={{ width: '100%', height: 40 }}
                />
              </View>

              {/* Opções de Castrado batendo com o design */}
              <Text style={styles.filterSectionLabel}>Castrado</Text>
              <TouchableOpacity style={styles.radioRow} onPress={() => setCastradoOpcao('tanto_faz')}>
                <Ionicons name={castradoOpcao === 'tanto_faz' ? "radio-button-on" : "radio-button-off"} size={20} color={castradoOpcao === 'tanto_faz' ? "#E53E3E" : "#718096"} />
                <Text style={styles.radioText}>Tanto faz</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioRow} onPress={() => setCastradoOpcao('sim')}>
                <Ionicons name={castradoOpcao === 'sim' ? "radio-button-on" : "radio-button-off"} size={20} color={castradoOpcao === 'sim' ? "#E53E3E" : "#718096"} />
                <Text style={styles.radioText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioRow} onPress={() => setCastradoOpcao('nao')}>
                <Ionicons name={castradoOpcao === 'nao' ? "radio-button-on" : "radio-button-off"} size={20} color={castradoOpcao === 'nao' ? "#E53E3E" : "#718096"} />
                <Text style={styles.radioText}>Não</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnAplicarFiltros} onPress={() => setModalFiltrosVisivel(false)}>
                <Text style={styles.btnAplicarText}>Aplicar Filtros</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL DETALHES DO PET ================= */}
      <Modal visible={petSelecionado !== null} animationType="slide">
        {petSelecionado && (
          <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.detailsImgWrapper}>
              <Image source={{ uri: petSelecionado.foto }} style={styles.detailsImg} />
              <TouchableOpacity style={styles.btnCloseDetails} onPress={() => setPetSelecionado(null)}>
                <Ionicons name="close" size={24} color="#1A202C" />
              </TouchableOpacity>
            </View>

            <View style={styles.detailsContentBox}>
              <View style={styles.detailsNameRow}>
                <Text style={styles.detailsPetName}>{petSelecionado.nome}</Text>
                <TouchableOpacity 
                  style={[styles.btnCardFav, favoritos.includes(petSelecionado.id) && styles.btnCardFavActive]}
                  onPress={() => alternarFavorito(petSelecionado.id)}
                >
                  <Ionicons name={favoritos.includes(petSelecionado.id) ? "heart" : "heart-outline"} size={20} color={favoritos.includes(petSelecionado.id) ? "#FFF" : "#718096"} />
                </TouchableOpacity>
              </View>

              <View style={styles.detailsRowBasic}>
                <View>
                  <Text style={styles.gridLabel}>Gênero</Text>
                  <Text style={styles.gridValue}>{petSelecionado.genero}</Text>
                </View>
                <View style={{ marginLeft: 60 }}>
                  <Text style={styles.gridLabel}>Espécie</Text>
                  <Text style={styles.gridValue}>{petSelecionado.especie}</Text>
                </View>
              </View>

              <View style={styles.boxInfoGerais}>
                <Text style={styles.infoGeraisTitle}>Informações Gerais</Text>
                <View style={styles.infoGeraisGrid}>
                  <View style={styles.miniCardInfo}>
                    <Ionicons name="menu-outline" size={16} color="#4A5568" />
                    <Text style={styles.miniCardLabel}>Porte</Text>
                    <Text style={styles.miniCardValue}>{petSelecionado.porte ?? 'Médio'}</Text>
                  </View>
                  <View style={styles.miniCardInfo}>
                    <Ionicons name="color-palette-outline" size={16} color="#4A5568" />
                    <Text style={styles.miniCardLabel}>Cor</Text>
                    <Text style={styles.miniCardValue} numberOfLines={1}>{petSelecionado.cor ?? 'Padrão'}</Text>
                  </View>
                </View>

                <View style={styles.infoGeraisGridMargin}>
                  <View style={styles.miniCardInfo}>
                    <Ionicons name="paw-outline" size={16} color="#4A5568" />
                    <Text style={styles.miniCardLabel}>Raça</Text>
                    <Text style={styles.miniCardValue}>{petSelecionado.raca ?? 'Vira-lata'}</Text>
                  </View>
                  <View style={styles.miniCardInfo}>
                    <Ionicons name="time-outline" size={16} color="#4A5568" />
                    <Text style={styles.miniCardLabel}>Idade</Text>
                    <Text style={styles.miniCardValue}>{petSelecionado.idade}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.detailsDescText}>{petSelecionado.desc}</Text>

              <View style={styles.boxAvisoInfo}>
                <Ionicons name="help-circle-outline" size={20} color="#718096" />
                <Text style={styles.avisoBoxText}>Para adotar, clique no botão abaixo e fale com o cuidador!</Text>
              </View>

              <View style={styles.detailsFooterActions}>
                {/* chama a lofica de seguranca de login antes de abrir a intencao de adocao */}
                <TouchableOpacity 
                  style={styles.btnQueroAdotarMain}
                  onPress={() => verificarAcao(() => alert('Abrindo chat: "Quero adotar!"'))}
                >
                  <Ionicons name="heart" size={20} color="#FFF" />
                  <Text style={styles.btnQueroAdotarMainText}>Quero adotar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnShare} onPress={() => compartilharPet(petSelecionado.nome)}>
                  <Ionicons name="share-social-outline" size={20} color="#4A5568" />
                </TouchableOpacity>
              </View>

              <View style={styles.linksFinaisBox}>
                <TouchableOpacity style={styles.linkRowItem} onPress={() => { setPetSelecionado(null); router.push('/tutorial'); }}>
                  <Ionicons name="help-circle-outline" size={18} color="#8DC4A6" />
                  <Text style={styles.linkRowItemText}>Têm alguma dúvida? Clique aqui</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkRowItemMargin} onPress={() => alert('Denúncia registrada!')}>
                  <Text style={styles.linkRowItemTextDenuncie}>Encontrou algum problema? Denuncie</Text>
                </TouchableOpacity>
              </View>

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
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContentFiltros: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C' },
  filterSectionLabel: { fontSize: 13, fontWeight: 'bold', color: '#2D3748', marginTop: 15, marginBottom: 8 },
  filterInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, height: 42, paddingHorizontal: 12, fontSize: 14, color: '#2D3748' },
  filterInputDisabled: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, height: 42, paddingHorizontal: 12, fontSize: 14, color: '#A0AEC0' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10, paddingLeft: 4 },
  checkboxText: { fontSize: 14, color: '#2D3748' },
  
  // espacamento da area do slider real
  sliderWrapper: { marginVertical: 5, paddingHorizontal: 2, alignItems: 'center' },
  
  // Radio buttons de castrado
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, paddingLeft: 4 },
  radioText: { fontSize: 14, color: '#2D3748' },
  
  btnAplicarFiltros: { backgroundColor: '#8DC4A6', height: 45, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 25, marginBottom: 10 },
  btnAplicarText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  detailsContainer: { flex: 1, backgroundColor: '#FEFDF9' },
  detailsImgWrapper: { width: '100%', height: 260, position: 'relative' },
  detailsImg: { width: '100%', height: '100%' },
  btnCloseDetails: { position: 'absolute', top: 40, right: 20, width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  detailsContentBox: { padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#FEFDF9', marginTop: -20 },
  detailsNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  detailsPetName: { fontSize: 24, fontWeight: 'bold', color: '#1A202C' },
  detailsRowBasic: { flexDirection: 'row', marginBottom: 20 },
  boxInfoGerais: { backgroundColor: '#EBF7F0', borderRadius: 20, padding: 15, marginBottom: 20 },
  infoGeraisTitle: { fontSize: 14, fontWeight: 'bold', color: '#2D3748', marginBottom: 12 },
  infoGeraisGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  infoGeraisGridMargin: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  miniCardInfo: { width: '48%', backgroundColor: '#FFF', borderRadius: 12, padding: 10, gap: 4 },
  miniCardLabel: { fontSize: 10, color: '#A0AEC0', fontWeight: '500' },
  miniCardValue: { fontSize: 13, color: '#2D3748', fontWeight: 'bold' },
  detailsSectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A202C', marginTop: 15, marginBottom: 10 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagPersonalidade: { backgroundColor: '#EDF2F7', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20 },
  tagText: { fontSize: 13, color: '#4A5568' },
  detailsDescText: { fontSize: 14, color: '#4A5568', lineHeight: 22, marginTop: 20 },
  boxAvisoInfo: { flexDirection: 'row', backgroundColor: '#F7FAFC', borderRadius: 12, padding: 12, alignItems: 'center', gap: 10, marginTop: 20 },
  avisoBoxText: { fontSize: 12, color: '#718096', flex: 1 },
  detailsFooterActions: { flexDirection: 'row', gap: 12, marginTop: 25, alignItems: 'center' },
  btnQueroAdotarMain: { flex: 1, backgroundColor: '#8DC4A6', height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnQueroAdotarMainText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  btnShare: { width: 48, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  linksFinaisBox: { marginTop: 25, paddingBottom: 20, alignItems: 'center' },
  linkRowItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  linkRowItemMargin: { marginTop: 15 },
  linkRowItemText: { fontSize: 13, color: '#8DC4A6', fontWeight: '500' },
  linkRowItemTextDenuncie: { fontSize: 13, color: '#718096' }
});