import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#FEFDF9' }}>
      {/* HEADER VERDE FIXO - APARECE EM TODAS AS ABAS */}
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

      {/* MENU DE BAIXO (TABS) - IGUAL AO PROTÓTIPO */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#8DC4A6',
          tabBarInactiveTintColor: '#718096',
        }}
      >
        <Tabs.Screen
          name="catalog/index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="adoptions/index"
          options={{
            title: 'Adotar',
            tabBarIcon: ({ color }) => <Ionicons name="search-outline" size={24} color={color} />,
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
        <Tabs.Screen
          name="profile/index"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
          }}
        />
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
  authText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  divider: { width: 1, height: 12, backgroundColor: 'rgba(255,255,255,0.5)' },
  
  tabBar: { 
    height: 70, 
    backgroundColor: '#FFF', 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0', 
    paddingBottom: 10 
  },
  plusButton: { 
    backgroundColor: '#8DC4A6', 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: -25, // Faz o efeito saltado
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3
  }
});