import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import { scale, verticalScale } from '@/utils/styling'
import BackButon from '@/components/BackButon'
import * as Icons  from 'phosphor-react-native'
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import {  WalletType } from '@/types'
import Button from '@/components/Button'
import { useAuth } from '@/context/authContext'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import ImageUpload from '@/components/ImageUpload'
import { createUpdateWallet, deleteWallet } from '@/services/walletService'
import { useToast } from '@/context/toastContext'
import { useConfirmDialog } from '@/context/confirmDialogContext'

const walletModal = () => {
  const router = useRouter();
  const {user} =useAuth()
  const { showToast } = useToast();
  const { showConfirmDialog } = useConfirmDialog();

  const [wallet, setwalet] = useState<WalletType>({
      name:'',
      image:null
  });
  const [loading, setLoading] = useState(false)

  const oldWallet:{name:string,image:string, id:string} = useLocalSearchParams();
  
  useEffect(() =>{
    if(oldWallet?.id){
      setwalet({
        name:oldWallet?.name,
        image:oldWallet?.image
      })
    }
  },[])

  const onSubmit = async()=>{
    let {name,image} = wallet;
    if(!name.trim() || !image){
      Alert.alert('Please enter name')
      return;
    }
    const data:WalletType = {
      name,
      image,
      uid: user?.uid
    } 
    if(oldWallet?.id) data.id=oldWallet?.id;
    setLoading(true);
    const res = await createUpdateWallet(data);
    setLoading(false);
    if(res.success){
      showToast(res.msg ||'Wallet Saved Successfully','success')
      router.back();
    }else{
      showToast(res.msg || 'Failed to save wallet','error')
    }
  }
  const onDelete = async()=>{
    if(!oldWallet?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldWallet?.id);
    setLoading(false);
    if(res.success){
      showToast(res.msg || 'Wallet deleted successfully', 'success');
      router.back();
    }else{
      showToast(res.msg || 'Failed to delete wallet', 'error');
    }
  }

  const showDeleteConfirmation = () => {
    showConfirmDialog({
      title: 'Delete Wallet',
      message: `Are you sure you want to delete "${wallet.name}"? This action cannot be undone and all associated transactions will be deleted.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: onDelete,
      onCancel: () => {
        // Optional: Show feedback that deletion was cancelled
        showToast('Wallet deletion cancelled', 'info');
      }
    });
  };
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header 
          title={oldWallet?.id? 'Edit Wallet':'New Wallet'} 
          leftIcon={<BackButon/>} 
          style={{marginBottom:spacingY._10}}/>
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <Input placeholder='salary' value={wallet.name} onChangeText={(value)=>setwalet({...wallet,name:value})}/>
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            {/* image picket */}
            <ImageUpload 
              file={wallet.image} 
              onSelect={file=>setwalet({...wallet,image:file})}
              onClear={()=>setwalet({...wallet,image:null})} 
              placeholder='Upload Image'/>
          </View>
        </ScrollView>  
      </View>
      <View style={styles.footer}>
        {oldWallet?.id && !loading && (
          <Button
            style={{
              backgroundColor:colors.rose,
              paddingHorizontal:spacingX._15,
            }}
            onPress={showDeleteConfirmation}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight='bold'
            />
          </Button>
        )}
        <Button onPress={onSubmit} loading={loading} style={{flex:1}}>
          <Typo color={colors.black} fontWeight={'700'}>{oldWallet?.id? 'Update Wallet':'Add Wallet'}</Typo>
        </Button>
      </View> 
    </ModalWrapper>
  )
}

export default walletModal

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