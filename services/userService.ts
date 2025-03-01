import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "./ImageServices";

export const updateUser = async (
  uid:string,
  updatedData:UserDataType
):Promise<ResponseType> => {
  try{
    if(updatedData.image && updatedData?.image?.uri){
      const imageUploadRes = await uploadToCloudinary(
        updatedData.image,
        'users'
      )
      if(!imageUploadRes.success){
        return{
          success:false,
          msg: imageUploadRes.msg||'could not upload image'
        }
      }
      updatedData.image = imageUploadRes.data
    }
    const useRef = doc(firestore, "users", uid);
    await updateDoc(useRef, updatedData);
    return{success:true, msg:"User updated successfully"}
  }catch(error:any){
    return{success:false, msg:error.message}
  }
}
 