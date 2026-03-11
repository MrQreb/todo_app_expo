import React from 'react';
import { StyleSheet, TextInput, TextInputProps, useColorScheme } from 'react-native';

export function InputField({ style, ...props }: TextInputProps) {
  const dark = useColorScheme() === 'dark';

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: dark ? '#2a2a2a' : '#f0f0f0',
          color: dark ? '#fff' : '#222',
        },
        style,
      ]}
      placeholderTextColor={dark ? '#666' : '#999'}
      returnKeyType="done"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});