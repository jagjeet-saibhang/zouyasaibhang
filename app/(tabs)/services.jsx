import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, ImageBackground, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import endpoints from "@/services/endpoints";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { Loader } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import PageTitle from "@/components/ui/PageTitle";
import useFetchDataById from "@/hooks/useFetchDataById";
import { RefreshControl } from "react-native-gesture-handler";

const Services = () => {
  const [text, setText] = useState("");
  const theme = useColorScheme() ?? "light";
  const { data, loading, fetchData } = useFetchDataById(endpoints.Service.getServiceList);

  if (loading) return <Loader isLoading={loading} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}>
        <ThemedView className="p-4 w-full h-full">
          <PageTitle title="Services" />
          <ThemedView className="flex-row items-center border border-gray-300 px-2 m-4 rounded-full">
            <ThemedText className="mb-1">
              <EvilIcons name="search" size={34} />
            </ThemedText>
            <TextInput
              className={`text-lg ml-2 ${theme === "light" ? "bg-white text-black " : "bg-[#383838] text-white"}`}
              placeholder="Search Services"
              placeholderTextColor={theme === "light" ? "#cccccc " : "#999999"}
              value={text}
              onChangeText={(newText) => setText(newText)}
            />
          </ThemedView>
          <View className="flex-row flex-wrap gap-8 p-4">
            {data && data.length === 0 ? (
              <ThemedText>No Record Found</ThemedText>
            ) : (
              data
                ?.filter((service) => service.serviceName.toLowerCase().includes(text.toLowerCase()))
                .map((service) => (
                  <ServiceBox
                    key={service.id}
                    id={service.id}
                    imageSource={service.imageUrl}
                    heading={service.serviceName}
                    subHeading="Create New Request"
                    theme={theme}
                  />
                ))
            )}
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Services;

const ServiceBox = ({ imageSource, heading, subHeading, id }) => (
  <ThemedView className="w-full min-h-28">
    <TouchableOpacity onPress={() => router.push(`/new-request?serviceId=${id}`)} activeOpacity={0.7}>
      <ThemedView className="border border-gray-300 rounded-xl flex-row items-center px-4 py-3">
        <Image source={{ uri: imageSource }} className="w-28 h-28 rounded-lg" resizeMode="cover" />
        <View className="ml-4 pl-4 border-l border-gray-300 flex-1">
          <ThemedText className="text-xl font-pSemiBold leading-tight">{heading}</ThemedText>
          <ThemedText className="text-base font-pMedium mt-1 text-gray-600 leading-tight">{subHeading}</ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  </ThemedView>
);
