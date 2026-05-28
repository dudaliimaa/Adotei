import { Linking, Alert, Platform } from 'react-native';

/**
 * Abre o aplicativo de mapas nativo do celular (Google Maps ou Apple Maps) baseado no endereço ou CEP
 */
export const abrirNoMapa = (enderecoOuCep: string) => {
  if (!enderecoOuCep) {
    Alert.alert("Erro", "Localização inválida para o mapa.");
    return;
  }

  const query = encodeURIComponent(enderecoOuCep);
  
  // Define o link correto dependendo se o celular é Android ou iPhone
  const url = Platform.select({
    ios: `maps:0,0?q=${query}`,
    android: `geo:0,0?q=${query}`,
    default: `https://www.google.com/maps/search/?api=1&query=${query}`
  });

  Linking.openURL(url).catch(() => {
    // Plano B: Se falhar o nativo, abre direto no navegador do celular
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  });
};