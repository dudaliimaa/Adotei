import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  // a lista começa vazia e vai carregar os pets que os usuarios cadastrarem no app
  const [petsDisponiveis, setPetsDisponiveis] = useState([]);

  // lista fixa do carrossel de relatos de sucesso de baixo
  const relatos = [
    {
      id: '1',
      nome: 'Beta',
      texto: 'Adotei a Beta aqui pelo site e foi uma experiência incrível! Ela é uma gatinha muito carinhosa e que finalmente encontrou um lar.',
      foto: 'https://images.unsplash.com/photo-1574158622643-69d34d72650a?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: '2',
      nome: 'Luna',
      texto: 'A Luna trouxe alegria para nossa casa. O processo de conexão com a ONG foi super rápido e seguro. Recomendo muito o Adotei!',
      foto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop',
    }
  ];

  const [indiceRelato, setIndiceRelato] = useState(0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* cabecalho com a mensagem que tava antes */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Transforme vidas: adote ou doe um amigo 💚</Text>
        <Text style={styles.welcomeSubtitle}>Conectando corações e lares felizes.</Text>
      </View>

      {/* carrossel dinamico de pets para adotar */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Pets disponíveis para adoção</Text>
        
        {petsDisponiveis.length === 0 ? (
          /* mensagem caso nenhum usuario ou ong tenha cadastrado um pet ainda */
          <View style={styles.emptyContainer}>
            <Ionicons name="paw-outline" size={32} color="#CBD5E0" />
            <Text style={styles.emptyText}>Nenhum pet cadastrado no momento.</Text>
          </View>
        ) : (
          /* carrossel horizontal que renderiza os pets adicionados pelo usuario */
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.carouselPets}
          >
            {petsDisponiveis.map((pet: any) => (
              <TouchableOpacity key={pet.id} style={styles.cardPet} onPress={() => router.push('/adotar')}>
                <Image source={{ uri: pet.foto }} style={styles.petImage} />
                <View style={styles.petInfo}>
                  <Text style={styles.petCardName}>{pet.nome}</Text>
                  <Text style={styles.petCardAge}>{pet.idade}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* carrossel de relatos de sucesso */}
      <View style={styles.sectionContainer}>
        <View style={styles.cardRelato}>
          <Text style={styles.relatoHeaderTitle}>Conheça quem encontrou um novo lar:</Text>
          
          {/* estrelinhas de avaliacao */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons key={s} name="star" size={16} color="#FBBF24" />
            ))}
          </View>

          {/* foto e setas de navegacao */}
          <View style={styles.photoRow}>
            <TouchableOpacity onPress={() => setIndiceRelato((prev) => (prev === 0 ? relatos.length - 1 : prev - 1))}>
              <Ionicons name="chevron-back" size={24} color="#8DC4A6" />
            </TouchableOpacity>

            <Image source={{ uri: relatos[indiceRelato].foto }} style={styles.petPhoto} />

            <TouchableOpacity onPress={() => setIndiceRelato((prev) => (prev === relatos.length - 1 ? 0 : prev + 1))}>
              <Ionicons name="chevron-forward" size={24} color="#8DC4A6" />
            </TouchableOpacity>
          </View>

          <Text style={styles.petName}>{relatos[indiceRelato].nome}</Text>

          {/* depoimento do dono */}
          <Text style={styles.depoimentoText}>
            "{relatos[indiceRelato].texto}"
          </Text>

          {/* pontinhos de controle do carrossel */}
          <View style={styles.dotsRow}>
            {relatos.map((_, i) => (
              <View 
                key={i} 
                style={[styles.dot, indiceRelato === i ? styles.activeDot : null]} 
              />
            ))}
          </View>
        </View>
      </View>

      {/* resumo da tela quem somos */}
      <View style={styles.sectionContainerFull}>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Quem somos e por que acreditamos em lares felizes:</Text>
          <Text style={styles.aboutText}>
            Na Adotei, acreditamos que cada animal merece amor, cuidado e um lar acolhedor. 
            Nossa missão é conectar corações: de quem deseja doar, de quem deseja adotar, 
            e de ONGs que trabalham incansavelmente para transformar vidas.
          </Text>
          <TouchableOpacity style={styles.btnSaibaMais} onPress={() => router.push('/quem-somos')}>
            <Text style={styles.btnText}>Saber mais</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF9' },
  
  // textos superiores de boas vindas
  welcomeSection: { alignItems: 'center', paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  welcomeTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A202C', textAlign: 'center', lineHeight: 26 },
  welcomeSubtitle: { fontSize: 14, color: '#718096', textAlign: 'center', marginTop: 6 },

  sectionContainer: { paddingHorizontal: 20, marginBottom: 25 },
  sectionContainerFull: { paddingHorizontal: 20, marginBottom: 35 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3748', marginBottom: 15 },

  // container de aviso quando a lista de pets esta vazia
  emptyContainer: { width: '100%', padding: 30, backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { fontSize: 13, color: '#A0AEC0', textAlign: 'center' },

  // lista horizontal de pets
  carouselPets: { gap: 15, paddingRight: 20 },
  cardPet: { width: 140, backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  petImage: { width: '100%', height: 120, backgroundColor: '#F7FAFC' },
  petInfo: { padding: 10 },
  petCardName: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
  petCardAge: { fontSize: 12, color: '#718096', marginTop: 2 },

  // carrossel de relatos
  cardRelato: { width: '100%', backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#8DC4A6', padding: 20, alignItems: 'center' },
  relatoHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C', textAlign: 'center', marginBottom: 10 },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 15 },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  petPhoto: { width: 150, height: 150, borderRadius: 20 },
  petName: { fontSize: 18, fontWeight: 'bold', color: '#2D3748', marginTop: 12 },
  depoimentoText: { fontSize: 13, color: '#4A5568', textAlign: 'center', fontStyle: 'italic', lineHeight: 18, marginTop: 8, paddingHorizontal: 10 },
  dotsRow: { flexDirection: 'row', gap: 6, marginTop: 15 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#CBD5E0' },
  activeDot: { backgroundColor: '#8DC4A6', width: 16 },

  // card institucional do quem somos
  aboutCard: { padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#8DC4A6', backgroundColor: '#FFF' },
  aboutTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', marginBottom: 12 },
  aboutText: { fontSize: 13, color: '#4A5568', lineHeight: 20, marginBottom: 15 },
  btnSaibaMais: { backgroundColor: '#8DC4A6', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignSelf: 'flex-start' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});