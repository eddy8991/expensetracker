import { FirebaseError } from 'firebase/app';

export type ErrorResponse = {
  message: string;
  code?: string;
};

// Convert Firebase error codes to user-friendly messages
export const handleFirebaseError = (error: unknown): ErrorResponse => {
  if (error instanceof FirebaseError) {
    const errorCode = error.code;
    
    // Authentication errors
    switch (errorCode) {
      // Authentication errors (existing code)
      case 'auth/invalid-email':
        return { 
          message: 'The email address is not valid',
          code: errorCode
        };
      case 'auth/user-disabled':
        return { 
          message: 'This account has been disabled',
          code: errorCode
        };
      case 'auth/user-not-found':
        return { 
          message: 'No account found with this email',
          code: errorCode
        };
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
      case 'auth/invalid-login-credentials':
        return { 
          message: 'Invalid email or password',
          code: errorCode
        };
      case 'auth/too-many-requests':
        return { 
          message: 'Too many attempts. Try again later',
          code: errorCode
        };
      case 'auth/email-already-in-use':
        return { 
          message: 'Email is already in use',
          code: errorCode
        };
      case 'auth/weak-password':
        return { 
          message: 'Password is too weak. Use at least 6 characters',
          code: errorCode
        };
      case 'auth/network-request-failed':
        return { 
          message: 'Network error. Check your connection',
          code: errorCode
        };
      
      // Firestore database errors
      case 'permission-denied':
        return {
          message: 'You don\'t have permission to perform this action',
          code: errorCode
        };
      case 'unavailable':
        return {
          message: 'The service is currently unavailable. Please try again later',
          code: errorCode
        };
      case 'not-found':
        return {
          message: 'The requested document was not found',
          code: errorCode
        };
      case 'already-exists':
        return {
          message: 'A document with this ID already exists',
          code: errorCode
        };
      case 'resource-exhausted':
        return {
          message: 'You\'ve reached the maximum allowed operations. Please try again later',
          code: errorCode
        };
      case 'cancelled':
        return {
          message: 'The operation was cancelled',
          code: errorCode
        };
      case 'data-loss':
        return {
          message: 'Unrecoverable data loss or corruption',
          code: errorCode
        };
      case 'deadline-exceeded':
        return {
          message: 'Operation deadline exceeded. Please try again',
          code: errorCode
        };
      case 'failed-precondition':
        return {
          message: 'The operation was rejected because the system is not in a state required for the operation',
          code: errorCode
        };
      
      // Default error message
      default:
        // Extract error message from the code if available
        const errorMessage = errorCode.split('/').pop()?.replace(/-/g, ' ');
        return { 
          message: errorMessage ? `Error: ${errorMessage}` : 'An error occurred. Please try again',
          code: errorCode
        };
    }
  } else if (error instanceof Error) {
    return { message: error.message };
  }
  
  return { message: 'An unknown error occurred' };
};

// Wallet specific error handler
export const handleWalletError = (error: unknown, operation: 'create' | 'update' | 'delete'): ErrorResponse => {
  const baseError = handleFirebaseError(error);
  
  // Add more context based on the operation
  switch (operation) {
    case 'create':
      return {
        message: `Failed to create wallet: ${baseError.message}`,
        code: baseError.code
      };
    case 'update':
      return {
        message: `Failed to update wallet: ${baseError.message}`,
        code: baseError.code
      };
    case 'delete':
      return {
        message: `Failed to delete wallet: ${baseError.message}`,
        code: baseError.code
      };
    default:
      return baseError;
  }
};

// Handle confirmation dialogs (like logout, delete)
export const confirmAction = (
  title: string, 
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type: 'danger' | 'default' = 'default'
) => {
  return {
    title,
    message,
    onConfirm,
    onCancel: onCancel || (() => {}),
    confirmText,
    cancelText,
    type
  };
};

// Utility for creating wallet-specific confirmation dialogs
export const walletConfirmations = {
  delete: (walletName: string, onConfirm: () => void, onCancel?: () => void) => {
    return confirmAction(
      'Delete Wallet',
      `Are you sure you want to delete "${walletName}"? This action cannot be undone and all associated transactions will be deleted.`,
      onConfirm,
      onCancel,
      'Delete',
      'Cancel',
      'danger'
    );
  },
  
  update: (walletName: string, onConfirm: () => void, onCancel?: () => void) => {
    return confirmAction(
      'Update Wallet',
      `Are you sure you want to update "${walletName}"?`,
      onConfirm,
      onCancel,
      'Update',
      'Cancel'
    );
  }
};