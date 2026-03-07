import { Priority, priorityEnum } from '@/src/db/schema';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = {
  selected: Priority;
  onSelect: (priority: Priority) => void;
};

type PriorityConfig = {
  label: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  low:    { label: 'Baja',    color: '#34C759', icon: 'arrow-down-circle-outline' },
  medium: { label: 'Media',   color: '#FF9F0A', icon: 'remove-circle-outline' },
  high:   { label: 'Alta',    color: '#FF3B30', icon: 'arrow-up-circle-outline' },
  urgent: { label: 'Urgente', color: '#BF5AF2', icon: 'alert-circle-outline' },
};

const PriorityChip = ({ priority, selected, onSelect }: {
  priority: Priority;
  selected: boolean;
  onSelect: () => void;
}) => {
  const dark = useColorScheme() === 'dark';
  const { label, color, icon } = PRIORITY_CONFIG[priority];
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    onSelect();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[
        styles.chip,
        animStyle,
        {
          borderColor: color,
          backgroundColor: selected
            ? color
            : dark ? `${color}22` : `${color}15`,
        },
      ]}>
        <Ionicons
          name={selected ? icon.replace('-outline', '') as any : icon}
          size={15}
          color={selected ? '#fff' : color}
        />
        <Text style={[styles.chipText, { color: selected ? '#fff' : color }]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const SelectPriority = ({ selected, onSelect }: Props) => {
  const dark = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: dark ? '#aaa' : '#888' }]}>
        Prioridad
      </Text>
      <View style={styles.row}>
        {priorityEnum.map((priority) => (
          <PriorityChip
            key={priority}
            priority={priority}
            selected={selected === priority}
            onSelect={() => onSelect(priority)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    gap: 5, paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: 20, borderWidth: 1.5,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
});