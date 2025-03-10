import { Alert, StyleSheet, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { verticalScale } from '../../utils/styling'
import { colors, spacingX, spacingY } from '../../constants/theme'
import BackButon from '../../components/BackButon'
import Typo from '../../components/Typo'
import Input from '../../components/Input'
import * as Icons from 'phosphor-react-native'
import Button from '../../components/Button'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/authContext'

const ForgotPassword = () => {
  const emailRef = useRef("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { sendPasswordReset } = useAuth()

  const handleResetPassword = async () => {
    if (!emailRef.current) {
      Alert.alert('Email Required', 'Please enter your email address')
      return
    }
    
    setIsLoading(true)
    const res = await sendPasswordReset(emailRef.current)
    setIsLoading(false)
    
    if (res.success) {
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email for instructions to reset your password.',
        [
          {
            text: 'Back to Login',
            onPress: () => router.replace('/(auth)/login')
          }
        ]
      )
    } else {
      Alert.alert('Error', res.msg || 'Failed to send password reset email')
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButon iconSize={30} />
        <View style={styles.headerContainer}>
          <Typo size={30} fontWeight={'800'}>
            Reset Password
          </Typo>
          <Typo size={16} color={colors.textLight} style={styles.description}>
            Enter your email address and we'll send you instructions to reset your password.
          </Typo>
        </View>
        
        <View style={styles.formContainer}>
          <Input 
            placeholder='Email'
            onChangeText={(value) => emailRef.current = value}
            icon={
              <Icons.At
                size={verticalScale(20)}
                color={colors.neutral300}
                weight='fill'
              />
            }
          />
        </View>
        
        <Button 
          loading={isLoading} 
          onPress={handleResetPassword}
          style={styles.resetButton}
        >
          <Typo fontWeight={'700'} color={colors.black} size={21}>
            Send Reset Link
          </Typo>
        </Button>
      </View>
    </ScreenWrapper>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20
  },
  headerContainer: {
    gap: spacingY._10,
    marginTop: spacingY._20
  },
  description: {
    marginTop: spacingY._5
  },
  formContainer: {
    gap: spacingY._20
  },
  resetButton: {
    marginTop: spacingY._10
  }
})