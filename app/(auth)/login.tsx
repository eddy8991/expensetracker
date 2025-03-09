import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import BackButon from "@/components/BackButon";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import * as Icons from "phosphor-react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";

const login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { login, resendVerificationEmail } = useAuth();

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!emailRef.current || !passwordRef.current) {
      setErrorMessage("Please fill all fields");
      return;
    }
    setIsLoading(true);
    const res = await login(emailRef.current, passwordRef.current);
    setIsLoading(false);

    if (res.success) {
      if (!res.verified) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in.",
          [
            {
              text: "Resend Email",
              onPress: async () => {
                const resendRes = await resendVerificationEmail();
                if (resendRes.success) {
                  Alert.alert("Success", "Verification email sent");
                } else {
                  Alert.alert(
                    "Error",
                    resendRes.msg || "Failed to send verification email"
                  );
                }
              },
            },
            { text: "OK", style: "cancel" },
          ]
        );
      }
    } else {
      setErrorMessage(res.msg || "Failed to login");
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButon iconSize={30} />
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Welcome Back 👋
          </Typo>
        </View>
        <View style={styles.form}>
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Icons.Warning size={20} color={colors.rose} weight="fill" />
              <Typo size={14} color={colors.rose} style={styles.errorText}>
                {errorMessage}
              </Typo>
            </View>
          )}
          <Input
            placeholder="Email"
            onChangeText={(value) => {
              emailRef.current = value;
              if (errorMessage) setErrorMessage(null);
            }}
            icon={
              <Icons.At
                size={verticalScale(20)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
          <Input
            placeholder="Password"
            secureTextEntry
            onChangeText={(value) => {
              passwordRef.current = value;
              if (errorMessage) setErrorMessage(null);
            }}
            icon={
              <Icons.Lock
                size={verticalScale(20)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
          <Pressable onPress={() => router.navigate("/(auth)/forgotPassword")}>
            <Typo
              style={styles.forgotPassword}
              color={colors.primary}
              fontWeight={"700"}
            >
              Forgot Password?
            </Typo>
          </Pressable>
        </View>
        <Button loading={isLoading} onPress={handleSubmit}>
          <Typo fontWeight={"700"} color={colors.black} size={21}>
            Login
          </Typo>
        </Button>
        <View style={styles.footer}>
          <Typo size={15}>Dont have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/signup")}>
            <Typo size={15} color={colors.primary} fontWeight={"700"}>
              Sign Up
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.textLight,
    fontSize: verticalScale(15),
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.green || "#7ff03d",
    padding: spacingY._10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.rose || "#bafbbf",
    gap: 8,
  },
  errorText: {
    flex: 1,
  },
});
