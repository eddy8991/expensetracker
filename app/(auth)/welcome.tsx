import { StyleSheet,TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { verticalScale } from '@/utils/styling'
import Button from '@/components/Button'

const Welcome = () => {
  const router = useRouter()

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <TouchableOpacity onPress={()=>router.push('/(auth)/login')} style={styles.loginButton}>
            <Typo fontWeight={'500'}>SignIn</Typo>
          </TouchableOpacity>
          <Animated.Image 
          entering={FadeIn.duration(1500)}
          source={require('../../assets/images/welcome.png')} 
          style={styles.welcomeImage} 
          resizeMode='contain' />
        </View>
        <View style={styles.footer}>
          <Animated.View 
            entering={FadeInDown.duration(1500).delay(500).springify().damping(15)}
            style={{alignItems:'center'}}>
            <Typo size={30} fontWeight={'800'}>Take Control</Typo>
            <Typo size={30} fontWeight={'800'}>Of Your Finances</Typo>
          </Animated.View>
          <View style={{alignItems:'center', gap:2}}>
            <Typo size={17} color={colors.textLight}>Grow your wealth</Typo>
            <Typo size={17} color={colors.textLight}>one mindful choice at a time</Typo>
          </View>
          <View style={styles.buttonContainer}> 
              <Button onPress={()=>router.push('/(auth)/signup')} >
                <Typo size={18} fontWeight={'600'} color={colors.black}>Get Started</Typo>
              </Button>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'space-between',
    paddingTop:spacingY._7
  },
  welcomeImage:{
    width:'100%',
    height:verticalScale(300),
    alignSelf:'center',
    marginTop:verticalScale(100)
  },
  loginButton:{
    alignSelf:'flex-end',
    marginRight:spacingX._20,
  },
  footer:{
    backgroundColor:colors.neutral900,
    alignItems:'center',
    paddingTop:verticalScale(30),
    paddingBottom:verticalScale(45),
    gap:spacingY._20,
    shadowColor:'white',
    shadowOffset:{width:0,height:-10},
    elevation:10,
    shadowRadius:25,
    shadowOpacity:0.15
  },
  buttonContainer:{
    width:'100%',
    paddingHorizontal:spacingX._25
  }
})