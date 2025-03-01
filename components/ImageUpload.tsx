import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ImageUploadProps } from '@/types'
import * as Icons from 'phosphor-react-native'
import { colors, radius } from '@/constants/theme'
import Typo from './Typo'
import { scale, verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { getFilePath } from '@/services/ImageServices'

const ImageUpload = ({
   file=null,
   onSelect,
   onClear,
   containerStyle,
   imageStyle,
   placeholder=''
}:ImageUploadProps) => { 

  const pickImage = async () =>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.5,
    });
    if(!result.canceled){
      onSelect(result.assets[0]);
    }
  }
  return (
    <View>
      {
        !file && (
          <TouchableOpacity onPress={pickImage} style={[styles.container, containerStyle && containerStyle]}>
              <Icons.UploadSimple color ={colors.neutral200}/>
              {
                placeholder && (
                  <Typo size={15}>{placeholder}</Typo>
                )
              }
          </TouchableOpacity>
        )
      }
      {
        file&&(
          <View style={[styles.image, imageStyle && imageStyle]}>
              <Image
                style={{flex:1}}
                source={getFilePath(file)}
                contentFit='cover'
                transition={100}
                />
                <TouchableOpacity style={styles.deleteIcon} onPress={onClear}>
                  <Icons.XCircle
                    size={verticalScale(24)}
                    weight='fill'
                    color={colors.white}
                  />
                </TouchableOpacity>
          </View>
        )
      }
    </View>
  )
}

export default ImageUpload

const styles = StyleSheet.create({
  container: {
     height:verticalScale(54),
     backgroundColor:colors.neutral700,
     borderRadius:radius._17,
     flexDirection:'row',
     alignItems:'center',
     justifyContent:'center',
     gap:10,
     borderWidth:1,
     borderColor:colors.neutral500,
     borderStyle:'dashed'
  },
  image:{
      height:scale(150),
      width:scale(150),
      borderRadius:radius._15,
      overflow:'hidden',
      borderCurve:'continuous'
  },
  deleteIcon: {
    position:'absolute',
    top:scale(6),
    right:scale(6),
    shadowColor:colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  }

})