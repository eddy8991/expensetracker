import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { BarChart } from "react-native-gifted-charts";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/authContext";
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from "@/services/transactionService";
import TransactionList from "@/components/TransactionList";

const Statistics = () => {

  const { user } = useAuth();


  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [chartLoding, setChartLoding] = useState(false)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    if(activeIndex === 0){
      getWeeklyStats()
    }
    if(activeIndex === 1){
      getMonthlyStats()
    }
    if(activeIndex === 2){
      getYearlyStats()
    }
  }, [activeIndex]);

  const getWeeklyStats = async () => {
    setChartLoding(true)
    let res = await fetchWeeklyStats(user?.uid as string)
    setChartLoding(false)
    if(res.success){
      setChartData(res?.data?.stats)
      setTransactions(res?.data?.transactions)
    }else{
      Alert.alert('Error', res.msg)
    }
  }
  const getMonthlyStats = async () => {
    setChartLoding(true)
    let res = await fetchMonthlyStats(user?.uid as string)
    setChartLoding(false)
    if(res.success){
      setChartData(res?.data?.stats)
      setTransactions(res?.data?.transactions)
    }else{
      Alert.alert('Error', res.msg)
    }

  }
  const getYearlyStats = async () => {
    setChartLoding(true)
    let res = await fetchYearlyStats(user?.uid as string)
    setChartLoding(false)
    if(res.success){
      setChartData(res?.data?.stats)
      setTransactions(res?.data?.transactions)
    }else{
      Alert.alert('Error', res.msg)
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Statistics" />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
        >
          <SegmentedControl
            values={["weekly", "monthly", "yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance="dark"
            activeFontStyle={styles.segmentFontStyle}
            style={styles.segmentStyle}
            fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
          />
          <View style={styles.chartContainer}>
            {chartData.length > 0 ? (
              <BarChart
                barWidth={scale(12)}
                spacing={[1,2].includes(activeIndex) ? scale(25): scale(16)}
                data={chartData}
                roundedBottom
                roundedTop
                hideRules
                yAxisLabelPrefix="$"
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisLabelWidth={[1,2].includes(activeIndex) ? scale(30):scale(25)}
                yAxisTextStyle={{color:colors.neutral350}}
                xAxisLabelTextStyle={{
                  color: colors.neutral350,
                  fontSize: verticalScale(10)
                }}
                noOfSections={3}
                minHeight={5}
                // isAnimated={true}
                // animationDuration={1000}
                // maxValue={100}
              />
            ) : (
              <View style={styles.noChart}></View>
            )}

            {
              chartLoding && (
                <View style={styles.chartLoadingContainer}>
                  <Loading color={colors.white}/>
                </View>
              )
            }
          </View>
          {/* Transactions List */}
          <TransactionList
            title="Transactions"
            emptyListMessage="No transactions found"
            data={transactions}
            />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black,
  },
  segmentStyle: {
    height: scale(37),
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous",
  },
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "#00000099",
  },
  header: {},
  noChart: {
    backgroundColor: "#00000099",
    height: verticalScale(210),
  },
});
