import { Event } from '@/types/event';

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Wild in Groningen',
    description: 'Tripje naar Groningen vol gezelligheid en activiteiten. Een geweldige kans om de prachtige stad Groningen te ontdekken samen met andere studenten. We gaan verschillende bezienswaardigheden bezoeken, lokale specialiteiten proeven en genieten van de unieke sfeer van deze studentenstad. Een onvergetelijk weekend vol nieuwe ervaringen en vriendschappen.',
    shortDescription: 'Tripje naar Groningen vol gezelligheid en activiteiten',
    date: '2025-11-21',
    time: '16:00',
    location: 'Groningen',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    category: 'tripje',
    price: 125,
    maxParticipants: 30,
    currentParticipants: 21,
    organizer: 'Fermi Vereniging',
    tags: ['groningen', 'tripje', 'gezelligheid', 'weekend']
  },
  {
    id: '12',
    title: 'ALV (Algemene Ledenvergadering)',
    description: 'De jaarlijkse Algemene Ledenvergadering van Fermi Vereniging. Kom en hoor wat er het afgelopen jaar is gebeurd, wat de plannen zijn voor het komende jaar, en breng je stem uit over belangrijke verenigingszaken. Na afloop is er een gezellige borrel.',
    shortDescription: 'Jaarlijkse Algemene Ledenvergadering',
    date: '2025-09-23',
    time: '19:00',
    location: 'Universiteit Utrecht',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
    category: 'educatief',
    price: 0,
    maxParticipants: 100,
    currentParticipants: 45,
    organizer: 'Fermi Vereniging',
    tags: ['alv', 'vergadering', 'vereniging', 'bestuur']
  },
  {
    id: '13',
    title: 'Impuls Cursus',
    description: 'Een intensieve cursus om je vaardigheden te verbeteren en nieuwe kennis op te doen. Perfect voor studenten die zich verder willen ontwikkelen op academisch en persoonlijk vlak. De cursus wordt gegeven door ervaren docenten en professionals uit het vakgebied.',
    shortDescription: 'Intensieve cursus voor persoonlijke ontwikkeling',
    date: '2025-10-12',
    time: '10:00',
    location: 'Universiteit Utrecht',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
    category: 'educatief',
    price: 25,
    maxParticipants: 40,
    currentParticipants: 28,
    organizer: 'Fermi Vereniging',
    tags: ['cursus', 'ontwikkeling', 'leren', 'vaardigheden']
  },
  {
    id: '14',
    title: 'Lezing: Toekomst van de Wetenschap',
    description: 'Een boeiende lezing over de toekomst van wetenschappelijk onderzoek en technologische ontwikkelingen. Gerenommeerde sprekers delen hun visie op wat ons te wachten staat in de komende decennia. Een must voor iedereen die geïnteresseerd is in wetenschap en innovatie.',
    shortDescription: 'Inspirerende lezing over wetenschappelijke ontwikkelingen',
    date: '2025-10-14',
    time: '20:00',
    location: 'Universiteit Utrecht',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    category: 'educatief',
    price: 5,
    maxParticipants: 150,
    currentParticipants: 87,
    organizer: 'Fermi Vereniging',
    tags: ['lezing', 'wetenschap', 'toekomst', 'innovatie']
  }
];

export const CATEGORY_COLORS = {
  educatief: '#8B5CF6',
  sociaal: '#F59E0B',
  tripje: '#10B981',
  sport: '#FF6B6B',
  cultuur: '#4ECDC4',
  muziek: '#45B7D1',
  workshop: '#96CEB4',
  netwerk: '#FFEAA7',
  eten: '#DDA0DD'
};

export const CATEGORY_LABELS = {
  educatief: 'Educatief',
  sociaal: 'Sociaal',
  tripje: 'Tripje',
  sport: 'Sport',
  cultuur: 'Cultuur',
  muziek: 'Muziek',
  workshop: 'Workshop',
  netwerk: 'Netwerk',
  eten: 'Eten & Drinken'
};
