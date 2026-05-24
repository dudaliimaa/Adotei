import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// importando o picker de imagens que instalamos
import * as ImagePicker from 'expo-image-picker';

export default function DoarScreen() {
  // 1. Estados de Informações Básicas do Pet
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('Cachorro'); // Atualizado: Apenas Cachorro, Gato e Pássaro
  const [genero, setGenero] = useState('Macho'); 
  const [idade, setIdade] = useState('');
  const [cor, setCor] = useState('');
  const [porte, setPorte] = useState('Médio'); 
  const [raca, setRaca] = useState('');
  const [descricao, setDescricao] = useState('');

  // Dados do Responsável
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  // 2. Estado para guardar a lista de fotos locais do celular
  const [fotos, setFotos] = useState<string[]>([]);

  // 3. Estados de Localização com ViaCEP
  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [tipoLugar, setTipoLugar] = useState('Casa'); 
  const [buscandoCep, setBuscandoCep] = useState(false);

  // Lógica para buscar o CEP automaticamente
  const lidarBuscaCep = async (valorCep: string) => {
    const cepLimpo = valorCep.replace(/\D/g, '');
    setCep(cepLimpo);

    if (cepLimpo.length === 8) {
      setBuscandoCep(true);
      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
          Alert.alert('Erro', 'CEP não encontrado.');
        } else {
          setCidade(dados.localidade);
          setBairro(dados.bairro);
          setEstado(dados.uf);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível buscar o CEP automaticamente.');
      } finally {
        setBuscandoCep(false);
      }
    }
  };

  // Abre a Câmera ou Galeria de verdade e pede permissão
  const handleAdicionarFoto = () => {
    Alert.alert(
      'Selecione a Imagem',
      'De onde você quer escolher a foto do pet?',
      [
        { text: 'Tirar com a Câmera', onPress: abrirCamera },
        { text: 'Escolher da Galeria', onPress: abrirGaleria },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const abrirCamera = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar fotos.');
      return;
    }

    let resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets[0].uri) {
      setFotos([...fotos, resultado.assets[0].uri]);
    }
  };

  const abrirGaleria = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher as fotos.');
      return;
    }

    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets[0].uri) {
      setFotos([...fotos, resultado.assets[0].uri]);
    }
  };

  // Remove uma foto da lista se o usuário clicar em cima dela
  const removerFoto = (indexAlvo: number) => {
    setFotos(fotos.filter((_, index) => index !== indexAlvo));
  };

  // Envio final do formulário
  const handleCadastrarPet = () => {
    if (!nome || !idade || !cep || !cidade || !bairro || !numero || !nomeResponsavel) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const novoPet = {
      nome, especie, genero, idade, cor, porte, raca, descricao,
      responsavel: { nomeResponsavel, telefone, email },
      localizacao: { cep, estado, city: cidade, bairro, numero, tipoLugar },
      fotos // Array de caminhos locais prontinho pro Cloudinary no backend
    };

    console.log('Pet pronto para salvar no banco:', novoPet);
    Alert.alert('Sucesso 🎉', 'O anúncio do pet foi criado e já está disponível para adoção!');
    
    // Reseta todos os campos
    setNome(''); setIdade(''); setCor(''); setRaca(''); setDescricao('');
    setNomeResponsavel(''); setTelefone(''); setEmail('');
    setCep(''); setEstado(''); setCidade(''); setBairro(''); setNumero('');
    setFotos([]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        <Text style={styles.screenTitle}>Cadastrar um Animal para Doação:</Text>

        {/* ================= COMPONENTE DE FOTOS REAL ================= */}
        <View style={styles.sectionCard}>
          <View style={styles.fotosContainer}>
            {/* Botão de adicionar */}
            <TouchableOpacity style={styles.btnUploadFoto} onPress={handleAdicionarFoto}>
              <Ionicons name="add-outline" size={36} color="#A0AEC0" />
              <View style={styles.miniCameraIconBadge}>
                <Ionicons name="camera" size={12} color="#FFF" />
              </View>
            </TouchableOpacity>

            {/* Renderização das fotos reais que o usuário escolheu ou tirou */}
            {fotos.map((uri, index) => (
              <TouchableOpacity key={index} style={styles.previewContainer} onPress={() => removerFoto(index)}>
                <Image source={{ uri }} style={styles.fotoPreview} />
                <View style={styles.removeBadge}>
                  <Ionicons name="close" size={12} color="#FFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ================= DADOS DO ANIMAL ================= */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Dados do Animal</Text>

          <View style={styles.inlineRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.fieldLabel}>Nome</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome do pet" placeholderTextColor="#CBD5E0" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Idade</Text>
              <TextInput style={styles.input} value={idade} onChangeText={setIdade} placeholder="Idade aproximada" placeholderTextColor="#CBD5E0" />
            </View>
          </View>

          <View style={styles.inlineRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.fieldLabel}>Cor</Text>
              <TextInput style={styles.input} value={cor} onChangeText={setCor} placeholder="Cor do pelo" placeholderTextColor="#CBD5E0" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Gênero</Text>
              <View style={styles.selectorContainer}>
                {['Macho', 'Fêmea'].map((item) => (
                  <TouchableOpacity 
                    key={item} 
                    style={[styles.selectorBtnHalf, genero === item && styles.selectorBtnActive]}
                    onPress={() => setGenero(item)}
                  >
                    <Text style={[styles.selectorBtnText, genero === item && styles.selectorBtnTextActive]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Seletor de Espécie corrigido: Sem a opção Outros */}
          <Text style={styles.fieldLabel}>Espécie *</Text>
          <View style={styles.selectorContainer}>
            {['Cachorro', 'Gato', 'Pássaro'].map((item) => (
              <TouchableOpacity 
                key={item} 
                style={[styles.selectorBtnThird, especie === item && styles.selectorBtnActive]}
                onPress={() => setEspecie(item)}
              >
                <Text style={[styles.selectorBtnText, especie === item && styles.selectorBtnTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Seletor de Porte */}
          <Text style={styles.fieldLabel}>Porte</Text>
          <View style={styles.selectorContainer}>
            {['Pequeno', 'Médio', 'Grande'].map((item) => (
              <TouchableOpacity 
                key={item} 
                style={[styles.selectorBtnThird, porte === item && styles.selectorBtnActive]}
                onPress={() => setPorte(item)}
              >
                <Text style={[styles.selectorBtnText, porte === item && styles.selectorBtnTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Raça</Text>
          <TextInput style={styles.input} value={raca} onChangeText={setRaca} placeholder="Ex: Vira-lata, Boxer..." placeholderTextColor="#CBD5E0" />

          <Text style={styles.fieldLabel}>Descrição</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            multiline 
            numberOfLines={3} 
            value={descricao} 
            onChangeText={setDescricao} 
            placeholder="Conte detalhes ou história do animal..."
            placeholderTextColor="#CBD5E0"
          />
        </View>

        {/* ================= DADOS DO RESPONSÁVEL ================= */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Dados do Responsável</Text>

          <Text style={styles.fieldLabel}>Nome do Responsável *</Text>
          <TextInput style={styles.input} value={nomeResponsavel} onChangeText={setNomeResponsavel} placeholder="Nome completo" placeholderTextColor="#CBD5E0" />

          <View style={styles.inlineRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.fieldLabel}>Telefone</Text>
              <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholder="(00) 00000-0000" placeholderTextColor="#CBD5E0" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>E-mail</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="email@exemplo.com" placeholderTextColor="#CBD5E0" />
            </View>
          </View>
        </View>

        {/* ================= LOCALIZAÇÃO DO ANIMAL ================= */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Localização do Animal</Text>

          <Text style={styles.fieldLabel}>CEP *</Text>
          <View style={styles.cepWrapper}>
            <TextInput 
              style={styles.input} 
              value={cep} 
              onChangeText={lidarBuscaCep} 
              keyboardType="numeric" 
              maxLength={8} 
              placeholder="00000000"
              placeholderTextColor="#CBD5E0"
            />
            {buscandoCep && <ActivityIndicator size="small" color="#8DC4A6" style={styles.cepLoader} />}
          </View>

          <Text style={styles.fieldLabel}>Endereço (Cidade / Estado) *</Text>
          <TextInput style={styles.inputDisabled} editable={false} value={cidade ? `${cidade} - ${estado}` : ''} placeholder="Preenchido pelo CEP" placeholderTextColor="#A0AEC0" />

          <View style={styles.inlineRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.fieldLabel}>Número *</Text>
              <TextInput style={styles.input} value={numero} onChangeText={setNumero} placeholder="Nº" placeholderTextColor="#CBD5E0" />
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.fieldLabel}>Bairro *</Text>
              <TextInput style={styles.inputDisabled} editable={false} value={bairro} placeholder="Bairro" placeholderTextColor="#A0AEC0" />
            </View>
          </View>

          {/* Tipo de Espaço Atual corrigido: "Apartamento" cabendo perfeitamente */}
          <Text style={styles.fieldLabel}>Tipo de Espaço Atual *</Text>
          <View style={styles.selectorContainer}>
            {['Casa', 'Apartamento', 'Comércio', 'Outro'].map((item) => (
              <TouchableOpacity 
                key={item} 
                style={[styles.selectorBtnLugar, tipoLugar === item && styles.selectorBtnActive]}
                onPress={() => setTipoLugar(item)}
              >
                <Text style={[styles.selectorBtnTextLugar, tipoLugar === item && styles.selectorBtnTextActive]} numberOfLines={1}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botão de Envio Principal */}
        <TouchableOpacity style={styles.btnCadastrar} onPress={handleCadastrarPet}>
          <Text style={styles.btnCadastrarText}>Cadastrar</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF9' },
  scrollContainer: { paddingHorizontal: 15, paddingTop: 10, paddingBottom: 30 },
  screenTitle: { fontSize: 18, fontWeight: 'bold', color: '#5A6261', marginBottom: 15 },
  
  sectionCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 15 },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#5A6261', marginBottom: 5 },
  
  fieldLabel: { fontSize: 12, color: '#718096', fontWeight: '500', marginTop: 10, marginBottom: 4 },
  input: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, height: 42, paddingHorizontal: 12, fontSize: 13, color: '#2D3748' },
  inputDisabled: { backgroundColor: '#EDF2F7', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, height: 42, paddingHorizontal: 12, fontSize: 13, color: '#4A5568' },
  textArea: { height: 65, textAlignVertical: 'top', paddingTop: 8 },
  inlineRow: { flexDirection: 'row', justifyContent: 'space-between' },
  
  // Layout das fotos estilo Figma
  fotosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' },
  btnUploadFoto: { width: 75, height: 75, borderRadius: 37.5, backgroundColor: '#EDF2F7', alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 1, borderColor: '#CBD5E0' },
  miniCameraIconBadge: { position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, backgroundColor: '#8DC4A6', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FFF' },
  
  previewContainer: { position: 'relative' },
  fotoPreview: { width: 70, height: 70, borderRadius: 35, borderWidth: 1, borderColor: '#E2E8F0' },
  removeBadge: { position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderRadius: 9, backgroundColor: '#E53E3E', alignItems: 'center', justifyContent: 'center' },
  
  // Seletores dinâmicos de botões
  selectorContainer: { flexDirection: 'row', gap: 6, marginTop: 2, width: '100%' },
  selectorBtnHalf: { flex: 1, height: 38, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  selectorBtnThird: { flex: 1, height: 38, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  
  // Corrigido para "Apartamento" caber sem quebrar linha
  selectorBtnLugar: { paddingHorizontal: 4, flex: 1, height: 38, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  selectorBtnActive: { backgroundColor: '#8DC4A6', borderColor: '#8DC4A6' },
  selectorBtnText: { fontSize: 12, color: '#4A5568', fontWeight: '500' },
  selectorBtnTextLugar: { fontSize: 11, color: '#4A5568', fontWeight: '500', textAlign: 'center' },
  selectorBtnTextActive: { color: '#FFF', fontWeight: 'bold' },
  
  cepWrapper: { position: 'relative', justifyContent: 'center' },
  cepLoader: { position: 'absolute', right: 12 },
  
  // Botão Cadastrar oficial do rodapé
  btnCadastrar: { backgroundColor: '#8DC4A6', height: 46, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  btnCadastrarText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' }
});