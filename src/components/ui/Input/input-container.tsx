import React from 'react';
import { StyleSheet, useColorScheme, View, ViewProps } from 'react-native';

interface InputContainerProps extends ViewProps {
  children: React.ReactNode;
}

export function InputContainer({ children, style, ...props }: InputContainerProps) {
  const dark = useColorScheme() === 'dark';

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: dark ? '#1e1e1e' : '#fff',
          borderTopColor: dark ? '#333' : '#eee',
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
  },
});