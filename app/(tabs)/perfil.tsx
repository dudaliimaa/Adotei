import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PerfilScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Avatar Placeholder */}
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={100} color="#8DC4A6" />
          <Text style={styles.userName}>Nome do Usuário</Text>
          <Text style={styles.userEmail}>usuario@email.com</Text>
        </View>

        {/* Informações/Opções */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={22} color="#718096" />
            <Text style={styles.infoText}>Baixada Santista, SP</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={22} color="#718096" />
            <Text style={styles.infoText}>(13) 99999-9999</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF9' },
  content: { flex: 1, padding: 20, alignItems: 'center', paddingTop: 40 },
  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#2D3748', marginTop: 10 },
  userEmail: { fontSize: 14, color: '#718096', marginTop: 4 },
  infoSection: { width: '100%', backgroundColor: '#FFF', borderRadius: 15, padding: 15, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 30 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 10 },
  infoText: { fontSize: 16, color: '#4A5568' },
  logoutButton: { flexDirection: 'row', backgroundColor: '#E53E3E', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center' },
  logoutText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});