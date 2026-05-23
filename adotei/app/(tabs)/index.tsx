import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Transforme vidas: adote ou doe um amigo 💚</Text>
        <Text style={styles.heroSubtitle}>Conectando corações e lares felizes.</Text>
      </View>

      <View style={styles.gridContainer}>
        <Text style={styles.sectionTitle}>Pets disponíveis para adoção</Text>
        <View style={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF9' },
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
  imagePlaceholder: { width: '100%', height: 120, backgroundColor: '#F7FAFC', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  textPlaceholder: { height: 12, backgroundColor: '#EDF2F7', borderRadius: 6, marginTop: 10, width: '80%' },
});