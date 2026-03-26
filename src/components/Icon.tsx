import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export const MaterialIcons: React.FC<IconProps> = ({ name, size = 24, color = '#000' }) => {
  const iconMap: Record<string, string> = {
    'note': '📝',
    'add-circle': '➕',
    'settings': '⚙️',
  };

  const iconChar = iconMap[name] || '•';

  return (
    <Text style={[styles.icon, { fontSize: size, color }]}>
      {iconChar}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
