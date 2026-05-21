import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header Superior: Logo + Entrar/Cadastrar */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoRow}>
            <Ionicons name="heart" size={24} color="#FFF" />
            <Text style={styles.logoText}>Adotei</Text>
          </View>
          
          <View style={styles.authButtons}>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.authText}>Entrar</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.authText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Seção Hero (Chamada Principal) */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Transforme vidas: adote ou doe um amigo 💚</Text>
          <Text style={styles.heroSubtitle}>Conectando corações e lares felizes.</Text>
        </View>

        {/* Placeholder do Catálogo (Onde aparecerão os pets dos usuários) */}
        <View style={styles.gridContainer}>
          <Text style={styles.sectionTitle}>Pets disponíveis para adoção</Text>
          <View style={styles.grid}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.petCardPlaceholder}>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="paw" size={40} color="#CBD5E0" />
                </View>
                <View style={styles.textPlaceholder} />
                <View style={[styles.textPlaceholder, { width: '60%' }]} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Menu Inferior Fixo (Tab Bar) */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuTab} onPress={() => router.push('/(tabs)/catalog')}>
          <Ionicons name="home" size={26} color="#8DC4A6" />
          <Text style={[styles.menuTabText, { color: '#8DC4A6' }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuTab} onPress={() => router.push('/(tabs)/catalog')}>
          <Ionicons name="search" size={26} color="#718096" />
          <Text style={styles.menuTabText}>Adotar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuTab} onPress={() => router.push('/(tabs)/my-pets/new')}>
          <View style={styles.plusButton}>
            <Ionicons name="add" size={30} color="#FFF" />
          </View>
          <Text style={styles.menuTabText}>Doar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuTab}>
          <Ionicons name="notifications-outline" size={26} color="#718096" />
          <Text style={styles.menuTabText}>Avisos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuTab}>
          <Ionicons name="person-outline" size={26} color="#718096" />
          <Text style={styles.menuTabText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF9' },
  header: { 
    backgroundColor: '#8DC4A6', 
    height: 100, 
    justifyContent: 'flex-end', 
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    alignItems: 'center' 
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoText: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginLeft: 8 },
  authButtons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  authText: { color: '#FFF', fontWeight: '600', fontSize: 15 },
  divider: { width: 1, height: 15, backgroundColor: 'rgba(255,255,255,0.5)' },
  
  scrollPadding: { paddingBottom: 100 },
  hero: { padding: 25, alignItems: 'center' },
  heroTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#2D3748' },
  heroSubtitle: { fontSize: 16, color: '#718096', textAlign: 'center', marginTop: 8 },

  gridContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3748', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  petCardPlaceholder: { 
    width: (width / 2) - 30, 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    padding: 10, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  imagePlaceholder: { 
    width: '100%', 
    height: 120, 
    backgroundColor: '#F7FAFC', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  textPlaceholder: { 
    height: 12, 
    backgroundColor: '#EDF2F7', 
    borderRadius: 6, 
    marginTop: 10, 
    width: '80%' 
  },

  bottomMenu: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    height: 80, 
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 15
  },
  menuTab: { alignItems: 'center', justifyContent: 'center' },
  menuTabText: { fontSize: 12, color: '#718096', marginTop: 4 },
  plusButton: { 
    backgroundColor: '#8DC4A6', 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: -25, // Faz o botão de doar ficar um pouco "saltado"
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }
});