import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { COLORS } from '../../theme/colors';

interface AvatarProps {
  name: string;
  source?: string | null;
  size?: number;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  imageStyle?: ImageStyle;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  source,
  size = 50,
  containerStyle,
  textStyle,
  imageStyle,
}) => {
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const containerSizeStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const fontSize = size * 0.4;

  if (source) {
    return (
      <View style={[styles.container, containerSizeStyle, containerStyle]}>
        <Image
          source={{ uri: source }}
          style={[styles.image, containerSizeStyle, imageStyle]}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.placeholder, containerSizeStyle, containerStyle]}>
      <Text style={[styles.initials, { fontSize }, textStyle]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    backgroundColor: COLORS.PRIMARY,
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    color: COLORS.WHITE,
    fontWeight: '800',
  },
});

export default Avatar;
