import { Linking, Alert } from 'react-native';

/**
 * Abre o WhatsApp nativo do celular com um número e mensagem predefinidos
 */
export const enviarMensagemWhats = (telefone: string, mensagem: string) => {
  if (!telefone) {
    Alert.alert("Erro", "Número de telefone não encontrado.");
    return;
  }

  // Remove caracteres especiais do número para o link da API funcionar
  const numeroLimpo = telefone.replace(/[^\d]/g, "");
  const url = `whatsapp://send?phone=55${numeroLimpo}&text=${encodeURIComponent(mensagem)}`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        // Alternativa caso o app do WhatsApp não esteja instalado (abre no navegador)
        return Linking.openURL(`https://api.whatsapp.com/send?phone=55${numeroLimpo}&text=${encodeURIComponent(mensagem)}`);
      }
    })
    .catch(() => Alert.alert("Erro", "Não foi possível abrir o WhatsApp."));
};