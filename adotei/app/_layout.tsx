import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#FEFDF9' }}>
      {/* Header Fixo no Topo */}
      <SafeAreaView style={styles.header}>
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
      </SafeAreaView>

      {/* Navegação por Abas (Conteúdo que muda fica aqui) */}
      <Tabs
        screenOptions={{
          headerShown: false, // Esconde o header padrão das telas individuais
          tabBarStyle: styles.bottomMenu,
          tabBarActiveTintColor: '#8DC4A6',
          tabBarInactiveTintColor: '#718096',
        }}
      >
        <Tabs.Screen
          name="catalog/index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={26} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search" // Supondo que você terá uma tela de busca
          options={{
            title: 'Adotar',
            tabBarIcon: ({ color }) => <Ionicons name="search" size={26} color={color} />,
          }}
        />
        <Tabs.Screen
          name="my-pets/new"
          options={{
            title: 'Doar',
            tabBarIcon: () => (
              <View style={styles.plusButton}>
                <Ionicons name="add" size={30} color="#FFF" />
              </View>
            ),
          }}
        />
        {/* Adicione outras abas conforme o protótipo (Avisos, Perfil) */}
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: '#8DC4A6', paddingTop: 40, paddingBottom: 15 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoText: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginLeft: 8 },
  authButtons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  authText: { color: '#FFF', fontWeight: '600', fontSize: 15 },
  divider: { width: 1, height: 15, backgroundColor: 'rgba(255,255,255,0.5)' },
  bottomMenu: { height: 70, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 10 },
  plusButton: { 
    backgroundColor: '#8DC4A6', 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 20, // Faz o efeito de "pular" para fora da barra
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }
});