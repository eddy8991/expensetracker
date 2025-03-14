import { Alert,Pressable, StyleSheet, View } from 'react-native'
import{ useRef, useState } from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import BackButon from '@/components/BackButon'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { useAuth } from '@/context/authContext'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import * as Icons from "phosphor-react-native";
import Button from '@/components/Button'
import { useToast } from '@/context/toastContext'




const Signup = () => {
  const emailRef = useRef("")
  const passwordRef = useRef("")
  const nameref = useRef("")
  const { showToast } = useToast()

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const {signup} = useAuth()

  const handleSubmit = async() => {
    if(!emailRef.current || !passwordRef.current){
      showToast("Please fill all the fields",'error',4000 )
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(emailRef.current)) {
      showToast("Please enter a valid email address", "error", 4000)
      return
    }
    
    setIsLoading(true)
    const res = await signup(
      emailRef.current, 
      passwordRef.current, 
      nameref.current
    )
    setIsLoading(false)

    if (res.success) {
      showToast("Sign up successfull.  verification email has been sent to your email", 'success', 4000)
      // User will be automatically redirected to verify-email screen by the auth state listener
    } else {
      showToast(res.msg || 'Failed to sign up','error', 4000)
    }

  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButon iconSize={30}/>
        <View style={{gap:5, marginTop:spacingY._20}}>
          <Typo size={30} fontWeight={'800'}>
            Hello There 👋
          </Typo>
        </View>
        <View style={styles.form}>
        <Input 
            placeholder='Enter name'
            onChangeText={(value)=>nameref.current = value }
            icon={
              <Icons.User
                size={verticalScale(20)}
                color={colors.neutral300}
                weight='fill'
              />
            }
            />
          <Input 
            placeholder='Email'
            onChangeText={(value)=>emailRef.current = value }
            icon={
              <Icons.At
                size={verticalScale(20)}
                color={colors.neutral300}
                weight='fill'
              />
            }
            />
          <Input
            placeholder='Password'
            secureTextEntry
            onChangeText={(value)=>passwordRef.current = value }
            icon={
              <Icons.Lock
                size={verticalScale(20)}
                color={colors.neutral300}
                weight='fill'
              />
            }
            />    
        </View> 
        <Button loading={isLoading} onPress={handleSubmit}>
          <Typo fontWeight={'700'} color={colors.black} size={21}>Sign Up</Typo>
        </Button>
        <View style={styles.footer}>
            <Typo size={15}>Already have an account?</Typo>
            <Pressable onPress={()=>router.navigate('/(auth)/login')}>
              <Typo size={15} color={colors.primary} fontWeight={'700'}>Login</Typo>
            </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Signup

const styles = StyleSheet.create({
  container:{
    flex:1,
    gap:spacingY._30,
    paddingHorizontal:spacingX._20
  },
  welcomeText:{
    fontSize:verticalScale(20),
    fontWeight:'bold',
    color:colors.text
  },
  form:{
    gap:spacingY._20
  },
  forgotPassword:{
    textAlign:'right',
    fontWeight:'500',
    color:colors.text
  },
  footer:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:5
  },
  footerText:{
    textAlign:'center',
    color:colors.textLight,
    fontSize:verticalScale(15)
  }
})
