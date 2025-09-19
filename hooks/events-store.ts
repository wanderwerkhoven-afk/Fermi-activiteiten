import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event, Registration } from '@/types/event';
import { MOCK_EVENTS } from '@/constants/events';

/** ---------- Storage layer (AsyncStorage + web fallback) ---------- */
const storage = {
  getItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        const raw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
        return raw ?? null;
      }
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch {}
  },
  removeItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') window.localStorage.removeItem(key);
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch {}
  },
};

const getStoredData = async <T,>(key: string): Promise<T | null> => {
  try {
    const stored = await storage.getItem(key);
    if (!stored || stored === 'undefined' || stored === 'null') return null;
    const trimmed = stored.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      console.warn(`Invalid JSON for key ${key}, clearing.`);
      await storage.removeItem(key);
      return null;
    }
    return JSON.parse(trimmed);
  } catch (error) {
    console.warn(`Failed to parse stored data for key ${key}:`, error);
    await storage.removeItem(key);
    return null;
  }
};

const setStoredData = async (key: string, data: any) => {
  try {
    if (data === undefined || data === null) {
      await storage.removeItem(key);
      return;
    }
    const jsonString = JSON.stringify(data);
    await storage.setItem(key, jsonString);
  } catch (error) {
    console.warn(`Failed to store data for key ${key}:`, error);
  }
};

export const [EventsProvider, useEvents] = createContextHook(() => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const queryClient = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      console.log('Loading events...');
      const stored = await getStoredData<Event[]>('events');
      const result = stored || MOCK_EVENTS;
      console.log('Events loaded:', result.length, 'events');
      return result;
    }
  });

  const registrationsQuery = useQuery({
    queryKey: ['registrations'],
    queryFn: async () => {
      const stored = await getStoredData<Registration[]>('registrations');
      return stored || [];
    }
  });

  const saveEventsMutation = useMutation({
    mutationFn: async (events: Event[]) => {
      if (!events || !Array.isArray(events)) {
        throw new Error('Invalid events data');
      }
      await setStoredData('events', events);
      return events;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  const saveRegistrationsMutation = useMutation({
    mutationFn: async (registrations: Registration[]) => {
      if (!registrations || !Array.isArray(registrations)) {
        throw new Error('Invalid registrations data');
      }
      await setStoredData('registrations', registrations);
      return registrations;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    }
  });

  const { mutate: mutateEvents } = saveEventsMutation;
  const { mutate: mutateRegistrations } = saveRegistrationsMutation;

  useEffect(() => {
    if (eventsQuery.data) {
      console.log('Setting events in state:', eventsQuery.data.length);
      setEvents(eventsQuery.data);
    }
  }, [eventsQuery.data]);

  useEffect(() => {
    if (registrationsQuery.data) {
      setRegistrations(registrationsQuery.data);
    }
  }, [registrationsQuery.data]);

  const registerForEvent = useCallback((eventId: string, userName: string, userEmail: string) => {
    const newRegistration: Registration = {
      id: Date.now().toString(),
      eventId,
      userName,
      userEmail,
      registrationDate: new Date().toISOString(),
      status: 'confirmed'
    };

    const updatedRegistrations = [...registrations, newRegistration];
    setRegistrations(updatedRegistrations);
    mutateRegistrations(updatedRegistrations);

    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, currentParticipants: event.currentParticipants + 1 }
        : event
    );
    setEvents(updatedEvents);
    mutateEvents(updatedEvents);
  }, [events, registrations, mutateEvents, mutateRegistrations]);

  const cancelRegistration = useCallback((registrationId: string) => {
    const registration = registrations.find(r => r.id === registrationId);
    if (!registration) return;

    const updatedRegistrations = registrations.filter(r => r.id !== registrationId);
    setRegistrations(updatedRegistrations);
    mutateRegistrations(updatedRegistrations);

    const updatedEvents = events.map(event => 
      event.id === registration.eventId 
        ? { ...event, currentParticipants: Math.max(0, event.currentParticipants - 1) }
        : event
    );
    setEvents(updatedEvents);
    mutateEvents(updatedEvents);
  }, [events, registrations, mutateEvents, mutateRegistrations]);

  const isRegisteredForEvent = useCallback((eventId: string) => {
    return registrations.some(r => r.eventId === eventId && r.status === 'confirmed');
  }, [registrations]);

  return useMemo(() => ({
    events,
    registrations,
    registerForEvent,
    cancelRegistration,
    isRegisteredForEvent,
    isLoading: eventsQuery.isLoading || registrationsQuery.isLoading
  }), [events, registrations, registerForEvent, cancelRegistration, isRegisteredForEvent, eventsQuery.isLoading, registrationsQuery.isLoading]);
});

export const useUpcomingEvents = () => {
  const { events } = useEvents();
  
  console.log('useUpcomingEvents - events:', events.length);
  
  // For now, return all events to make them visible
  // We can add date filtering back later
  const sorted = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  console.log('Returning all events:', sorted.length);
  return sorted;
};

export const useEventsByDate = (date: string) => {
  const { events } = useEvents();
  return events.filter(event => event.date === date);
};

export const useEventsByMonth = (year: number, month: number) => {
  const { events } = useEvents();
  
  return events
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const useUserRegistrations = () => {
  const { registrations, events } = useEvents();
  
  return registrations
    .filter(r => r.status === 'confirmed')
    .map(registration => {
      const event = events.find(e => e.id === registration.eventId);
      return { registration, event };
    })
    .filter(item => item.event);
};
