import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { router } from "expo-router";
import { useToast } from "./toastContext";
import { useConfirmDialog } from "./confirmDialogContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { handleFirebaseError } from "@/utils/fireBaseErrorHandling";


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [initializing, setInitializing] = useState(true);
  const { showToast } = useToast();
  const { showConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const wasVerifiedBefore = user?.emailVerified;

        await firebaseUser.reload();
        const isVerified = firebaseUser.emailVerified;
        setIsEmailVerified(isVerified);
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          name: firebaseUser?.displayName,
          emailVerified: isVerified,
        });
        await updateUserData(firebaseUser.uid, isVerified);
        if (isVerified) {
          if(wasVerifiedBefore === false && isVerified === true){
            showToast('Email successfully Verified', 'success', 4000);
          }
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/verify");
        }
      } else {
        setUser(null);
        setIsEmailVerified(false);
        if (!initializing) {
          router.replace("/(auth)/welcome");
        }
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    return () => unsub();
  }, [initializing]);

  const login = async (email: string, password: string) => {
    // login logic here
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await userCredentials.user.reload();

      if (!userCredentials.user.emailVerified) {
        showToast("Please verify your email", "warning", 4000);
        return {
          success: true,
          verified: false,
          msg: "Please verify your email",
        };
      }
      showToast("Login successful", "success", 4000);
      return { success: true, verified: true };
    } catch (error: any) {
      let message = error.message;
      console.log("error message", message);
      if (message.includes("(auth/invalid-credentials)"))
        message = "Invalid credentials";
      return { success: false, msg: message };
    }
  };

  const logout = () => {
    showConfirmDialog({
      title: "Logout",
      message: "Are you sure you want to logout?",
      onConfirm: async () => {
        try {
          await signOut(auth);
          showToast("Logged out successfully", "success");
        } catch (error) {
          const errorResponse = handleFirebaseError(error);
          showToast(errorResponse.message, "error");
        }
      }
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      let response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(response.user);

      await setDoc(doc(firestore, "users", response?.user?.uid), {
        name,
        email,
        uid: response?.user?.uid,
        emailVerified: false,
      });
      return {
        success: true,
        msg: "Verification email sent. Please check your inbox",
      };
    } catch (error: any) {
      let message = error.message;
      return { success: false, msg: message };
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, msg: "No user is signed in" };
      }

      await sendEmailVerification(currentUser);
      return { success: true, msg: "Verification email sent" };
    } catch (error: any) {
      return { success: false, msg: error.message };
    }
  };

  const checkEmailVerification = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, verified: false, msg: "No user is signed in" };
      }

      // Force refresh the token to get latest verification status
      await currentUser.reload();

      const isVerified = currentUser.emailVerified;
      setIsEmailVerified(isVerified);

      if (isVerified) {
        // Update the verified status in Firestore
        await updateDoc(doc(firestore, "users", currentUser.uid), {
          emailVerified: true,
        });

        return { success: true, verified: true };
      }
      return { success: true, verified: false };
    } catch (error: any) {
      return { success: false, msg: error.message, verified: false };
    }
  };

  const signOutAndRedirect = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/login");
      return { success: true };
    } catch (error: any) {
      return { success: false, msg: error.message };
    }
  };

  // Password reset functionality
  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, msg: "Password reset email sent" };
    } catch (error: any) {
      let message = error.message;
      if (message.includes("auth/user-not-found")) {
        message = "No account found with this email";
      }
      return { success: false, msg: message };
    }
  };



  const updateUserData = async (uid: string, isVerified: boolean = false) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (isVerified && !data.emailVerified) {
          await updateDoc(docRef, { emailVerified: true });
        }
        const userData: UserType = {
          uid: data.uid,
          name: data.name || null,
          email: data.email || null,
          image: data.image || null,
          emailVerified: data.emailVerified || false,
        };
        setUser({ ...userData });
        return { success: true };
      }
    } catch (error: any) {
      let message = error.message;
      return { success: false, msg: message };
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    signup,
    updateUserData,
    logout,
    signOutAndRedirect,
    isEmailVerified,
    resendVerificationEmail,
    checkEmailVerification,
    sendPasswordReset,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
