import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";


export type FilterStatus = 'completed' | 'pending' | 'all';

interface Props {
    activeFilter: FilterStatus | null;
    onPressCompleted: () => void;
    onPressInNotCompleted: () => void;
    onPressAll: () => void;
}

export const SelectStatus = ({ activeFilter, onPressCompleted, onPressInNotCompleted, onPressAll }: Props) => {
    return (
        <View style={styles.container}>

            <Text style={styles.textTitle}>Filtrar tareas</Text>

            <View style={styles.buttonsRow}>

                {/* Completed */}
                <Pressable
                    onPress={onPressCompleted}
                    style={[
                        styles.button,
                        activeFilter === 'completed' && styles.buttonActiveCompleted
                    ]}
                >
                    <Ionicons
                        name="checkmark-done"
                        size={16}
                        color={activeFilter === 'completed' ? '#fff' : '#10B981'}
                    />
                    <Text style={[
                        styles.buttonText,
                        activeFilter === 'completed' && styles.buttonTextActive
                    ]}>
                        Completadas
                    </Text>
                </Pressable>


                {/* Pendings */}
                <Pressable
                    onPress={onPressInNotCompleted}
                    style={[
                        styles.button,
                        activeFilter === 'pending' && styles.buttonActivePending
                    ]}
                >
                    <MaterialCommunityIcons
                        name="timer-sand"
                        size={16}
                        color={activeFilter === 'pending' ? '#fff' : '#F59E0B'}
                    />
                    <Text style={[
                        styles.buttonText,
                        activeFilter === 'pending' && styles.buttonTextActive
                    ]}>
                        Pendientes
                    </Text>
                </Pressable>

                {/* All */}
                <Pressable
                    onPress={onPressAll}
                    style={[
                        styles.button,
                        activeFilter === 'all' && styles.buttonActiveAll
                    ]}
                >
                    <Ionicons
                        name="apps"
                        size={16}
                        color={activeFilter === 'all' ? '#fff' : '#6C63FF'}
                    />
                    <Text style={[
                        styles.buttonText,
                        activeFilter === 'all' && styles.buttonTextActive
                    ]}>
                        Todas
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 10,
        paddingTop: 12,
        paddingLeft: 24,
    },
    textTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    buttonActiveCompleted: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    buttonActivePending: {
        backgroundColor: '#F59E0B',
        borderColor: '#F59E0B',
    },
    buttonText: {
        fontSize: 13,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.7)',
    },
    buttonTextActive: {
        color: '#fff',
        fontWeight: '700',
    },
    buttonActiveAll: {
        backgroundColor: '#6C63FF',
        borderColor: '#6C63FF',
    },

});