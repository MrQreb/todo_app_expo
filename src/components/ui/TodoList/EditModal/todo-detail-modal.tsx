import { Feather } from '@expo/vector-icons';
import { Todo } from '@src/db/schema';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import { useTodoDetail } from './hooks/useTodoDetail';

type Props = {
  todo: Todo | null;
  onClose: () => void;
};

const PRIORITY_CONFIG: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  high:   { color: '#FF4D4D', bg: 'rgba(255,77,77,0.12)',   label: 'Alta',   icon: 'arrow-up' },
  medium: { color: '#FFA500', bg: 'rgba(255,165,0,0.12)',   label: 'Media',  icon: 'minus' },
  low:    { color: '#34D399', bg: 'rgba(52,211,153,0.12)',  label: 'Baja',   icon: 'arrow-down' },
};

const PriorityBadge = ({ priority, isDark }: { priority?: string; isDark: boolean }) => {
  const cfg = priority ? (PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.low) : PRIORITY_CONFIG.low;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Feather name={cfg.icon as any} size={11} color={cfg.color} />
      <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
};

export const TodoDetailModal = ({ todo, onClose }: Props) => {
  const isDark = useColorScheme() === 'dark';
  const { editedTitle, setEditedTitle, saveTitle, isSaving } = useTodoDetail(todo);

  const bg      = isDark ? '#141414' : '#FAFAFA';
  const surface = isDark ? '#1F1F1F' : '#FFFFFF';
  const border  = isDark ? '#2A2A2A' : '#EBEBEB';
  const textPrimary   = isDark ? '#F0F0F0' : '#111111';
  const textSecondary = isDark ? '#666666' : '#AAAAAA';

  const handleClose = async () => {
    await saveTitle();
    onClose();
  };

  return (
    <Modal
      visible={!!todo}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Tap outside to close */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

        <View style={[styles.sheet, { backgroundColor: bg, borderColor: border }]}>

          {/* Handle bar */}
          <View style={[styles.handle, { backgroundColor: border }]} />

          {/* Header row */}
          <View style={styles.headerRow}>
            <Text style={[styles.label, { color: textSecondary }]}>TAREA</Text>
            <TouchableOpacity onPress={handleClose} style={[styles.closeIcon, { backgroundColor: surface }]}>
              <Feather name="x" size={16} color={textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Title input */}
          <TextInput
            style={[styles.titleInput, { color: textPrimary, borderBottomColor: border }]}
            value={editedTitle}
            onChangeText={setEditedTitle}
            onEndEditing={saveTitle}
            placeholder="Título del todo"
            placeholderTextColor={textSecondary}
            accessibilityLabel="Título editable"
            multiline
          />

          {/* Meta row */}
          <View style={styles.metaRow}>
            <PriorityBadge priority={todo?.priority} isDark={isDark} />

            <View style={[styles.datePill, { backgroundColor: surface, borderColor: border }]}>
              <Feather name="calendar" size={11} color={textSecondary} />
              <Text style={[styles.dateText, { color: textSecondary }]}>
                {todo?.createdAt?.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: border }]} />

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleClose}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel="Guardar y cerrar"
          >
            {isSaving
              ? <Feather name="loader" size={18} color="#fff" />
              : <>
                  <Feather name="check" size={16} color="#fff" />
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </>
            }
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 24,
    paddingTop: 12,
    gap: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  closeIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 12,
  },
  divider: {
    height: 1,
  },
  saveButton: {
    backgroundColor: '#111',
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});