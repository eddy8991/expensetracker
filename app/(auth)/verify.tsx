import { Alert, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { verticalScale } from "../../utils/styling";
import { colors, spacingX, spacingY } from "../../constants/theme";
import Typo from "../../components/Typo";
import Button from "../../components/Button";
import { useAuth } from "../../context/authContext";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [timer, setTimer] = useState(0);

  const { user, resendVerificationEmail, checkEmailVerification, logout } =
    useAuth();

  const router = useRouter();

  useEffect(() => {
    // Setup timer for resend button
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    // Check verification status on component mount
    const checkInitialVerification = async () => {
      const res = await checkEmailVerification()
      if (res.success && res.verified) {
        handleVerificationSuccess()
      }
    }

    checkInitialVerification()
  }, [])

  const handleResendEmail = async () => {
    if (timer > 0) return;

    setIsLoading(true);
    const res = await resendVerificationEmail();
    setIsLoading(false);

    if (res.success) {
      Alert.alert("Success", res.msg);
      setTimer(60); // Set 60 seconds cooldown
    } else {
      Alert.alert("Error", res.msg || "Failed to send verification email");
    }
  };

  const handleVerificationSuccess = () => {
    Alert.alert(
      'Email Verified',
      'Your email has been successfully verified. Please log in to continue.',
      [
        {
          text: 'Log In',
          onPress: async () => {
            await logout()
            router.replace('/(auth)/login')
          }
        }
      ]
    )
  }


  const handleCheckVerification = async () => {
    setIsChecking(true);
    const res = await checkEmailVerification();
    setIsChecking(false);

    if (!res.success) {
      Alert.alert("Error", res.msg || "Failed to check verification status");
    } else if (!res.verified) {
      Alert.alert(
        "Not Verified",
        "Your email is not verified yet. Please check your inbox and click the verification link."
      );
    }
    // If verified, the auth state listener will handle navigation
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icons.EnvelopeSimple
            size={verticalScale(80)}
            color={colors.primary}
            weight="fill"
          />
        </View>

        <View style={styles.textContainer}>
          <Typo size={28} fontWeight={"800"} style={styles.title}>
            Verify Your Email
          </Typo>

          <Typo size={16} color={colors.textLight} style={styles.description}>
            We've sent a verification email to:
          </Typo>

          <Typo size={18} fontWeight={"600"} style={styles.email}>
            {user?.email}
          </Typo>

          <Typo size={16} color={colors.textLight} style={styles.instruction}>
            Please check your inbox and click the verification link to activate
            your account.
          </Typo>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            loading={isChecking}
            onPress={handleCheckVerification}
            style={styles.checkButton}
          >
            <Typo fontWeight={"700"} color={colors.black} size={18}>
              I've Verified My Email
            </Typo>
          </Button>

          <Button
            loading={isLoading}
            disabled={timer > 0}
            onPress={handleResendEmail}
            style={styles.resendButton}
          >
            <Typo fontWeight={"700"} color={colors.black} size={18}>
              {timer > 0 ? `Resend in ${timer}s` : "Resend Email"}
            </Typo>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: spacingY._20,
  },
  textContainer: {
    alignItems: "center",
    gap: spacingY._10,
  },
  title: {
    textAlign: "center",
    marginBottom: spacingY._10,
  },
  description: {
    textAlign: "center",
  },
  email: {
    textAlign: "center",
    color: colors.primary,
  },
  instruction: {
    textAlign: "center",
    marginTop: spacingY._10,
  },
  buttonContainer: {
    width: "100%",
    gap: spacingY._15,
    marginTop: spacingY._20,
  },
  checkButton: {
    width: "100%",
  },
  resendButton: {
    width: "100%",
  },
});
