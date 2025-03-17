import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import PageTitle from "@/components/ui/PageTitle";
import { ThemedText } from "@/components/ThemedText";

const BulletPoint = ({ text }) => {
  return (
    <ThemedView className="flex flex-row  mt-2">
      {/* <Entypo name="dot-single" size={40} color="text-primary" /> */}
            <Text className="text-primary text-4xl mt-0, px-4 align-center justify center">•</Text>

      <View className="w-80">
        <ThemedText className="text-xl font-bold">{text}</ThemedText>
      </View>
    </ThemedView>
  );
};

const texts = [
  "“Welcome to Eldercare, where we dedicate ourselves to enhancing the quality of life for elders through compassionate, reliable, and personalized Wellness Assistance. Our mission is to empower seniors to live with dignity, independence, and joy by providing comprehensive support tailored to their unique needs.",
  "With a team of experienced healthcare professionals and caregivers, we specialize in offering a range of services, including Senior Citizen Care Taker Services, medical assistance, wellness programs, and emotional support. At the heart of our work is a commitment to building meaningful relationships and creating a safe, nurturing environment for our clients and their families.",
  "We understand the importance of trust and care in Wellness Assistance, and we strive to deliver excellence with every interaction. Whether you need support for daily activities, chronic condition management, or companionship, we are here to make every step of your journey easier and more fulfilling.”",
  "At Eldercare, we don’t just provide services—we create connections that matter. Because for us, every elder deserves a life filed with respect, happiness, and the best care possible.",
];

const About = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
        <ThemedView className="p-4 w-full h-full">
          <PageTitle title="About" />
          <ThemedText className="text-2xl font-bold ml-2 mt-10 mb-8">We are committed to...</ThemedText>

          {texts.map((text, index) => (
            <BulletPoint text={text} key={index} />
          ))}

          <Text className="text-xl font-pSemiBold text-red text-center mx-4 mt-8">"Re-imagine Elder Care for your loved ones"</Text>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
