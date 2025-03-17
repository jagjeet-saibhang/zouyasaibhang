import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { enumPaymentStatus, enumPaymentStatusTextColor } from "@/services/enums";
import endpoints from "@/services/endpoints";
import { RefreshControl } from "react-native-gesture-handler";
import moment from "moment";
import PageTitle from "@/components/ui/PageTitle";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TabView, SceneMap } from "react-native-tab-view";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SendEmailInvoice from "@/components/SendEmailInvoice";
import DocumentButton from "@/components/ui/DocumentButton";
import useFetchDataById from "@/hooks/useFetchDataById";
import { Loader } from "@/components/ui";
import { useGlobalContext } from "@/hooks/GlobalProvider";

const InvoiceManagement = () => {
  const scrollViewRef = useRef(null);

  const { user } = useGlobalContext();
  const { data, loading, fetchData } = useFetchDataById(
    user.userType === 3
      ? endpoints.Payment.getPaymentByCustomerIdForMobileApp
      : user.userType === 2
      ? endpoints.Payment.getPaymentByVendorIdForMobileApp
      : undefined
  );

  const [index, setIndex] = useState(0);
  const routes = Object.entries(enumPaymentStatus).map(([key, value]) => ({ key, title: value }));

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * 100, animated: true });
    }
  }, [index]);

  const renderScene = ({ route }) =>
    route.key === routes[index].key ? <MultiTabs statusId={route.key} data={data} fetchData={fetchData} loading={loading} /> : null;
  if (loading) return <Loader isLoading={loading} />;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <View className="py-4">
          <PageTitle title="Invoice Management" />
        </View>

        <CustomTabBar scrollViewRef={scrollViewRef} navigationState={{ index, routes }} setIndex={setIndex} />
        <TabView navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} renderTabBar={() => null} />
      </ThemedView>
    </SafeAreaView>
  );
};

export default InvoiceManagement;

const InvoiceCard = ({
  statusId,
  serviceRequestId,
  createdDate,
  perDayAmount,
  totalAmount,
  daysOfService,
  invoicePdfUrl,
  invoiceId,
  invoiceNo,
}) => {
  const theme = useColorScheme() ?? "light";
  // State for confirmation dialog visibility and message
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  // Handle cancel action in confirmation dialog
  const onCancel = () => {
    setConfirmationVisible(false);
  };

  return (
    <ThemedView className="p-4 shadow-md mb-4 border-b border-gray-200 w-full">
      <SendEmailInvoice
        title="Send Email Invoice"
        visible={confirmationVisible}
        message={`Send Invoice for service request no. ${invoiceNo}`}
        onCancel={onCancel}
        invoiceId={invoiceId}
      />

      <View className="flex-row justify-center items-center w-full">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push(`/request-details?requestId=${serviceRequestId}`)}
            activeOpacity={0.8}
            className="mr-4"
          >
            <View className={`w-18 h-18 bg-teal-200/30 rounded-full p-1 flex items-center justify-center`}>
              <Text className="">
                <MaterialIcons name="payments" size={40} color={enumPaymentStatusTextColor[statusId]} />
              </Text>
            </View>
          </TouchableOpacity>
          <ThemedView className="gap-1">
            <ThemedText className="font-pMedium text-lg">
              Service Days: <Text className="font-pBold">{daysOfService}</Text>
            </ThemedText>
            <ThemedText className="font-pMedium text-lg">
              Per Day: <Text className="font-pBold">₹{perDayAmount}</Text>
            </ThemedText>
            <ThemedText className="font-pMedium text-lg">
              Total: <Text className="font-pBold">₹{totalAmount}</Text>
            </ThemedText>
            <TouchableOpacity onPress={() => setConfirmationVisible(true)}>
              <Text className={`underline text-xl ${theme === "light" ? "text-primary" : "text-secondary"}`}>Email Invoice</Text>
            </TouchableOpacity>
          </ThemedView>
        </View>

        <View className="gap-2 ml-4 mr-2">
          <ThemedText className="font-pSemiBold text-base text-right">{invoiceNo}</ThemedText>
          <ThemedText className="font-pSemiBold text-base text-right">{moment(createdDate).format("DD MMM YYYY")}</ThemedText>
          <DocumentButton title={`View Invoice`} url={invoicePdfUrl} />
        </View>
      </View>
    </ThemedView>
  );
};

const MultiTabs = ({ statusId = "1", data, fetchData, loading }) => {
  return (
    <ThemedView className="mx-4 mt-4 mb-24">
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
        contentContainerStyle={{ flexGrow: 1 }}
        className="h-full"
        showsVerticalScrollIndicator={false}
      >
        {data && data.length > 0 ? (
          data.filter((d) => d.statusId === parseInt(statusId)).length > 0 ? (
            data.filter((d) => d.statusId === parseInt(statusId)).map((invoice, index) => <InvoiceCard key={index} {...invoice} />)
          ) : (
            <ThemedText className="text-center text-xl font-pSemiBold">No Record Found</ThemedText>
          )
        ) : (
          <ThemedText className="text-center text-xl font-pSemiBold">No Record Found</ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
};
const CustomTabBar = ({ scrollViewRef, navigationState, setIndex }) => {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemedView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} ref={scrollViewRef}>
        <View className="flex flex-row justify-around py-6 px-8 gap-6 w-full bg-teal-600/10">
          {navigationState.routes.map((route, i) => (
            <TouchableOpacity key={route.key} onPress={() => setIndex(i)} className="me-6">
              <Text
                className={`text-center ${
                  theme === "light"
                    ? navigationState.index === i
                      ? "underline text-primary font-pBold text-2xl"
                      : "text-xl text-black font-pSemiBold"
                    : navigationState.index === i
                    ? "underline text-secondary font-pBold text-2xl"
                    : "text-xl text-white font-pSemiBold"
                }`}
              >
                {route.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
};
