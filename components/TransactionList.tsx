import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { TransactionItemProps, TransactionListType } from '@/types'
import { verticalScale } from '@/utils/styling'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Typo from './Typo'
import { FlashList } from "@shopify/flash-list";
import Loading from './Loading'
import { expenseCategories } from '@/constants/data'
import Animated, { ColorSpace, FadeInDown } from 'react-native-reanimated'

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage
}:TransactionListType) => {
  return (
    <View style={styles.container}>
      {
        title &&(
          <Typo size={20} fontWeight={'500'}>{title}</Typo>
        )
      }
      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => <TransactionItem data={[1,2,3,4]} item={item} index={index}/>}
          estimatedItemSize={60}
        />
      </View>
      {
        !loading && data.length == 0 && (
          <Typo
            size={15}
            color={colors.neutral400}
            style={{textAlign:'center', marginTop:spacingY._15}}
            >
            {emptyListMessage}
          </Typo>
        )
      }
      {
        loading && (
          <View style={{top:verticalScale(100)}}>
              <Loading/>
          </View>
        )
      }
    </View>
  )
}

const TransactionItem =({
  item, index, handleClick
}: TransactionItemProps) =>{
  let category = expenseCategories['groceries']
  const IconComponent = category.icon;
  return( 
  <Animated.View entering={FadeInDown.delay(index*70).springify().damping(15)}>
    <TouchableOpacity style={styles.row} onPress={()=> handleClick(item)}>
      <View style={[styles.icon, {backgroundColor: category.bgColor}]}>
        {
          IconComponent && (
            <IconComponent
              size={verticalScale(24)}
              color={colors.white}
              weight='fill'
            />
          )
        }
      </View>
      <View style={styles.categoryDes}>
        <Typo size={17}>{category.label}</Typo>
        <Typo size={12} color={colors.neutral400} textProps={{numberOfLines:1}}>{item?.description}</Typo>
      </View>
      <View style={styles.amountDate}>
        <Typo
          fontWeight={'500'}
          color={colors.rose}>
            +245
          </Typo>
          <Typo size={13} color={colors.neutral400}> 
            14 feb
          </Typo>
      </View>
    </TouchableOpacity>
  </Animated.View>)
}

export default TransactionList

const styles = StyleSheet.create({
  amountDate:{
    alignItems:'flex-end',
    gap:3
  },
  categoryDes:{
    flex:1,
    gap:3
  },
  icon:{
    height:verticalScale(44),
    aspectRatio:1,
    justifyContent:'center',
    alignItems:'center',
    borderCurve:'continuous',
    borderRadius:radius._12
  },
  row:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    gap:spacingX._12,
    marginBottom:spacingY._12,
    backgroundColor:colors.neutral800,
    padding:spacingY._10,
    paddingHorizontal:spacingY._10,
    borderRadius:radius._17
  },
  list:{
    minHeight:3
  },
  container:{
    gap:spacingY._17
  }
})