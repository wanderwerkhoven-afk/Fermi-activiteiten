import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CalendarView from '@/components/CalendarView';
import EventCard from '@/components/EventCard';
import { useEventsByMonth } from '@/hooks/events-store';

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const insets = useSafeAreaInsets();
  
  const monthEvents = useEventsByMonth(currentDate.getFullYear(), currentDate.getMonth());

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long'
    });
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('nl-NL', { 
      month: 'long',
      year: 'numeric'
    });
  };

  const groupEventsByDate = () => {
    const grouped: { [key: string]: typeof monthEvents } = {};
    monthEvents.forEach(event => {
      if (!grouped[event.date]) {
        grouped[event.date] = [];
      }
      grouped[event.date].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate();
  const eventDates = Object.keys(groupedEvents).sort();

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Kalender',
          headerStyle: { backgroundColor: '#2563eb' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <CalendarView 
            onDateSelect={() => {}} 
            currentDate={currentDate}
            onMonthChange={setCurrentDate}
          />

          <View style={styles.monthEventsSection}>
            <Text style={styles.monthTitle}>
              Evenementen in {formatMonthYear()}
            </Text>
            
            {monthEvents.length === 0 ? (
              <View style={styles.noEventsContainer}>
                <Text style={styles.noEventsText}>
                  Geen evenementen deze maand
                </Text>
              </View>
            ) : (
              <View style={styles.eventsContainer}>
                <Text style={styles.eventsCount}>
                  {monthEvents.length} evenement{monthEvents.length !== 1 ? 'en' : ''} deze maand
                </Text>
                
                {eventDates.map(date => (
                  <View key={date} style={styles.dateGroup}>
                    <View style={styles.dateHeader}>
                      <Text style={styles.dateHeaderText}>
                        {formatEventDate(date)}
                      </Text>
                      <View style={styles.dateHeaderLine} />
                    </View>
                    
                    <View style={styles.dateEvents}>
                      {groupedEvents[date].map(event => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onPress={() => handleEventPress(event.id)}
                        />
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

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
  monthEventsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    textTransform: 'capitalize',
    marginRight: 12,
  },
  dateHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dateEvents: {
    gap: 8,
  },
  noEventsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noEventsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  eventsContainer: {
    gap: 8,
  },
  eventsCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  bottomSpacing: {
    height: 32,
  },
});

