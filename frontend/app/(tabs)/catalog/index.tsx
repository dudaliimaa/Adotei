import { View, Text, StyleSheet } from 'react-native';

export default function CatalogScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🐾 Catálogo</Text>
      <Text style={styles.sub}>TASK-014 — a implementar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#E87722' },
  sub: { fontSize: 14, color: '#888', marginTop: 8 },
});