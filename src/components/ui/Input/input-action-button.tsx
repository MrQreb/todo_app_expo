import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface InputActionButtonProps extends TouchableOpacityProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconSize?: number;
}

export function InputActionButton({
  iconName = 'add',
  iconColor = '#fff',
  iconSize = 28,
  style,
  ...props
}: InputActionButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Ionicons name={iconName} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6C63FF',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});