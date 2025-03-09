import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View, TouchableOpacity } from 'react-native';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import Typo from '@/components/Typo';
import * as Icons from 'phosphor-react-native';
import { verticalScale } from '@/utils/styling';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  if (!visible) return null;

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: colors.green, icon: 'CheckCircle' };
      case 'error':
        return { backgroundColor: colors.rose, icon: 'Warning' };
      case 'warning':
        return { backgroundColor: '#f59e0b', icon: 'Warning' };
      case 'info':
      default:
        return { backgroundColor: colors.primaryLight, icon: 'Info' };
    }
  };

  const toastStyle = getToastStyle();
  const Icon = Icons[toastStyle.icon as keyof typeof Icons];

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: toastStyle.backgroundColor },
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.content}>
        <Icons.CheckCircle
          size={verticalScale(20)}
          color={colors.white}
          weight="fill"
        />
        <Typo color={colors.white} style={styles.message}>
          {message}
        </Typo>
      </View>
      <TouchableOpacity onPress={hideToast}>
        <Icons.X
          size={verticalScale(20)}
          color={colors.white}
          weight="bold"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: verticalScale(40),
    left: spacingX._10,
    right: spacingX._10,
    backgroundColor: colors.neutral900,
    borderRadius: radius._10,
    padding: spacingY._15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    marginLeft: spacingX._10,
    fontSize: verticalScale(14),
    fontWeight: '500',
    flex: 1,
  },
});

export default Toast;