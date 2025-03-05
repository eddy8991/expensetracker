import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "./ImageServices";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
):Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data" };
    }
    if (id) {
      //todo:Update transaction
    } else {
      let res = await updateWalletNewTransaction(
        walletId!,
        Number(amount!),
        type
      );
      if (!res.success) return res;
    }
    if (image) {
      const imageUploadRes = await uploadToCloudinary(image, "transactions");
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "could not upload receipt",
        };
      }
      transactionData.image = imageUploadRes.data;
    }
    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));
    await setDoc(transactionRef, transactionData, { merge: true });
    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (err: any) {
     return { success: false, msg: err.message };
  }
};

const updateWalletNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    //Update wallet
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnap = await getDoc(walletRef);
    if (!walletSnap.exists()) {
      return { success: false, msg: "Wallet not found" };
    }
    const walletData = walletSnap.data() as WalletType;

    if (type == "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Insufficient funds",
      };
    }

    const updateType = type == "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletamount =
      type == "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;
    const updatedTotals =
      type == "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updatedWalletamount,
      [updateType]: updatedTotals,
    });
    return { success: true, msg: "Wallet updated successfully" };
  } catch (err: any) {
    return { success: false, msg: err.message };
  }
};
