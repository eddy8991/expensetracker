import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors, spacingY } from "@/constants/theme";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButon from "@/components/BackButon";
import Input from "@/components/Input";
import { TransactionType,} from "@/types";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import TransactionList from "@/components/TransactionList";

const searchModal = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [search, setSearch] = useState("");


  const constraints = [
      where("uid", "==", user?.uid),
      orderBy("date", "desc"),
      limit(30),
    ];
  
    const {
      data: allTransactions,
      error,
      loading: transactionsLoading,
    } = useFetchData<TransactionType>("transactions", constraints);
  
  const filteredTransactions = allTransactions.filter((item) => {
    if(search.length > 1){
      if(
        item.category?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.type?.toLowerCase()?.includes(search?.toLowerCase())||
        item.description?.toLowerCase()?.includes(search?.toLowerCase())
      ){
        return true
      }
      return false
    }
    return true
  })

  return (
    <ModalWrapper style={{backgroundColor:colors.neutral900}}>
      <View style={styles.container}>
        <Header
          title={"Search"}
          leftIcon={<BackButon />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Search"
              placeholderTextColor={colors.neutral400}
              value={search}
              onChangeText={(value) => setSearch( value )}
              containerStyle={{backgroundColor:colors.neutral800}}
            />
          </View>
          <View>
            <TransactionList
              loading={transactionsLoading}
              data={filteredTransactions}
              emptyListMessage="No transactions found!  "
            />
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default searchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  inputContainer: {
    gap: spacingY._10,
  },

});
