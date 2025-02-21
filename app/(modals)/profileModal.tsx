import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import { scale, verticalScale } from '@/utils/styling'
import BackButon from '@/components/BackButon'
import { Image } from 'expo-image'
import { getProfileImage } from '@/services/ImageServices'
import * as Icons  from 'phosphor-react-native'
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import { UserDataType } from '@/types'
import Button from '@/components/Button'
import { useAuth } from '@/context/authContext'
import { updateUser } from '@/services/userService'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';

const profileModal = () => {
  const router = useRouter();
  const {user, updateUserData} =useAuth()
  const [userData, setUserData] = useState<UserDataType>({
      name:'',
      image:null
  });
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUserData({
      name:user?.name || "",
      image:user?.image || null
    })
  },[user])

  const handleImagePicker = async () =>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });
    if(!result.canceled){
      setUserData({...userData,image:result.assets[0]});
    }
  }

  const onSubmit = async()=>{
    let {name,image} = userData;
    if(!name.trim()){
      Alert.alert('Please enter name')
      return;
    }
    setLoading(true);
    const res = await updateUser(user?.uid as string,userData);
    setLoading(false);
    if(res.success){
      updateUserData(user?.uid as string);
      router.back();
    }else{
      Alert.alert('Update Failed',res.msg)
    }
  }
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header 
          title='Update Profile' 
          leftIcon={<BackButon/>} 
          style={{marginBottom:spacingY._10}}/>
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={getProfileImage(userData.image)}
              contentFit='cover'
              transition={100}
            />
            <TouchableOpacity onPress={handleImagePicker} style={styles.editIcon}>
              <Icons.Pen weight='bold' size={verticalScale(20)} color={colors.neutral800}/>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Name</Typo>
            <Input placeholder='name' value={userData.name} onChangeText={(value)=>setUserData({...userData,name:value})}/>
          </View>
        </ScrollView>  
      </View>
      <View style={styles.footer}>
        <Button onPress={onSubmit} loading={loading} style={{flex:1}}>
          <Typo color={colors.black} fontWeight={'700'}>Update</Typo>
        </Button>
      </View> 
    </ModalWrapper>
  )
}

export default profileModal

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'space-between',
    paddingHorizontal:spacingY._20,
  },
  form:{
    gap:spacingY._30,
    marginTop:spacingY._15
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
    borderRadius:200,
    borderWidth:1,
    borderColor:colors.neutral500
  },
  editIcon:{
    position:'absolute',
    bottom:spacingY._5,
    right:spacingY._5,
    borderRadius:100,
    backgroundColor:colors.neutral100,
    shadowColor:colors.black,
    shadowOffset:{width:0,height:0},
    elevation:10,
    shadowRadius:25,
    shadowOpacity:0.25
  },
  inputContainer:{
    gap:spacingY._10
  },
  footer:{
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'center', 
    paddingHorizontal:spacingX._20,
    gap:scale(2),
    paddingTop:spacingY._15,
    borderTopColor:colors.neutral700,
    borderTopWidth:1,
    marginBottom:spacingY._5
  }
})