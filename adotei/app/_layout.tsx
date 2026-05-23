import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Direciona automaticamente para as abas principais */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}