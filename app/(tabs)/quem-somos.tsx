import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QuemSomosScreen() {
  
  // Função para abrir o site do RG de animais (SinPatinhas)
  const abrirSiteSinPatinhas = () => {
    Linking.openURL('https://sinpatinhas.com.br'); // Link placeholder para o RG de pets
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ================= BLOCO 1: POR QUE CRIAMOS O ADOTEI? ================= */}
        <View style={styles.sectionCardBordered}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Por que criamos o Adotei?</Text>
            <Ionicons name="heart" size={20} color="#8DC4A6" style={styles.heartIcon} />
          </View>
          
          <Text style={styles.paragraph}>
            O Adotei surgiu da vontade de facilitar o encontro entre animais que precisam de um lar e pessoas dispostas a oferecer amor. Vimos que muitas adoções e doações se perdiam por falta de informação ou canais organizados.
          </Text>
          
          <Text style={styles.paragraph}>
            Criamos esta plataforma para que tudo isso aconteça de forma simples, direta e segura — sem depender de redes sociais ou processos confusos. Aqui, você pode adotar ou doar com poucos cliques, confiando em um ambiente feito com responsabilidade e carinho.
          </Text>

          {/* Ilustração/Ícone representativo do Bloco 1 */}
          <View style={styles.illustrationPlaceholder}>
            <Ionicons name="people-outline" size={44} color="#8DC4A6" />
            <Text style={styles.illustrationText}>Conectando protetores e adotantes</Text>
          </View>
        </View>

        {/* ================= BLOCO 2: UM NOVO COMEÇO ================= */}
        <View style={styles.sectionCardNormal}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Aqui, cada gesto cria um novo começo</Text>
            <Ionicons name="heart" size={20} color="#8DC4A6" style={styles.heartIcon} />
          </View>

          <Text style={styles.paragraph}>
            No Adotei, acreditamos no poder transformador da conexão entre pessoas e animais. Criamos uma plataforma simples e segura onde cada adoção ou doação escreve uma nova história de amor.
          </Text>

          <Text style={styles.paragraph}>
            Ser parte disso vai além de um gesto - é abraçar uma causa que muda vidas. Cada ação, por menor que seja, constrói um futuro com mais dignidade para os animais. Juntos, formamos uma rede onde toda chance dada vira uma esperança realizada.
          </Text>
        </View>

        {/* ================= BLOCO 3: DIVULGAÇÃO SINPATINHAS (RG ANIMAL) ================= */}
        <View style={styles.sinPatinhasCard}>
          <View style={styles.sinPatinhasHeader}>
            <View style={styles.badgeIcon}>
              <Ionicons name="card-outline" size={22} color="#319795" />
            </View>
            <Text style={styles.sinPatinhasTitle}>RG de Animais Domésticos</Text>
          </View>

          <Text style={styles.sinPatinhasText}>
            Registre seu animal de estimação no RG de animais domésticos (documento oficial de identificação) e mantenha sua Carteira de Saúde Animal atualizada com vacinas e histórico veterinário. Esses registros garantem mais segurança e cuidados organizados para seu pet.
          </Text>

          {/* Link clicável do SinPatinhas */}
          <TouchableOpacity style={styles.linkContainer} onPress={abrirSiteSinPatinhas}>
            <Text style={styles.linkTextPre}>Acesse o site oficial para cadastrar:</Text>
            <Text style={styles.linkTextUrl}>SinPatinhas</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF9' },
  scrollContent: { padding: 20, paddingBottom: 40 },

  // Card 1: Com borda verde ao redor igual ao primeiro bloco do Figma
  sectionCardBordered: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 20, 
    borderWidth: 1.5, 
    borderColor: '#8DC4A6', 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1
  },

  // Card 2: Estilo padrão limpo
  sectionCardNormal: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    marginBottom: 20 
  },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', flex: 1 },
  heartIcon: { marginLeft: 4 },
  
  paragraph: { fontSize: 13, color: '#4A5568', lineHeight: 22, marginBottom: 12, textAlign: 'justify' },

  // Caixa de mini ilustração interna
  illustrationPlaceholder: { 
    backgroundColor: '#F0F9F4', 
    borderRadius: 12, 
    padding: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 10, 
    gap: 6,
    borderWidth: 1,
    borderColor: '#E6FFFA'
  },
  illustrationText: { fontSize: 12, color: '#2F855A', fontWeight: '500' },

  // Card do SinPatinhas (Verde água/Claridade do print)
  sinPatinhasCard: { 
    backgroundColor: '#E6FFFA', 
    borderRadius: 16, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: '#B2F5EA' 
  },
  sinPatinhasHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  badgeIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  sinPatinhasTitle: { fontSize: 15, fontWeight: 'bold', color: '#234E52' },
  sinPatinhasText: { fontSize: 13, color: '#2D3748', lineHeight: 22, textAlign: 'justify' },

  // Área do link
  linkContainer: { marginTop: 15, alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#B2F5EA' },
  linkTextPre: { fontSize: 12, color: '#718096' },
  linkTextUrl: { fontSize: 14, color: '#319795', fontWeight: 'bold', marginTop: 4, textDecorationLine: 'underline' }
});