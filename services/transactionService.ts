import { createUpdateWallet } from "@/services/walletService";
import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadToCloudinary } from "./ImageServices";
import { getLast12Months, getLast7Days, getYearsRange } from "@/utils/common";
import { scale } from "@/utils/styling";
import { colors } from "@/constants/theme";
import { handleFirebaseError } from "@/utils/fireBaseErrorHandling";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data" };
    }
    if (id) {
      //todo:Update transaction
      const oldTransactionSnap = await getDoc(
        doc(firestore, "transactions", id)
      );
      const oldTransaction = oldTransactionSnap.data() as TransactionType;
      const showRevertOriginal =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        oldTransaction.walletId != walletId;
      if (showRevertOriginal) {
        //Revert original transaction
        let res = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!res.success) return res;
      }
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

const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
) => {
  try {
    //Update wallet
    const originalWalletSnap = await getDoc(
      doc(firestore, "wallets", oldTransaction.walletId)
    );

    const originalWallet = originalWalletSnap.data() as WalletType;

    let newWalletSnap = await getDoc(doc(firestore, "wallets", newWalletId));
    let newWallet = newWalletSnap.data() as WalletType;

    const revertType =
      oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";
    const revertIncomeExpense: number =
      oldTransaction.type == "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense;
    const revertedIncomeexpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount);

    if (newTransactionType == "expense") {
      if (
        oldTransaction.walletId == newWalletId &&
        revertWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet has insuficient funds",
        };
      }
      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: "The selected wallet has insuficient funds",
        };
      }
    }

    await createOrUpdateTransaction({
      id: oldTransaction.walletId,
      amount: revertWalletAmount,
      [revertType]: revertedIncomeexpenseAmount,
    });

    newWalletSnap = await getDoc(doc(firestore, "wallets", newWalletId));
    newWallet = newWalletSnap.data() as WalletType;

    const updateType =
      newTransactionType == "income" ? "totalIncome" : "totalExpenses";
    const updateTransactionAmount: number =
      newTransactionType == "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    const newWalletAmount = Number(newWallet.amount) + updateTransactionAmount;

    const newIncomeExpenseAmount = Number(
      newWallet[updateType]! + Number(newTransactionAmount)
    );

    await createUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    return { success: true, msg: "Wallet updated successfully" };
  } catch (err: any) {
    return { success: false, msg: err.message };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId: string
) => {
  try {
    const transactionRef = doc(firestore, "transactions", transactionId);
    const transactionSnapshot = await getDoc(transactionRef);
    if (!transactionSnapshot.exists()) {
      return { success: false, msg: "Transaction Not found" };
    }
    const transactionData = transactionSnapshot.data() as TransactionType;

    const transactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;

    const walletSnap = await getDoc(doc(firestore, "wallets", walletId));
    const walletData = walletSnap.data() as WalletType;

    const updateType =
      transactionType == "income" ? "totalIncome" : "totalExpenses";
    const newWalletAmount =
      walletData?.amount! -
      (transactionType == "income" ? transactionAmount : -transactionAmount);

    const newIncomeExpenseAmount = walletData[updateType]! - transactionAmount;

    if (transactionType == "expense" && newWalletAmount < 0) {
      return { success: false, msg: "You can not delete this transaction" };
    }

    await createUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    await deleteDoc(transactionRef);

    return { success: true };
  } catch (err: any) {
    return { success: false, msg: err.message };
  }
};

export const fetchWeeklyStats = async (
  uid:string
):Promise<ResponseType> =>{
  try{
    const db = firestore
    const today = new Date()
    const sevenDaysago = new Date(today)
    sevenDaysago.setDate(today.getDate() - 7)

    const transactionQuery = query(
      collection(db, "transactions"),
      where('date', '>=', Timestamp.fromDate(sevenDaysago)),
      where('date', '<=', Timestamp.fromDate(today)),
      orderBy('date', 'desc'),
      where('uid', '==', uid)
    )

    const querySnapshot = await getDocs(transactionQuery);
    const weeklyData = getLast7Days()
    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType
      transaction.id = doc.id;
      transactions.push(transaction)

      const transactionDate = (transaction.date as Timestamp)
      .toDate()
      .toISOString()
      .split('T')[0]

      const dayData = weeklyData.find((day) => day.date == transactionDate)

      if(dayData){
        if(transaction.type == 'income'){
          dayData.income += transaction.amount
        }else if(transaction.type == 'expense'){
          dayData.expense += transaction.amount
        }
      }
    })

    const stats = weeklyData.flatMap((day) => [
      {
        value:day.income,
        label:day.day,
        spacing:scale(4),
        labelWidth:scale(30),
        frontColor:colors.green
      },
      {
         value:day.expense,
         frontColor:colors.rose
      }
    ])
    return{success:true,data:{
      stats,
      transactions
    } }
  }catch(err:any){
    return{success:false, msg:err.message}
  }
}
export const fetchMonthlyStats = async (
  uid:string
):Promise<ResponseType> =>{
  try{
    const db = firestore
    const today = new Date()
    const twelveMonthsAgo = new Date(today)
    twelveMonthsAgo.setMonth(today.getMonth() - 12)

    const transactionQuery = query(
      collection(db, "transactions"),
      where('date', '>=', Timestamp.fromDate(twelveMonthsAgo)),
      where('date', '<=', Timestamp.fromDate(today)),
      orderBy('date', 'desc'),
      where('uid', '==', uid)
    )

    const querySnapshot = await getDocs(transactionQuery);
    const monthlyData = getLast12Months()
    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType
      transaction.id = doc.id;
      transactions.push(transaction)

      const transactionDate = (transaction.date as Timestamp)
      .toDate()

      const monthName = transactionDate.toLocaleString('default', { month: 'short' })

      const shortYear = transactionDate.getFullYear().toString().slice(-2)
      const monthData = monthlyData.find((month) => month.month == `${monthName} ${shortYear}`)

      if(monthData){
        if(transaction.type == 'income'){
          monthData.income += transaction.amount
        }else if(transaction.type == 'expense'){
          monthData.expense += transaction.amount
        }
      }
    })

    const stats = monthlyData.flatMap((month) => [
      {
        value:month.income,
        label:month.month,
        spacing:scale(4),
        labelWidth:scale(30),
        frontColor:colors.green
      },
      {
         value:month.expense,
         frontColor:colors.rose
      }
    ])
    return{success:true,data:{
      stats,
      transactions
    } }
  }catch(err:any){
    return{success:false, msg:'Failed to fetch monthly transactions'}
  }
}
export const fetchYearlyStats = async (
  uid:string
):Promise<ResponseType> =>{
  try{
    const db = firestore


    const transactionQuery = query(
      collection(db, "transactions"),
      orderBy('date', 'desc'),
      where('uid', '==', uid)
    )

    const querySnapshot = await getDocs(transactionQuery);
    const transactions: TransactionType[] = [];

    const firstTransaction = querySnapshot.docs.reduce((earliest, doc) => {
      const transactionDate = doc.data().date.toDate()
      return transactionDate < earliest ? transactionDate : earliest
    }, new Date())

    const firstYear = firstTransaction.getFullYear()
    const currentYear = new Date().getFullYear()

    const yearlyData = getYearsRange(firstYear, currentYear)

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType
      transaction.id = doc.id;
      transactions.push(transaction)

      const transactionYear = (transaction.date as Timestamp)
      .toDate().getFullYear();

      const yearData = yearlyData.find((item:any) => item.year == transactionYear.toString())

      if(yearData){
        if(transaction.type == 'income'){
          yearData.income += transaction.amount
        }else if(transaction.type == 'expense'){
          yearData.expense += transaction.amount
        }
      }
    })

    const stats = yearlyData.flatMap((year:any) => [
      {
        value:year.income,
        label:year.month,
        spacing:scale(4),
        labelWidth:scale(35),
        frontColor:colors.green
      },
      {
         value:year.expense,
         frontColor:colors.rose
      }
    ])
    return{success:true,data:{
      stats,
      transactions
    } }
  }catch(err:any){
    return{success:false, msg:'Failed to fetch monthly transactions'}
  }
}
