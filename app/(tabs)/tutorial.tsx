import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TutorialScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Cabeçalho principal da tela */}
        <Text style={styles.mainTitle}>Passo a Passo para Adotar um Pet com a Adotei:</Text>
        <Text style={styles.mainSubtitle}>Siga estes passos simples e transforme vidas!</Text>

        {/* PASSO 1 */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Encontre o Pet dos Seus Sonhos</Text>
          </View>
          <Text style={styles.stepDescription}>
            Navegue pela nossa lista de pets e encontre o animalzinho que mais combina com você. É possível visualizar fotos, descrições e outras informações para te ajudar na escolha.
          </Text>
        </View>

        {/* Ilustração do Passo 1 */}
        <View style={[styles.illustrationBox, { backgroundColor: '#FFF5F5', borderColor: '#FED7D7' }]}>
          <Ionicons name="search-outline" size={50} color="#ED8936" />
        </View>

        {/* PASSO 2 */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Crie sua Conta e Faça Login</Text>
          </View>
          <Text style={styles.stepDescription}>
            Before de adotar, você precisa estar cadastrado. Crie uma conta simples na nossa plataforma e faça login para continuar o processo. Assim, garantimos que tudo seja feito de forma segura e organizada.
          </Text>
        </View>

        {/* Ilustração do Passo 2 */}
        <View style={[styles.illustrationBox, { backgroundColor: '#EBF8FF', borderColor: '#BEE3F8' }]}>
          <Ionicons name="person-add-outline" size={50} color="#4299E1" />
        </View>

        {/* PASSO 3 */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Adote com Amor</Text>
          </View>
          <Text style={styles.stepDescription}>
            Depois de se cadastrar e fazer login, você pode finalizar o processo de adoção. Entre em contato com o cuidador, tire suas dúvidas e prepare-se para receber seu novo melhor amigo!
          </Text>
        </View>

        {/* Ilustração do Passo 3 */}
        <View style={[styles.illustrationBox, { backgroundColor: '#FFF5F5', borderColor: '#FED7D7', marginBottom: 30 }]}>
          <Ionicons name="heart" size={50} color="#FF69B4" />
        </View>

        {/* ================= BLOCO VERDE DA PARTE INFERIOR ================= */}
        <View style={styles.greenSection}>
          <Text style={styles.greenSectionTitle}>Pronto para transformar vidas? 🐾</Text>
          <Text style={styles.greenSectionSubtitle}>Comece agora sua jornada de adoção e encontre seu novo melhor amigo!</Text>

          {/* Redireciona para a aba Adotar */}
          <TouchableOpacity 
            style={styles.btnWhite}
            onPress={() => router.replace('/(tabs)/adotar')}
          >
            <Text style={styles.btnWhiteText}>Ver Pets Disponíveis</Text>
          </TouchableOpacity>

          {/* CORRIGIDO: Agora aponta para /register que é a sua rota real de cadastro */}
          <TouchableOpacity 
            style={styles.btnTransparent}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.btnTransparentText}>Criar Conta</Text>
          </TouchableOpacity>
        </View>

        {/* CARDS INSTITUCIONAIS */}
        <View style={styles.infoCard}>
          <View style={[styles.miniIconCircle, { backgroundColor: '#EBF8FF' }]}>
            <Ionicons name="medical-outline" size={20} color="#3182CE" />
          </View>
          <Text style={styles.infoCardTitle}>Animais Saudáveis</Text>
          <Text style={styles.infoCardDescription}>Todos os pets são verificados e recebem cuidados adequados</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={[styles.miniIconCircle, { backgroundColor: '#FEFCBF' }]}>
            <Ionicons name="hand-left-outline" size={20} color="#D69E2E" />
          </View>
          <Text style={styles.infoCardTitle}>Suporte Completo</Text>
          <Text style={styles.infoCardDescription}>Nossa equipe está sempre pronta para ajudar você</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={[styles.miniIconCircle, { backgroundColor: '#E6FFFA' }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#319795" />
          </View>
          <Text style={styles.infoCardTitle}>Adoção Responsável</Text>
          <Text style={styles.infoCardDescription}>Promovemos a adoção consciente e o bem-estar animal</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF9' },
  scrollContent: { paddingBottom: 40 },

  mainTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A202C', textAlign: 'center', marginTop: 40, paddingHorizontal: 20, lineHeight: 28 },
  mainSubtitle: { fontSize: 14, color: '#718096', textAlign: 'center', marginTop: 8, marginBottom: 25 },

  stepCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginHorizontal: 20, borderWidth: 1, borderColor: '#8DC4A6' },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  stepBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#8DC4A6', alignItems: 'center', justifyContent: 'center' },
  stepBadgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  stepTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A202C' },
  stepDescription: { fontSize: 13, color: '#4A5568', lineHeight: 20 },

  illustrationBox: { height: 130, borderRadius: 16, borderWidth: 1, marginHorizontal: 20, marginTop: 15, marginBottom: 25, alignItems: 'center', justifyContent: 'center' },

  greenSection: { backgroundColor: '#8DC4A6', borderRadius: 24, padding: 20, marginHorizontal: 20, alignItems: 'center', marginBottom: 25 },
  greenSectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8 },
  greenSectionSubtitle: { fontSize: 13, color: '#FFF', textAlign: 'center', lineHeight: 18, marginBottom: 20, opacity: 0.9 },
  
  btnWhite: { backgroundColor: '#FFF', width: '100%', height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  btnWhiteText: { color: '#8DC4A6', fontWeight: 'bold', fontSize: 14 },
  
  btnTransparent: { width: '100%', height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FFF' },
  btnTransparentText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  infoCard: { backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginHorizontal: 20, marginBottom: 15, alignItems: 'center' },
  miniIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  infoCardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A202C', marginBottom: 4 },
  infoCardDescription: { fontSize: 12, color: '#718096', textAlign: 'center', lineHeight: 16 }
});