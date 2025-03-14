import ConfirmDialog from '@/components/ConfirmationDialog';
import React, { createContext, useContext, useState, ReactNode } from 'react';
;

interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  type?: 'danger' | 'default';
}

interface ConfirmDialogContextType {
  showConfirmDialog: (options: ConfirmDialogOptions) => void;
  hideConfirmDialog: () => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null);

export const ConfirmDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>({
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirmDialog = (dialogOptions: ConfirmDialogOptions) => {
    setOptions(dialogOptions);
    setVisible(true);
  };

  const hideConfirmDialog = () => {
    setVisible(false);
  };

  const handleConfirm = () => {
    options.onConfirm();
    hideConfirmDialog();
  };

  const handleCancel = () => {
    if (options.onCancel) {
      options.onCancel();
    }
    hideConfirmDialog();
  };

  return (
    <ConfirmDialogContext.Provider value={{ showConfirmDialog, hideConfirmDialog }}>
      {children}
      <ConfirmDialog
        visible={visible}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        type={options.type}
      />
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = (): ConfirmDialogContextType => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
  }
  return context;
};