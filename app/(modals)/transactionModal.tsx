import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import { scale, verticalScale } from "@/utils/styling";
import BackButon from "@/components/BackButon";
import { Dropdown } from "react-native-element-dropdown";
import * as Icons from "phosphor-react-native";
import Typo from "@/components/Typo";
import { TransactionType, WalletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/context/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/ImageUpload";
import { expenseCategories, transactionTypes } from "@/constants/data";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "@/components/Input";
import { createOrUpdateTransaction, deleteTransaction } from "@/services/transactionService";
import { useToast } from "@/context/toastContext";
import { useConfirmDialog } from "@/context/confirmDialogContext";
import { transactionConfirmations } from "@/utils/fireBaseErrorHandling";

const transactionModal = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { showConfirmDialog } = useConfirmDialog();

  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);
  type paramType ={
    id:string,
    type:string,
    amount:string,
    category?:string,
    date:string,
    description?:string,
    uid?:string,
    walletId:string,
    image?:string

  }

  const oldTransaction: paramType =
    useLocalSearchParams();

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS == "ios" ? true : false);
  };

  useEffect(() => {
    if(oldTransaction?.id) {
      setTransaction({
        type:oldTransaction?.type,
        amount:Number(oldTransaction.amount),
        description:oldTransaction.description || '',
        category:oldTransaction.category || '',
        date:new Date(oldTransaction.date),
        walletId:oldTransaction.walletId,
        image:oldTransaction?.image,
      })
    }
  },[])

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;
    if (!walletId || !date || !amount || (type == "expense" && !category)) {
      Alert.alert("Please fill all the fields");
      return;
    }
    let transactionData: TransactionType = {
      type, 
      amount,
      description,
      category,
      date,
      walletId,
      image:image?image:null,
      uid: user?.uid,
    };
    if(oldTransaction?.id) transactionData.id = oldTransaction.id
    setLoading(true);
    const res = await createOrUpdateTransaction(transactionData);
    setLoading(false);
    if (res.success) {
      showToast(res.msg||'Transaction updated successfully', 'success')
      router.back();
    } else {
      showToast(res.msg || 'Failed to update transaction', 'error')
    }
  };
  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteTransaction(oldTransaction?.id, oldTransaction.walletId);
    setLoading(false);
    if (res.success) {
      showToast(res.msg||'Transaction deleted successfully', 'success')
      router.back();
    } else {
      showToast(res.msg || 'Failed to delete transaction', 'error')
    }
  };

const confirmDelete = () => {
  const deleteConfig = transactionConfirmations.delete(onDelete);
  showConfirmDialog(deleteConfig);
}

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Edit Transaction" : "New Transaction"}
          leftIcon={<BackButon />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Transaction Type</Typo>
            <Dropdown
              style={styles.dropdownContainer}
              selectedTextStyle={styles.dropdownSelectedText}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              activeColor={colors.green}
              iconStyle={styles.dropdownIcon}
              data={transactionTypes}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
              value={transaction.type}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet</Typo>
            <Dropdown
              style={styles.dropdownContainer}
              selectedTextStyle={styles.dropdownSelectedText}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              activeColor={colors.green}
              iconStyle={styles.dropdownIcon}
              data={wallets.map((wallet) => ({
                label: `${wallet?.name} ($${wallet?.amount})`,
                value: wallet?.id,
              }))}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value || "" });
              }}
              value={transaction.walletId}
              placeholderStyle={styles.dropdownPlaceHolder}
              placeholder={"Select Wallet"}
            />
          </View>
          {transaction.type == "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200}>Expense Category</Typo>
              <Dropdown
                style={styles.dropdownContainer}
                selectedTextStyle={styles.dropdownSelectedText}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                activeColor={colors.green}
                iconStyle={styles.dropdownIcon}
                data={Object.values(expenseCategories)}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
                value={transaction.category}
                placeholderStyle={styles.dropdownPlaceHolder}
                placeholder={"Select Category"}
              />
            </View>
          )}

          {/* DatePicker */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Date</Typo>
            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo>{(transaction.date as Date).toLocaleDateString()}</Typo>
              </Pressable>
            )}
            {showDatePicker && (
              <View style={Platform.OS == "ios" && styles.iosDatePicker}>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display={Platform.OS == "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                />
                {Platform.OS == "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={15} fontWeight={"600"} color={colors.green}>
                      OK
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Amount input */}

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Input Amount</Typo>
            <Input
              keyboardType="numeric"
              value={transaction.amount?.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>

          {/* Description */}

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200}>Description</Typo>
              <Typo color={colors.neutral500}>(optional)</Typo>
            </View>
            <Input
              value={transaction.description}
              multiline
              containerStyle={{
                flexDirection: "row",
                height: verticalScale(100),
                alignItems: "flex-start",
                paddingVertical: 15,
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200}>Receipt</Typo>
              <Typo color={colors.neutral500}>(optional)</Typo>
            </View>
            <ImageUpload
              file={transaction.image}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              onClear={() => setTransaction({ ...transaction, image: null })}
              placeholder="Upload Image"
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
          <Button
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
            onPress={confirmDelete}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            {oldTransaction?.id ? "Update" : "Add Transaction"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default transactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderWidth: 1,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  androidDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
  },
  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._15,
    paddingHorizontal: spacingX._15,
    borderCurve: "continuous",
  },
  dropdownItemText: {
    color: colors.white,
  },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    elevation: 5,
    shadowRadius: 15,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 5 },
    shadowColor: colors.black,
    borderColor: colors.neutral500,
    top: 5,
    paddingVertical: spacingY._7,
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdownPlaceHolder: {
    color: colors.white,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    paddingHorizontal: spacingX._15,
    borderCurve: "continuous",
  },
  iosDatePicker: {
    backgroundColor: "red",
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    borderRadius: radius._10,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
});
