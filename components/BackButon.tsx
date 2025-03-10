import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { BackButtonProps } from '../types'
import { useRouter } from 'expo-router'
import { CaretLeft } from 'phosphor-react-native'
import { verticalScale } from '../utils/styling'
import { colors, radius } from '../constants/theme'

const BackButon = ({
  style,
  iconSize=26
}: BackButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={()=>router.back()} style={[styles.button, style]}>
      <CaretLeft 
        size={verticalScale(iconSize)}
        color={colors.white}
        weight='bold'
        />
    </TouchableOpacity>
  )
}

export default BackButon

const styles = StyleSheet.create({
  button:{
    backgroundColor:colors.neutral600,
    alignSelf:'flex-start',
    borderRadius:radius._12,
    padding:5,
    borderCurve:'continuous'
  }
})