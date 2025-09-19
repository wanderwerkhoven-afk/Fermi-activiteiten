import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, MapPin, Users, Clock } from 'lucide-react-native';
import { Event } from '@/types/event';
import { CATEGORY_COLORS } from '@/constants/events';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export default function EventCard({ event, onPress }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const categoryColor = CATEGORY_COLORS[event.category];
  const spotsLeft = event.maxParticipants - event.currentParticipants;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.card}>
        <Image source={{ uri: event.imageUrl }} style={styles.image} />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        />
        
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{event.category.toUpperCase()}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{event.shortDescription}</Text>
          
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Calendar size={16} color="#666" />
              <Text style={styles.detailText}>{formatDate(event.date)}</Text>
              <Clock size={16} color="#666" style={styles.detailIcon} />
              <Text style={styles.detailText}>{event.time}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={16} color="#666" />
              <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
            </View>
            
            <View style={styles.bottomRow}>
              <View style={styles.detailRow}>
                <Users size={16} color="#666" />
                <Text style={styles.detailText}>
                  {event.currentParticipants}/{event.maxParticipants}
                </Text>
              </View>
              
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  {event.price === 0 ? 'Gratis' : `€${event.price}`}
                </Text>
                {spotsLeft <= 5 && spotsLeft > 0 && (
                  <Text style={styles.spotsLeft}>Nog {spotsLeft} plekken</Text>
                )}
                {spotsLeft === 0 && (
                  <Text style={styles.soldOut}>Uitverkocht</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailIcon: {
    marginLeft: 12,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  spotsLeft: {
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: '500',
  },
  soldOut: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '500',
  },
});
