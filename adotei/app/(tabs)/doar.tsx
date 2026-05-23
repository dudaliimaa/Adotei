import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, StyleSheet, Alert, Switch } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/config/firebase';
import * as ImagePicker from 'expo-image-picker';
import { petSchema, PetFormValues } from '../../src/schemas/pet.schema';
import { createPet } from '../../src/services/pets.service';
import { useAuthStore } from '../../src/stores/auth.store';
import { LoadingOverlay } from '../../src/components/ui/LoadingOverlay';
import { User, SPECIES_LABEL, SEX_LABEL, SIZE_LABEL, FUR_LENGTH_LABEL, PetSpecies, PetSex, PetSize, FurLength } from '../../src/types';

export default function NewPetScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [hasCpf, setHasCpf] = useState(true);
  const [checkingCpf, setCheckingCpf] = useState(true);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.uid))
      .then((snap) => {
        if (snap.exists()) {
          const profile = snap.data() as User;
          setHasCpf(!!profile.cpf);
        }
      })
      .finally(() => setCheckingCpf(false));
  }, [user]);

  const { control, handleSubmit, formState: { errors } } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: { neutered: false, furColor: null, meetingLocation: {} },
  });

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) { setImageUri(result.assets[0].uri); }
  }

  async function onSubmit(data: PetFormValues) {
    if (!imageUri) {
      Alert.alert('Foto obrigatória', 'Selecione uma foto.');
      return;
    }
    if (!user) return;
    setLoading(true);
    try {
      await createPet(data, imageUri, user.uid);
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível cadastrar o pet.');
    } finally { setLoading(false); }
  }

  if (checkingCpf) return <LoadingOverlay />;
  if (!hasCpf) {
    return (
      <View style={styles.centeredBlock}>
        <Text style={styles.blockTitle}>CPF obrigatório</Text>
        <Text style={styles.blockText}>Você precisa ter um CPF cadastrado para doar.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.photoPreview} /> : <Text style={styles.photoButtonText}>+ Adicionar foto</Text>}
      </TouchableOpacity>

      <Field label="Nome" error={errors.name?.message}>
        <Controller control={control} name="name" render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} onChangeText={onChange} value={value} placeholder="Nome do pet" />
        )} />
      </Field>

      <Field label="Espécie" error={errors.species?.message}>
        <Controller control={control} name="species" render={({ field: { onChange, value } }) => (
          <OptionGroup options={Object.entries(SPECIES_LABEL) as [PetSpecies, string][]} value={value} onChange={onChange} />
        )} />
      </Field>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit(onSubmit)} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Cadastrar Pet</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

function OptionGroup<T extends string>({ options, value, onChange }: { options: [T, string][]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={styles.optionGroup}>
      {options.map(([key, label]) => (
        <TouchableOpacity key={key} style={[styles.option, value === key && styles.optionSelected]} onPress={() => onChange(key)}>
          <Text style={[styles.optionText, value === key && styles.optionTextSelected]}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff' },
  photoButton: { width: '100%', height: 180, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginBottom: 20, backgroundColor: '#fafafa' },
  photoPreview: { width: '100%', height: '100%', borderRadius: 12 },
  photoButtonText: { color: '#999', fontSize: 16 },
  label: { fontSize: 13, fontWeight: '500', color: '#555', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fafafa' },
  error: { color: '#e53e3e', fontSize: 12, marginTop: 4 },
  optionGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fafafa' },
  optionSelected: { borderColor: '#8DC4A6', backgroundColor: '#D9EDE2' },
  optionText: { fontSize: 13, color: '#555' },
  optionTextSelected: { color: '#8DC4A6', fontWeight: '600' },
  submitBtn: { backgroundColor: '#8DC4A6', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 15 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  centeredBlock: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  blockTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  blockText: { color: '#666', textAlign: 'center' }
});