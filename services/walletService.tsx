import { ResponseType, WalletType } from "@/types";
import { uploadToCloudinary } from "./ImageServices";
import { firestore } from "@/config/firebase";
import { doc, collection, setDoc, deleteDoc } from "firebase/firestore";

export const createUpdateWallet = async (walletData: Partial<WalletType>):Promise<ResponseType> => {
  try {
    let walletToSave = {...walletData}
    if(walletData.image){
          const imageUploadRes = await uploadToCloudinary(
            walletData.image,
            'wallets'
          )
          if(!imageUploadRes.success){
            return{
              success:false,
              msg: imageUploadRes.msg||'could not upload image'
            }
          }
          walletToSave.image = imageUploadRes.data
        }
        if(!walletData?.id) {
          walletToSave.amount = 0;
          walletToSave.totalExpenses = 0;
          walletToSave.totalIncome = 0;
          walletToSave.created = new Date();
        }
        const walletRef = walletData?.id? doc(firestore, 'wallets', walletData?.id)
        :doc(collection(firestore, 'wallets'))

        await setDoc(walletRef, walletToSave, {merge:true})
    return { success: true, data:{...walletToSave, id:walletRef.id}, msg: "Wallet updated successfully" };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (walletId: string):Promise<ResponseType> => {
  try {
    const walletref = doc(firestore, 'wallets', walletId);
    await deleteDoc(walletref);
    return { success: true, msg: "Wallet deleted successfully" };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
}