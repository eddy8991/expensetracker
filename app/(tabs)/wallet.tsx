import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import * as icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { WalletType } from "@/types";
import Loading from "@/components/Loading";
import WalletListItem from "@/components/WalletListItem";

const Wallet = () => {
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: wallets,
    error,
    loading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);
  console.log("wallets", wallets.length);

  const getTotalBalance = () =>
    wallets.reduce((total, item) => {
      total = total + (item.amount || 0);
      return total;
    }, 0);

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        <View style={styles.balancedView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={45} fontWeight={"500"}>
              ${getTotalBalance()?.toFixed(2)}
            </Typo>
            <Typo size={17} color={colors.neutral300}>
              Total Balance
            </Typo>
          </View>
        </View>
        <View style={styles.wallets}>
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"500"}>
              My wallets
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/walletModal")}
            >
              <icons.PlusCircle
                weight="fill"
                color={colors.primary}
                size={verticalScale(33)}
              />
            </TouchableOpacity>
          </View>
          {/* Wallets List */}
          {loading && <Loading />}
          <FlatList
            data={wallets}
            renderItem={({ item, index }) => {
              return (
                <WalletListItem item={item} index={index} router={router} />
              );
            }}
            contentContainerStyle={styles.listStyle}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balancedView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._30,
  },
  wallets: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingY._25,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
});
