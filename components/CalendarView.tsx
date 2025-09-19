import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useEventsByDate } from '@/hooks/events-store';

interface CalendarViewProps {
  onDateSelect: (date: string) => void;
  selectedDate?: string;
  currentDate?: Date;
  onMonthChange?: (date: Date) => void;
}

export default function CalendarView({ 
  onDateSelect, 
  selectedDate, 
  currentDate: propCurrentDate,
  onMonthChange 
}: CalendarViewProps) {
  const [internalCurrentDate, setInternalCurrentDate] = useState(new Date());
  const currentDate = propCurrentDate || internalCurrentDate;
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    
    if (onMonthChange) {
      onMonthChange(newDate);
    } else {
      setInternalCurrentDate(newDate);
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('nl-NL', { 
    month: 'long', 
    year: 'numeric' 
  });

  const DayCell = React.memo(function DayCell({ date, dateString }: { date: Date | null; dateString?: string }) {
    const eventsForDate = useEventsByDate(dateString || '');
    
    if (!date) {
      return <View style={styles.emptyDay} />;
    }

    const hasEvents = eventsForDate.length > 0;
    const isSelected = selectedDate === dateString;
    const isToday = formatDateString(new Date()) === dateString;

    return (
      <TouchableOpacity
        style={[
          styles.dayCell,
          isSelected && styles.selectedDay,
          isToday && styles.todayDay,
        ]}
        onPress={() => onDateSelect(dateString!)}
      >
        <Text style={[
          styles.dayText,
          isSelected && styles.selectedDayText,
          isToday && styles.todayDayText,
        ]}>
          {date.getDate()}
        </Text>
        {hasEvents && (
          <View style={[
            styles.eventDot,
            isSelected && styles.selectedEventDot
          ]}>
            <Text style={styles.eventCount}>{eventsForDate.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigateMonth('prev')}
        >
          <ChevronLeft size={24} color="#2563eb" />
        </TouchableOpacity>
        
        <Text style={styles.monthYear}>{monthYear}</Text>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigateMonth('next')}
        >
          <ChevronRight size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'].map(day => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>

      <View style={styles.calendar}>
        {days.map((date, index) => {
          const dateString = date ? formatDateString(date) : undefined;
          return (
            <DayCell 
              key={`${currentDate.getMonth()}-${currentDate.getFullYear()}-${index}`} 
              date={date} 
              dateString={dateString}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textTransform: 'capitalize',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    paddingVertical: 8,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDay: {
    width: '14.28%',
    height: 40,
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedDay: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  todayDay: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: '600',
  },
  todayDayText: {
    fontWeight: '600',
    color: '#2563eb',
  },
  eventDot: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  selectedEventDot: {
    backgroundColor: 'white',
  },
  eventCount: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
});
