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




const Signup = () => {
  const emailRef = useRef("")
  const passwordRef = useRef("")
  const nameref = useRef("")

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const {signup} = useAuth()

  const handleSubmit = async() => {
    if(!emailRef.current || !passwordRef.current){
      Alert.alert('Please fill all fields')
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
      Alert.alert('Success', res.msg || 'Sign up successful! Please verify your email.')
      // User will be automatically redirected to verify-email screen by the auth state listener
    } else {
      Alert.alert('Error', res.msg || 'Failed to sign up')
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
