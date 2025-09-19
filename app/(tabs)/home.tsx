import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { useUpcomingEvents, useEvents } from '@/hooks/events-store';
import EventCard from '@/components/EventCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Sparkles, Filter } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORY_COLORS } from '@/constants/events';

type CategoryFilter = 'all' | 'educatief' | 'sociaal' | 'tripje';

export default function HomeScreen() {
  const upcomingEvents = useUpcomingEvents();
  const { isLoading, events } = useEvents();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  
  console.log('HomeScreen render - isLoading:', isLoading, 'events count:', events.length, 'upcoming events:', upcomingEvents.length);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'all') {
      return upcomingEvents;
    }
    return upcomingEvents.filter(event => event.category === selectedCategory);
  }, [upcomingEvents, selectedCategory]);

  const categories: { key: CategoryFilter; label: string; color: string }[] = [
    { key: 'all', label: 'Alle', color: '#6B7280' },
    { key: 'educatief', label: 'Educatief', color: CATEGORY_COLORS.educatief },
    { key: 'sociaal', label: 'Sociaal', color: CATEGORY_COLORS.sociaal },
    { key: 'tripje', label: 'Tripjes', color: CATEGORY_COLORS.tripje },
  ];

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />
      
      <View style={styles.container}>
        <LinearGradient
          colors={['#1e40af', '#3b82f6', '#60a5fa']}
          style={[styles.heroSection, { paddingTop: insets.top + 40 }]}
        >
          <View style={styles.heroContent}>
            <View style={styles.logoContainer}>
              <Sparkles size={32} color="white" />
            </View>
            <Text style={styles.mainTitle}>Fermi Events</Text>
            <Text style={styles.subtitle}>
              Ontdek geweldige evenementen en activiteiten
            </Text>
            <View style={styles.tagline}>
              <Text style={styles.taglineText}>Jouw toegang tot de beste ervaringen</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#2563eb" />
            <Text style={styles.sectionTitle}>Aankomende Evenementen</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selectedCategory === category.key ? category.color : 'transparent',
                    borderColor: category.color,
                  }
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Text style={[
                  styles.filterButtonText,
                  {
                    color: selectedCategory === category.key ? 'white' : category.color,
                  }
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Evenementen laden...</Text>
            </View>
          ) : filteredEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Filter size={24} color="#9CA3AF" />
              <Text style={styles.emptyText}>
                {selectedCategory === 'all' 
                  ? 'Geen aankomende evenementen' 
                  : `Geen ${categories.find(c => c.key === selectedCategory)?.label.toLowerCase()} evenementen`
                }
              </Text>
            </View>
          ) : (
            filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => handleEventPress(event.id)}
              />
            ))
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  heroSection: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  heroContent: {
    alignItems: 'center',
    gap: 16,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  tagline: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  taglineText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 32,
  },
  filterContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 0,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

