import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#FEFDF9' }}>
      {/* topo fixo com barra reta, fina e logo bem visivel */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          
          {/* area da logo ajustada */}
          <View style={styles.logoRow}>
            <Image 
              source={require('../../assets/logo-adotei.png')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
          </View>
          
          {/* botoes de entrar e cadastrar */}
          <View style={styles.authButtons}>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.authText}>entrar</Text>
            </TouchableOpacity>
            <Text style={styles.dividerSign}>|</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.authText}>cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* menu de abas inferior */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#8DC4A6',
          tabBarInactiveTintColor: '#718096',
          tabBarLabelStyle: { fontSize: 10, fontWeight: '500', marginTop: 2 }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={20} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="adotar"
          options={{
            title: 'Adotar',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "search" : "search-outline"} size={20} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="doar"
          options={{
            title: 'Doar',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "paw" : "paw-outline"} size={20} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="ongs"
          options={{
            title: 'ONGs',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "business" : "business-outline"} size={20} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="quem-somos"
          options={{
            title: 'Quem Somos',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "information-circle" : "information-circle-outline"} size={20} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="tutorial"
          options={{
            title: 'Tutorial',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "play-circle" : "play-circle-outline"} size={20} color={color} />
            ),
          }}
        />

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
    backgroundColor: '#8DC4A6', // verde menta original
    paddingTop: 40, 
    paddingBottom: 10, // deixei mais fina
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15, 
    alignItems: 'center' 
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  
  // tamanho focado apenas na logo, sem esticar a barra verde
  logoImage: { 
    width: 150, 
    height: 45,
  },
  
  authButtons: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authText: { color: '#FFF', fontWeight: '500', fontSize: 14 },
  dividerSign: { color: '#FFF', fontSize: 13, opacity: 0.7 },
  
  tabBar: { 
    height: 75, 
    backgroundColor: '#FFF', 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0', 
    paddingBottom: 12,
    paddingTop: 8
  }
});