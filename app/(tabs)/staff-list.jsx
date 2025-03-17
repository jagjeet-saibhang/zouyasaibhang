import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import useFetchDataWithSearch from "@/hooks/useFetchDataWithSearch";
import endpoints from "@/services/endpoints";
import { RefreshControl } from "react-native-gesture-handler";
import moment from "moment";
import PageTitle from "@/components/ui/PageTitle";
import { useColorScheme } from "@/hooks/useColorScheme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { enumCommonStatus, enumCommonStatusTextColor } from "@/services/enums";
import { Loader, PrimaryButton } from "@/components/ui";
import { useGlobalContext } from "@/hooks/GlobalProvider";
import { EvilIcons } from "@expo/vector-icons";
import { useState } from "react";

const StaffList = () => {
  const { user } = useGlobalContext();
  const theme = useColorScheme() ?? "light";
  const additionalPayload = {
    vendorId: user.id,
  };
  const { data, loading, payload, handlePayloadChange, fetchData } = useFetchDataWithSearch(
    endpoints.VendorStaff.getVendorStaffListForMobileApp,
    additionalPayload
  );
  const [text, setText] = useState("");
  const staffCOunt = data?.length;
  if (loading) return <Loader isLoading={loading} />;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1 p-4">
        <View className="py-4">
          <PageTitle title="Staff Management" />
        </View>
        <View className="flex-row items-center w-full">
          {staffCOunt ? (
            <View className="flex-row items-center text-justify gap-2 rounded-full border border-gray-300 px-4 py-1 bg-secondary">
              <Text className="text-center font-pMedium text-lg text-white">{`Total Staff Members`}</Text>
              <Text className="text-center font-pMedium text-lg text-white">{staffCOunt}</Text>
            </View>
          ) : (
            <View></View>
          )}

        </View>
        <ThemedView className="flex-row items-center border border-gray-300 px-2 mt-4 rounded-full">
          <ThemedText className="mb-1">
            <EvilIcons name="search" size={34} />
          </ThemedText>
          <TextInput
            className={`text-lg ml-2 ${theme === "light" ? "bg-white text-black " : "bg-[#383838] text-white"}`}
            placeholder="Search by Name"
            placeholderTextColor={theme === "light" ? "#cccccc " : "#999999"}
            value={text}
            onChangeText={(newText) => setText(newText)}
          />
        </ThemedView>
        <ThemedView className="mx-4 mt-4 mb-24">
          <ScrollView
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
            contentContainerStyle={{ flexGrow: 1 }}
            className="h-full"
            showsVerticalScrollIndicator={false}
          >
            {data && data.length > 0 ? (
              data
                ?.filter((d) => d.firstName.toLowerCase().includes(text.toLowerCase()))
                .map((data, index) => <StaffCard key={index} {...data} />)
            ) : (
              <ThemedText className="text-center text-xl font-pSemiBold">No Record Found</ThemedText>
            )}
          </ScrollView>
        </ThemedView>
      </ThemedView>
      <ThemedView>
      <View style={{ width: "49%", alignSelf: 'center', justifyContent: 'flex-end', margin:10 }}>
          <PrimaryButton handlePress={() => router.push(`/add-staff`)} title={"Add New"} />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};

export default StaffList;
const StaffCard = ({ statusId, id, idNumberStr, imageUrl, serviceName, joiningDate, firstName, lastName }) => {
  return (
    <TouchableOpacity onPress={() => router.push(`/staff-details?staffId=${id}`)} activeOpacity={0.8}>
      <ThemedView className="py-1 px-2 shadow-md mb-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <View className="flex-col items-center justify-center">
            <View className={`w-20 h-20`}>
              <Image
                source={imageUrl ? { uri: `${imageUrl}?timestamp=${new Date().getTime()}` } : images.request_img}
                className="w-full h-full rounded-full"
              />
            </View>
            <ThemedText className="font-pRegular">{idNumberStr}</ThemedText>
          </View>

          <ThemedView className="gap-1">
            <ThemedText className="font-pSemiBold text-xl">{firstName + " " + lastName}</ThemedText>
            <ThemedText className="font-pMedium text-lg">{serviceName}</ThemedText>
            <ThemedText className="font-pRegular text-base">DOJ: {moment(joiningDate).format("DD MMM YYYY")}</ThemedText>
          </ThemedView>
          <View className="flex-col items-center gap-2">
            <Text className="text-secondary">
              <FontAwesome6 name="edit" size={24} />
            </Text>
            <ThemedText>Status</ThemedText>
            <ThemedText style={{ color: enumCommonStatusTextColor[statusId] }}>{enumCommonStatus[statusId]}</ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};
