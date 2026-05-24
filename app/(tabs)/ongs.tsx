import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OngsScreen() {
  // estado para o filtro de estado (UF)
  const [estadoSelecionado, setEstadoSelecionado] = useState('Todos');

  // Lista de estados para o filtro rápido
  const estadosDisponiveis = ['Todos', 'SP', 'RJ', 'MG', 'PR', 'SC'];

  // Banco de dados fake de ONGs com ações e divulgações gratuitas
  const [ongs, setOngs] = useState([
    {
      id: '1',
      nome: 'Anjos de Patas PG',
      uf: 'SP',
      cidade: 'Praia Grande',
      bairro: 'Aviação',
      logo: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=200&auto=format&fit=crop',
      descricao: 'Resgate, reabilitação e castração de animais abandonados na Baixada Santista.',
      telefone: '(13) 99999-8888',
      divulgacao: {
        titulo: 'Mutirão de Castração Gratuita 🐱',
        detalhes: 'Vagas limitadas para cães e gatos de famílias de baixa renda. Necessário cadastro prévio com RG e comprovante de residência.',
        data: '15/06/2026',
        local: 'Ginásio Magic Paula'
      }
    },
    {
      id: '2',
      nome: 'Adote um Gatinho',
      uf: 'SP',
      cidade: 'São Paulo',
      bairro: 'Vila Mariana',
      logo: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=200&auto=format&fit=crop',
      descricao: 'Focados em resgatar, cuidar e encontrar lares amorosos especificamente para felinos.',
      telefone: '(11) 98888-7777',
      divulgacao: {
        titulo: 'Campanha de Vacinação V4 💉',
        detalhes: 'Aplicação gratuita da vacina quádrupla felina para animais cadastrados no programa social da ONG.',
        data: '22/06/2026',
        local: 'Sede da ONG - Vila Mariana'
      }
    },
    {
      id: '3',
      nome: 'Patinhas de Luz',
      uf: 'RJ',
      cidade: 'Rio de Janeiro',
      bairro: 'Copacabana',
      logo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=200&auto=format&fit=crop',
      descricao: 'Abrigo que acolhe cães idosos e deficientes fornecendo tratamento e amor.',
      telefone: '(21) 97777-6666',
      divulgacao: {
        titulo: 'Feira de Adoção e Evento Educativo 🐕',
        detalhes: 'Distribuição gratuita de amostras de ração, orientações com veterinários sobre posse responsável e brincadeiras.',
        data: '07/06/2026',
        local: 'Praça do Lido'
      }
    }
  ]);

  // filtra as ONGs dependendo do estado clicado
  const ongsFiltradas = ongs.filter(ong => 
    estadoSelecionado === 'Todos' || ong.uf === estadoSelecionado
  );

  // abre o WhatsApp da ONG para contato direto
  const abrirWhats = (tel: string, nomeOng: string) => {
    const numeroLimpo = tel.replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá, conheci a ${nomeOng} pelo app Adotei e gostaria de mais informações!`);
    Linking.openURL(`https://wa.me/55${numeroLimpo}?text=${msg}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* Bloco institucional do topo */}
        <View style={styles.topCard}>
          <View style={styles.iconHomeCircle}>
            <Ionicons name="business" size={32} color="#8DC4A6" />
          </View>
          <Text style={styles.topCardTitle}>Conheça nossas ONGs parceiras</Text>
          <Text style={styles.topCardSubtitle}>
            Organizações dedicadas ao resgate, proteção e suporte a animais abandonados.
          </Text>
        </View>

        {/* seletor horizontal elegante de estados */}
        <Text style={styles.filterLabel}>Filtrar por Estado (UF):</Text>
        <View style={styles.filterWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {estadosDisponiveis.map((uf) => (
              <TouchableOpacity
                key={uf}
                style={[styles.ufBtn, estadoSelecionado === uf && styles.ufBtnActive]}
                onPress={() => setEstadoSelecionado(uf)}
              >
                <Text style={[styles.ufBtnText, estadoSelecionado === uf && styles.ufBtnTextActive]}>
                  {uf === 'Todos' ? 'Todos os Estados' : uf}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* listagem de ONGs filtradas */}
        <View style={styles.listSection}>
          {ongsFiltradas.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="alert-circle-outline" size={36} color="#CBD5E0" />
              <Text style={styles.emptyText}>Nenhuma ONG parceira cadastrada neste estado ainda.</Text>
            </View>
          ) : (
            ongsFiltradas.map((ong) => (
              <View key={ong.id} style={styles.ongCard}>
                
                {/* Cabeçalho da ONG: Logo e Local */}
                <View style={styles.ongMainInfo}>
                  <Image source={{ uri: ong.logo }} style={styles.ongLogo} />
                  <View style={styles.ongTextGroup}>
                    <Text style={styles.ongName}>{ong.nome}</Text>
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={14} color="#718096" />
                      <Text style={styles.locationText}>{ong.bairro} - {ong.cidade} ({ong.uf})</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.ongDesc}>{ong.descricao}</Text>

                {/* Caixa de Divulgação de Eventos Gratuitos */}
                <View style={styles.actionBox}>
                  <View style={styles.actionBadge}>
                    <Text style={styles.actionBadgeText}>AÇÃO GRATUITA</Text>
                  </View>
                  <Text style={styles.actionTitle}>{ong.divulgacao.titulo}</Text>
                  <Text style={styles.actionDetails}>{ong.divulgacao.detalhes}</Text>
                  
                  {/* Info de data e local do evento - CORRIGIDO SEM NUMBEROFLINES NA VIEW */}
                  <View style={styles.actionFooterRow}>
                    <View style={styles.actionInfoItem}>
                      <Ionicons name="calendar-outline" size={13} color="#4A5568" />
                      <Text style={styles.actionInfoText}>{ong.divulgacao.data}</Text>
                    </View>
                    <View style={[styles.actionInfoItem, { flex: 1, marginLeft: 15 }]}>
                      <Ionicons name="pin-outline" size={13} color="#4A5568" />
                      {/* numberOfLines movido corretamente para a tag Text */}
                      <Text style={styles.actionInfoText} numberOfLines={1}>{ong.divulgacao.local}</Text>
                    </View>
                  </View>
                </View>

                {/* Botão de contato direto */}
                <TouchableOpacity style={styles.btnContato} onPress={() => abrirWhats(ong.telefone, ong.nome)}>
                  <Ionicons name="logo-whatsapp" size={16} color="#FFF" />
                  <Text style={styles.btnContatoText}>Falar com a ONG</Text>
                </TouchableOpacity>

              </View>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFDF9' },
  scrollPadding: { paddingBottom: 30 },

  topCard: { backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', padding: 20, margin: 15, alignItems: 'center' },
  iconHomeCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F0F9F4', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  topCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3748', textAlign: 'center' },
  topCardSubtitle: { fontSize: 12, color: '#718096', textAlign: 'center', marginTop: 6, lineHeight: 18 },

  filterLabel: { fontSize: 13, fontWeight: 'bold', color: '#4A5568', marginHorizontal: 15, marginBottom: 8 },
  filterWrapper: { marginBottom: 15 },
  filterScroll: { paddingHorizontal: 15, gap: 8 },
  ufBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },
  ufBtnActive: { backgroundColor: '#8DC4A6', borderColor: '#8DC4A6' },
  ufBtnText: { fontSize: 13, color: '#718096', fontWeight: '500' },
  ufBtnTextActive: { color: '#FFF', fontWeight: 'bold' },

  listSection: { paddingHorizontal: 15 },
  ongCard: { backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 15 },
  ongMainInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ongLogo: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F7FAFC' },
  ongTextGroup: { flex: 1 },
  ongName: { fontSize: 15, fontWeight: 'bold', color: '#1A202C' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  locationText: { fontSize: 12, color: '#718096' },
  ongDesc: { fontSize: 13, color: '#4A5568', lineHeight: 18, marginVertical: 12 },

  actionBox: { backgroundColor: '#F0F9F4', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#C6F6D5', marginBottom: 12 },
  actionBadge: { backgroundColor: '#8DC4A6', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 6 },
  actionBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  actionTitle: { fontSize: 14, fontWeight: 'bold', color: '#22543D' },
  actionDetails: { fontSize: 12, color: '#2F855A', marginTop: 4, lineHeight: 16 },
  
  // CORRIGIDO: pt trocado por paddingTop para seguir o padrão correto
  actionFooterRow: { flexDirection: 'row', marginTop: 10, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#DEF7EC' },
  actionInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionInfoText: { fontSize: 11, color: '#4A5568' },

  btnContato: { backgroundColor: '#8DC4A6', height: 40, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnContatoText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

  emptyBox: { padding: 30, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { fontSize: 13, color: '#A0AEC0', textAlign: 'center' }
});