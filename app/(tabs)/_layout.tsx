import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Importações essenciais para o cabeçalho e layout funcionar
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      
      {/* SEU CABEÇALHO VERDE (DE VOLTA!) */}
      <View style={styles.headerVerde}>
        <View style={styles.logoGroup}>
          <Image 
            source={require('../../assets/logo-adotei.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
        </View>

        <View style={styles.linksGroup}>
          {/* Usamos o caminho absoluto /(auth)/ para não ter erro de rota */}
          <TouchableOpacity style={{ padding: 10 }} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.linkTextInline}>entrar</Text>
          </TouchableOpacity>
          
          <Text style={styles.divisorText}>|</Text>
          
          <TouchableOpacity style={{ padding: 10 }} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.linkTextInline}>cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONFIGURAÇÃO DAS ABAS COM ÍCONES */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#8DC4A6',
          tabBarInactiveTintColor: '#A0AEC0',
          tabBarStyle: {
            backgroundColor: '#FFF',
            height: 60,
            borderTopWidth: 1,
            borderTopColor: '#E2E8F0',
          },
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'Home', 
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> 
          }} 
        />
        <Tabs.Screen 
          name="adotar" 
          options={{ 
            title: 'Adotar', 
            tabBarIcon: ({ color, size }) => <Ionicons name="paw" size={size} color={color} /> 
          }} 
        />
        <Tabs.Screen 
          name="doar" 
          options={{ 
            title: 'Doar', 
            tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} /> 
          }} 
        />
        <Tabs.Screen 
          name="ongs" 
          options={{ 
            title: 'ONGs', 
            tabBarIcon: ({ color, size }) => <Ionicons name="business" size={size} color={color} /> 
          }} 
        />
        <Tabs.Screen 
          name="tutorial" 
          options={{ 
            title: 'Tutorial', 
            tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" size={size} color={color} /> 
          }} 
        />
        <Tabs.Screen 
          name="quem-somos" 
          options={{ 
            title: 'Quem Somos', 
            tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> 
          }} 
        />
        <Tabs.Screen 
          name="perfil" 
          options={{ 
            title: 'Perfil', 
            tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> 
          }} 
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF9' },
  headerVerde: { 
    backgroundColor: '#8DC4A6', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    height: 90, // Aumentei um pouco para caber melhor a logo
    paddingTop: 10
  },
  logoGroup: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 110, height: 50 },
  linksGroup: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  linkTextInline: { color: '#FFF', fontSize: 16, fontWeight: 'bold', textTransform: 'lowercase' },
  divisorText: { color: '#FFF', fontSize: 16, opacity: 0.9, fontWeight: 'bold' }
});