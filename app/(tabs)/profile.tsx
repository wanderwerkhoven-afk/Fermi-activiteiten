import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Calendar, MapPin, Clock, X } from 'lucide-react-native';
import { useUserRegistrations, useEvents } from '@/hooks/events-store';

export default function ProfileScreen() {
  const userRegistrations = useUserRegistrations();
  const { cancelRegistration } = useEvents();
  const insets = useSafeAreaInsets();

  const handleCancelRegistration = (registrationId: string) => {
    cancelRegistration(registrationId);
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Profiel',
          headerStyle: { backgroundColor: '#2563eb' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={['#2563eb', '#3b82f6']}
          style={styles.header}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <User size={32} color="white" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Gebruiker</Text>
              <Text style={styles.userEmail}>gebruiker@email.com</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mijn Inschrijvingen</Text>
            <Text style={styles.sectionSubtitle}>
              {userRegistrations.length} evenement{userRegistrations.length !== 1 ? 'en' : ''}
            </Text>
          </View>

          {userRegistrations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Calendar size={48} color="#ccc" />
              <Text style={styles.emptyTitle}>Geen inschrijvingen</Text>
              <Text style={styles.emptyText}>
                Je hebt je nog niet ingeschreven voor evenementen
              </Text>
            </View>
          ) : (
            userRegistrations.map(({ registration, event }) => (
              <View key={registration.id} style={styles.registrationCard}>
                <TouchableOpacity 
                  style={styles.cardContent}
                  onPress={() => handleEventPress(event!.id)}
                >
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle} numberOfLines={2}>
                      {event!.title}
                    </Text>
                    
                    <View style={styles.eventDetails}>
                      <View style={styles.detailRow}>
                        <Calendar size={14} color="#666" />
                        <Text style={styles.detailText}>
                          {formatDate(event!.date)} om {event!.time}
                        </Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <MapPin size={14} color="#666" />
                        <Text style={styles.detailText} numberOfLines={1}>
                          {event!.location}
                        </Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <Clock size={14} color="#666" />
                        <Text style={styles.detailText}>
                          Ingeschreven op {new Date(registration.registrationDate).toLocaleDateString('nl-NL')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelRegistration(registration.id)}
                >
                  <X size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingTop: 20, paddingBottom: 24, paddingHorizontal: 16 },
  profileInfo: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: '700', color: 'white', marginBottom: 4 },
  userEmail: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  content: { flex: 1 },
  section: { paddingHorizontal: 16, paddingVertical: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: '#666' },
  emptyContainer: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  registrationCard: {
    backgroundColor: 'white', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 12, flexDirection: 'row',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  cardContent: { flex: 1, padding: 16 },
  eventInfo: { gap: 8 },
  eventTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  eventDetails: { gap: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 13, color: '#666', flex: 1 },
  cancelButton: { padding: 16, justifyContent: 'center', alignItems: 'center' },
  bottomSpacing: { height: 32 },
});

