import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Header from '@/components/Header'
import { useAuth } from '@/context/authContext'
import Typo from '@/components/Typo'
import {Image} from 'expo-image'
import { getProfileImage } from '@/services/ImageServices'
import { accountOptionType } from '@/types'
import * as Icons from 'phosphor-react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useRouter } from 'expo-router'

const Profile = () => {

  const {user} = useAuth();
  const router = useRouter();


  const handleLogOut = async () =>{
    await signOut(auth);
  }

  const showLogoutAlert = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text:'cancel',
        onPress:() => console.log('cancel logout'),
        style:'cancel'
      },
      {
        text:'Yes',
        onPress:() => handleLogOut(),
        style:'destructive'
      }
    ])
  }
  
  const handlePress = (item:accountOptionType) =>{
    if(item.title == 'Logout'){
      showLogoutAlert();
    }
    if(item.routeName){  
      router.push(item.routeName);
    }
  } 

  const accountOptions: accountOptionType[] = [
    {
      title:"Edit Profile",
      icon: (
        <Icons.User
          size={26}
          color={colors.white}
          weight='fill'
        />
      ),
      routeName:'/(modals)/profileModal',
      bgColor:'#636f1'
    },
    // {
    //   title:"Settings",
    //   icon: (
    //     <Icons.GearSix
    //       size={26}
    //       color={colors.white}
    //       weight='fill'
    //     />
    //   ),
    //   routeName:'/(modals)/ptofileModal',
    //   bgColor:'#059669'
    // },
    {
      title:"Pricacy Policy",
      icon: (
        <Icons.User
          size={26}
          color={colors.white}
          weight='fill'
        />
      ),
      routeName:'/(modals)/ptofileModal',
      bgColor:'#6366f1'
    },
    {
      title:"Logout",
      icon: (
        <Icons.User
          size={26}
          color={colors.white}
          weight='fill'
        />
      ),
      // routeName:'/(modals)/ptofileModal',
      bgColor:'#069669'
    }
  ]
  
  return (
    <ScreenWrapper> 
      <View style={styles.container}>
        <Header title='Profile' style={{marginVertical:spacingY._10}}/>
        <View style={styles.userInfo}>
          <View>
            <Image source={getProfileImage(user?.image)} style={styles.avatar} contentFit='cover' transition={100}/>
          </View>
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={'600'} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>
        {/* Account Options */}
        <View style={styles.accountOptions}>
          {
            accountOptions.map((item, index) => {
              return (
                <Animated.View key={index.toString()} entering={FadeInDown.delay(index*50).springify().damping(15)} style={styles.listItem}>
                  <TouchableOpacity style={styles.flexRow} onPress={() => handlePress(item)}>
                      <View style={[styles.listIcon, {backgroundColor:item?.bgColor}]}>
                        {item.icon && item.icon}
                      </View>
                      <Typo size={26} fontWeight={'500'} style={{flex:1}}>{item.title}</Typo>
                      <Icons.CaretRight size={verticalScale(20)} color={colors.white} weight='bold'/>
                  </TouchableOpacity>
                </Animated.View>
              )
            })
          }

        </View>
      </View>
    </ScreenWrapper>
  ) 
}

export default Profile

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingHorizontal:spacingX._20
  },
  userInfo:{
    marginTop:verticalScale(30),
    alignItems:'center',
    gap:spacingY._15
  },
  avatarContainer:{
    position:'relative',
    alignSelf:'center'
  },
  avatar:{
    alignSelf:'center',
    backgroundColor:colors.neutral300,
    height:verticalScale(135),
    width:verticalScale(135),
    borderRadius:200
  },
  editIcon:{
    position:'absolute',
    bottom:5,
    right:8,
    backgroundColor:colors.neutral100,
    shadowColor:colors.black,
    shadowOffset:{width:0,height:0},
    shadowOpacity:0.25,
    shadowRadius:10,
    elevation:5,
    borderRadius:50,
    padding:5
  },
  flexRow:{
    flexDirection:'row',
    gap:spacingX._10,
    alignItems:'center'
  },
  accountOptions:{
    marginTop: spacingY._35
  },
  listItem:{
    marginBottom:verticalScale(17)
  },
  nameContainer:{
    gap:verticalScale(5),
    alignItems:'center'
  },
  listIcon:{
    height:verticalScale(44),
    width:verticalScale(44),
    borderRadius:radius._15,
    borderCurve:'continuous',
    backgroundColor:colors.neutral500,
    justifyContent:'center',
    alignItems:'center'
  }
})