import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  TextInput,
  Platform,
  Modal
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Tag,
  ArrowLeft,
  User,
  Mail
} from 'lucide-react-native';
import { useEvents } from '@/hooks/events-store';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/constants/events';
import * as Haptics from 'expo-haptics';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const { events, registerForEvent, isRegisteredForEvent } = useEvents();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const insets = useSafeAreaInsets();

  const event = events.find(e => e.id === id);
  const isRegistered = event ? isRegisteredForEvent(event.id) : false;

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Evenement niet gevonden</Text>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const categoryColor = CATEGORY_COLORS[event.category];
  const spotsLeft = event.maxParticipants - event.currentParticipants;
  const isSoldOut = spotsLeft <= 0;

  const showAlert = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  const handleRegistration = () => {
    if (isRegistered) {
      showAlert('Al ingeschreven', 'Je bent al ingeschreven voor dit evenement');
      return;
    }

    if (isSoldOut) {
      showAlert('Uitverkocht', 'Dit evenement is helaas uitverkocht');
      return;
    }

    setShowRegistrationForm(true);
  };

  const submitRegistration = () => {
    if (!userName.trim() || !userEmail.trim()) {
      showAlert('Fout', 'Vul alle velden in');
      return;
    }

    if (!userEmail.includes('@')) {
      showAlert('Fout', 'Voer een geldig e-mailadres in');
      return;
    }

    registerForEvent(event.id, userName.trim(), userEmail.trim());
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setModalTitle('Inschrijving gelukt!');
    setModalMessage(`Je bent succesvol ingeschreven voor ${event.title}`);
    setShowModal(true);
    setShowRegistrationForm(false);
    setUserName('');
    setUserEmail('');
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />
      
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: event.imageUrl }} style={styles.image} />
            
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageOverlay}
            />
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
              <Text style={styles.categoryText}>
                {CATEGORY_LABELS[event.category]}
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{event.title}</Text>
            
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Calendar size={20} color="#2563eb" />
                <Text style={styles.detailText}>
                  {formatDate(event.date)} om {event.time}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <MapPin size={20} color="#2563eb" />
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Users size={20} color="#2563eb" />
                <Text style={styles.detailText}>
                  {event.currentParticipants}/{event.maxParticipants} deelnemers
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Clock size={20} color="#2563eb" />
                <Text style={styles.detailText}>
                  Georganiseerd door {event.organizer}
                </Text>
              </View>
            </View>

            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Prijs</Text>
              <Text style={styles.price}>
                {event.price === 0 ? 'Gratis' : `€${event.price}`}
              </Text>
            </View>

            {spotsLeft <= 10 && spotsLeft > 0 && (
              <View style={styles.urgencyBanner}>
                <Text style={styles.urgencyText}>
                  ⚡ Nog maar {spotsLeft} plekken beschikbaar!
                </Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Beschrijving</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {event.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Tag size={12} color="#666" />
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>

            {!showRegistrationForm ? (
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  (isRegistered || isSoldOut) && styles.disabledButton
                ]}
                onPress={handleRegistration}
                disabled={isRegistered || isSoldOut}
              >
                <Text style={[
                  styles.registerButtonText,
                  (isRegistered || isSoldOut) && styles.disabledButtonText
                ]}>
                  {isRegistered ? 'Al ingeschreven' : 
                   isSoldOut ? 'Uitverkocht' : 'Inschrijven'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.registrationForm}>
                <Text style={styles.formTitle}>Inschrijven voor {event.title}</Text>
                
                <View style={styles.inputContainer}>
                  <User size={20} color="#666" />
                  <TextInput
                    style={styles.input}
                    placeholder="Volledige naam"
                    value={userName}
                    onChangeText={setUserName}
                    autoCapitalize="words"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#666" />
                  <TextInput
                    style={styles.input}
                    placeholder="E-mailadres"
                    value={userEmail}
                    onChangeText={setUserEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                
                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowRegistrationForm(false)}
                  >
                    <Text style={styles.cancelButtonText}>Annuleren</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitRegistration}
                  >
                    <Text style={styles.submitButtonText}>Inschrijven</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
        
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <Text style={styles.modalMessage}>{modalMessage}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 50,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 32,
  },
  details: {
    gap: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
  },
  urgencyBanner: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  urgencyText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  registerButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#e5e7eb',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#9ca3af',
  },
  registrationForm: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingLeft: 8,
    color: '#1a1a1a',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#2563eb',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    minWidth: 280,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
