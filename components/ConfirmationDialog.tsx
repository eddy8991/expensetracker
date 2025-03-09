import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity } from 'react-native';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import Typo from '@/components/Typo';
import * as Icons from 'phosphor-react-native';
import { verticalScale } from '@/utils/styling';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'default';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'default',
}) => {
  if (!visible) return null;

  const confirmButtonStyle = type === 'danger' ? styles.dangerButton : styles.confirmButton;
  const confirmTextColor = type === 'danger' ? colors.white : colors.black;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Typo size={20} fontWeight="800" color={colors.text}>
              {title}
            </Typo>
            {type === 'danger' && (
              <Icons.Warning size={verticalScale(24)} color={colors.rose} weight="fill" />
            )}
          </View>
          
          <Typo color={colors.textLight} style={styles.message}>
            {message}
          </Typo>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Typo fontWeight="600" color={colors.textLight}>
                {cancelText}
              </Typo>
            </TouchableOpacity>
            
            <TouchableOpacity style={confirmButtonStyle} onPress={onConfirm}>
              <Typo fontWeight="600" color={confirmTextColor}>
                {confirmText}
              </Typo>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    padding: spacingY._20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._10,
  },
  message: {
    marginBottom: spacingY._20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._6,
    marginRight: spacingX._10,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._6,
  },
  dangerButton: {
    backgroundColor: colors.rose,
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._6,
  },
});

export default ConfirmDialog;