import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Platform, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { enumServiceRequestStatusForCustomer, enumServiceRequestStatusForVendor } from "@/services/enums";
import useFetchDataWithSearch from "@/hooks/useFetchDataWithSearch";
import endpoints from "@/services/endpoints";
import { RefreshControl } from "react-native-gesture-handler";
import moment from "moment";
import useFetchDataById from "@/hooks/useFetchDataById";
import PageTitle from "@/components/ui/PageTitle";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TabView, SceneMap } from "react-native-tab-view";
import { useGlobalContext } from "@/hooks/GlobalProvider";

const Requests = () => {
  const { user } = useGlobalContext();

  const scrollViewRef = useRef(null);
  const [index, setIndex] = useState(0);
  const routes = Object.entries(user.userType === 3 ? enumServiceRequestStatusForCustomer : enumServiceRequestStatusForVendor).map(
    ([key, value]) => ({ key, title: value })
  );

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * 100, animated: true });
    }
  }, [index]);

  const renderScene = ({ route }) => (route.key === routes[index].key ? <RequestsTab statusId={route.key} /> : null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <PageTitle title="Requests" />

        <CustomTabBar scrollViewRef={scrollViewRef} navigationState={{ index, routes }} setIndex={setIndex} />
        <TabView navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} renderTabBar={() => null} />
        {user.userType === 3 && (
          <View className="absolute bottom-0 w-96 left-1/2 -translate-x-1/2 p-4">
            <NewRequestButton />
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
};

export default Requests;

const ServiceCard = ({ statusId, id, perDayAmount, fromDate, toDate, idNumberStr, serviceName, vendorStaffName, imageUrl }) => {
  const { user } = useGlobalContext();
  return (
    <ThemedView className="p-4 rounded-3xl shadow-md mb-4 border border-gray-200">
      <TouchableOpacity
        onPress={
          statusId === 1 ? null : user.userType === 3 && statusId === 2 ? null : () => router.push(`/request-details?requestId=${id}`)
        }
        activeOpacity={0.8}
      >
        <View className="flex-row items-center">
          <View className={`w-20 h-20`}>
            <Image
              source={imageUrl ? { uri: `${imageUrl}?timestamp=${new Date().getTime()}` } : images.request_img}
              className="w-full h-full rounded-full"
            />
          </View>
          <View>
            <View className="ml-3 flex-row">
              <ThemedText className="font-pSemiBold text-lg">{serviceName}</ThemedText>
              <ThemedText className="mx-2 text-sm"> {vendorStaffName && "|"} </ThemedText>
              <ThemedText className="font-pSemiBold text-sm">{vendorStaffName}</ThemedText>
            </View>
            <ThemedText className="ml-3 font-pSemiBold text-base">{idNumberStr}</ThemedText>
            <View className="ml-3 flex-row">
              <ThemedText className="text-base">{moment(fromDate).format("DD MMM YYYY")} </ThemedText>
              <ThemedText className="mx-2 text-base">to</ThemedText>
              <ThemedText className="text-base">{moment(toDate).format("DD MMM YYYY")}</ThemedText>
            </View>
            <ThemedText className="flex-row ml-3 font-p-Regular">
              Per Day Amount: <ThemedText className="font-pBold text-lg">₹{perDayAmount && perDayAmount}</ThemedText>
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    </ThemedView>
  );
};

const RequestsTab = ({ statusId = "1" }) => {
  const theme = useColorScheme() ?? "light";
  const { user } = useGlobalContext();
  const osName = Platform.OS;
  const additionalPayload = {
    statusId: statusId,
    customerId: user.userType === 3 ? user.id : undefined,
    vendorId: user.userType === 2 ? user.id : undefined,
  };
  const { data, loading, fetchData } = useFetchDataWithSearch(
    statusId !== "1" ? endpoints.ServiceRequest.getServiceRequestListForMobileApp : undefined,
    additionalPayload
  );

  const {
    data: serviceRequestList,
    loading: serviceRequestListLoading,
    fetchData: serviceRequestListFetchData,
  } = useFetchDataById(statusId === "1" ? endpoints.ServiceRequest.getServiceRequestForMobileApp : undefined);

  const handleRefetch = () => {
    if (statusId === "1") {
      serviceRequestListFetchData();
    } else {
      fetchData();
    }
  };
  const isLoading = statusId === "1" ? serviceRequestListLoading : loading;
  if (isLoading) {
    return (
      <ThemedView className="mx-4 mt-4 mb-24">
        <ThemedText className="text-3xl font-pRegular text-center">Please wait...</ThemedText>
        <ActivityIndicator animating={isLoading} color={theme === "light" ? "#000" : "#fff"} size={osName === "ios" ? "large" : 50} />
      </ThemedView>
    );
  }
  const services = statusId === "1" ? serviceRequestList : statusId !== "1" ? data : null;
  return (
    <ThemedView className="mx-4 mt-4 mb-24">
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefetch} />}
        contentContainerStyle={{ flexGrow: 1 }}
        className="h-full"
        showsVerticalScrollIndicator={false}
      >
        {services && services.length > 0 ? (
          services.map((service, index) => <ServiceCard key={index} {...service} />)
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
        <View className="flex flex-row justify-around py-3 px-8 gap-6 w-full bg-teal-600/10">
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

const NewRequestButton = () => {
  return (
    <TouchableOpacity
      className="rounded-full flex flex-row justify-center items-center w-full min-h-[48px] bg-white text-primary px-8 border-gray-500/25 shadow border-2"
      onPress={() => router.push("/services")}
    >
      <Entypo name="plus" size={24} color="#43AA8B" />
      <Text className="text-[#43AA8B] font-pSemiBold text-xl">New Request</Text>
    </TouchableOpacity>
  );
};
