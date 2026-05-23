import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#FEFDF9' }}>
      {/* TOPO FIXO: Logo + botões de Entrar e Cadastrar */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoRow}>
            <Ionicons name="heart" size={24} color="#FFF" />
            <Text style={styles.logoText}>Adotei</Text>
          </View>
          
          <View style={styles.authButtons}>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.authText}>entrar</Text>
            </TouchableOpacity>
            <Text style={styles.dividerSign}>|</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.authText}>cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* MENU INFERIOR FIXO COM AS TODAS AS ABAS SOLICITADAS */}
      <Tabs
        screenOptions={{
          headerShown: false, // Desativa cabeçalhos extras para evitar duplicação
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#8DC4A6',
          tabBarInactiveTintColor: '#718096',
          tabBarLabelStyle: { fontSize: 10, fontWeight: '500', marginTop: 2 }
        }}
      >
        {/* 1. HOME */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={20} color={color} />
            ),
          }}
        />

        {/* 2. ADOTAR */}
        <Tabs.Screen
          name="adotar"
          options={{
            title: 'Adotar',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "search" : "search-outline"} size={20} color={color} />
            ),
          }}
        />

        {/* 3. DOAR */}
        <Tabs.Screen
          name="doar"
          options={{
            title: 'Doar',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "paw" : "paw-outline"} size={20} color={color} />
            ),
          }}
        />

        {/* 4. QUEM SOMOS */}
        <Tabs.Screen
          name="quem-somos"
          options={{
            title: 'Quem Somos',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "information-circle" : "information-circle-outline"} size={20} color={color} />
            ),
          }}
        />

        {/* 5. ONGS */}
        <Tabs.Screen
          name="ongs"
          options={{
            title: 'ONGs',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "business" : "business-outline"} size={20} color={color} />
            ),
          }}
        />

        {/* 6. TUTORIAL */}
        <Tabs.Screen
          name="tutorial"
          options={{
            title: 'Tutorial',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "play-back" : "play-circle-outline"} size={20} color={color} />
            ),
          }}
        />

        {/* Ocultando a tela antiga de perfil das abas principais para focar no menu do protótipo */}
        <Tabs.Screen
          name="perfil"
          options={{ href: null }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { 
    backgroundColor: '#8DC4A6', 
    paddingTop: 45, 
    paddingBottom: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    alignItems: 'center' 
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoText: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginLeft: 8 },
  authButtons: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authText: { color: '#FFF', fontWeight: '500', fontSize: 15 },
  dividerSign: { color: '#FFF', fontSize: 14, opacity: 0.7 },
  
  tabBar: { 
    height: 75, 
    backgroundColor: '#FFF', 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0', 
    paddingBottom: 12,
    paddingTop: 8
  }
});