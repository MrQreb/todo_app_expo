import { Pressable, StyleSheet, Text, View } from "react-native";

export const SelectStatus = () => {
    return (
        <View style={styles.container}>
            <Text>Hola</Text>
            <Pressable style={styles.button}>
                <Text>Hola</Text>
            </Pressable>
            <Pressable style={styles.button}></Pressable>
        </View>
    )
};

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        gap: 8
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#6C63FF',
    },
});


