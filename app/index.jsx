import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View, Dimensions, Platform, Linking } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import PrimaryLink from "@/components/ui/PrimaryLink";
import { useGlobalContext } from "@/hooks/GlobalProvider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { icons, images } from "@/constants";
import { Camera } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { openWhatsApp } from "@/services/utils";
import { Loader } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import Carousel from "react-native-reanimated-carousel";
import { openURL } from "expo-linking";
import WebView from "react-native-webview";


export default function HomeScreen({ lightColor, darkColor }) {
  const [activeTab, setActiveTab] = useState("Healthcare");

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const { loading, isLogged } = useGlobalContext();

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermissionsAsync();
    })();
  }, []);

  if (loading) return <Loader isLoading={loading} />;



  const WebViewScreen = () => {
    const injectedJavaScript = `
      setTimeout(() => {
        document.querySelector("#clientReviewSec")?.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    `;
  
    return (
      <View style={{ flex: 1 }}>
        <WebView 
          source={{ uri: "https://eldercare.co.in/" }} 
          injectedJavaScript={injectedJavaScript} 
        />
      </View>
    );
  };
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView
          className="h-full w-full"
          style={{ backgroundColor: color }}
        >
          <ScrollView>
            <ThemedView className="flex-1">
              <Header isLogged={isLogged} />
              <NavigationTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <Services />
              {activeTab === "Healthcare" && <Packages />}
              {activeTab === "About" && <Commitment />}
              {activeTab === "Testimonials" && <Testimonials />}
              {/* <Packages />
              <Commitment />
              <Testimonials /> */}
            </ThemedView>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function Header({ isLogged }) {
  return (
    <ThemedView className="p-4">
      <ThemedView className="flex flex-row justify-end">
        <PrimaryLink
          title={isLogged ? "Home" : "Login"}
          handlePress={() => {
            router.push(isLogged ? "/home" : "/sign-in");
          }}
        />
      </ThemedView>
      <ThemedText className="text-2xl text-center font-pBold">
        Welcome!
      </ThemedText>
      <ThemedView className="flex flex-row justify-around items-center mt-3">
        <TouchableOpacity onPress={() => { openURL("https://www.instagram.com/india_eldercare/") }}>
          <Image source={images.instagram} className="w-7 h-7 mx-auto" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { openURL("https://x.com/eldercare_india") }}>
          <Image source={images.twitter} className="w-8 h-8 mx-auto" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { openURL("https://eldercare.co.in/") }}>
          <Image source={images.logo} className="w-9 h-9 mx-auto" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { openURL("https://www.linkedin.com/company/eldercareindia/?viewAsMember=true") }}>
          <Image source={images.linkedin} className="w-8 h-8 mx-auto" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { openURL("https://www.facebook.com/EldercareIND/") }}>
          <Image source={images.facebook} className="w-7 h-7 mx-auto" />
        </TouchableOpacity>
      </ThemedView>
      <ThemedText className="text-xl text-center font-bold mt-2 italic">
        "To care for those who once cared for us is one of the highest honors."
      </ThemedText>
    </ThemedView>
  );
}

function NavigationTabs({ activeTab, setActiveTab }) {
  const tabs = ["Healthcare", "About", "Testimonials"];
  const theme = useColorScheme() ?? "light";
  return (
    <ScrollView horizontal>
      {tabs.map((tab, index) => (
        <ThemedView className="py-1 mx-4"
          key={index.toString()}>
          <TouchableOpacity
            key={index}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
            className="flex-1 items-center"
          >
            <Text
              className={`${theme === "light"
                ? activeTab === tab
                  ? "text-green border-b-2 border-green"
                  : "text-gray-800"
                : activeTab === tab
                  ? "text-green border-b-2 border-green"
                  : "text-white"
                } font-pSemiBold text-xl`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        </ThemedView>
      ))}
    </ScrollView>
  );
}

function Services() {
  const scrollViewRef = useRef(null);
  const scrollX = useRef(0);
  const services = [
    // { title: "Healthcare Services", image: images.servicesImg1 },
    { title: "Nursing Assistance", image: images.nursing },
    { title: "Elderly Care Services", image: images.elderly },
    { title: "Personal Home assistance", image: images.servicesImg2 },
    { title: "Ambulance and Hospitalization", image: images.ambulance },
    { title: "Legal and Financial solutions", image: images.legal },
    { title: "Property and Financial Management", image: images.property },
  ];

  const screenWidth = Dimensions.get("window").width;
  const itemWidth = screenWidth * 0.9; // Adjust based on your UI needs
  const spacing = 2; // Space between items

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        index = (index + 1) % services.length;
        scrollX.current = index * (itemWidth + spacing);
        scrollViewRef.current.scrollTo({ x: scrollX.current, animated: true });
      }
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval);
  }, [services.length]);

  return (
    <ThemedView className="mb-4 py-4">
      <ThemedText className="text-3xl font-bold mb-2 px-4">Services</ThemedText>
      <View>
        <Carousel
          width={screenWidth}
          // style={Platform.OS === 'ios' ? screenWidth: 'w-"90%"'}
          // className="h-52"
          loop
          height={screenWidth * 0.51}
          autoPlayInterval={1000}
          autoPlay
          data={services}
          renderItem={({ item: service, index }) => (
            <ThemedView
              key={index}
              className={`relative`}
              style={{
                alignSelf: 'center'
              }}
            >
              <Image source={service.image} className="w-96 h-52 rounded-lg " />
              <Text className="absolute bottom-2 left-2 text-xl font-pMedium text-white">
                {service.title}
              </Text>
            </ThemedView>
          )}
        />
      </View>
    </ThemedView>
  );
}

function Packages() {
  const packages = [
    {
      title: "Plan Basic",
      description: "12/24 Hours Home Care Assistance.",
      price: "Starting From Rs. 750 per day.",
      bgColor: "bg-red",
    },
    {
      title: "Plan Tension Free",
      description: "Basic Plan + Trained Nurse with an expertise of Nursing Care.",
      price: "Starting From Rs. 1,800 per day.",
      bgColor: "bg-yellow",
    },
    {
      title: "Plan Bindass",
      description: "Plan Tension Free + Home I.C.U.",
      price: "Starting From Rs. 25,000 per day.",
      bgColor: "bg-green",
    },
  ];

  return (
    <ThemedView>
      <TouchableOpacity
        onPress={() => Linking.openURL("tel:+917303699880")}
        className="flex flex-row items-center self-center"
      >
        <Text className="text-[#2f7e38] text-l font-pMedium mr-2">
          Call on Eldercare Number
        </Text>
        <Image source={images.call} className="w-8 h-8" />
      </TouchableOpacity>
      <ThemedView className="flex flex-row justify-between items-center mx-4 mb-2">
        <ThemedText className="text-3xl font-bold">Nursing Plans</ThemedText>
        <TouchableOpacity
          onPress={() => openWhatsApp("918448298723", "")}
          className="flex flex-row items-center"
        >
          <Text className="text-[#2f7e38] text-xl font-pMedium mr-2">
            Connect on
          </Text>
          <Image source={icons.whatsapp} className="w-12 h-12" />
        </TouchableOpacity>
      </ThemedView>
      <View className="p-4">
        {packages.map((pkg, index) => (
          <TouchableOpacity
            key={index}
            className={`${pkg.bgColor} p-4 mb-4 rounded-2xl`}
            onPress={() => router.push("/services")}
          >
            {/* Absolute Positioned Background Image */}
            <View className="absolute -top-5 left-0 w-28 h-28 opacity-50 z-0 rounded-2xl">
              <Image
                source={images.home_box_bg}
                resizeMode="contain"
                className="w-full h-full rotate-180"
              />
            </View>
            <View>
              <Text className={`text-white text-xl font-pSemiBold`}>
                {pkg.title}
              </Text>
              <Text className="text-white text-lg my-2">{pkg.description}</Text>
              <Text className="text-white text-xl font-pMedium">
                {pkg.price}
              </Text>
            </View>
            {/* Absolute Positioned Background Image */}
            <View className="absolute -bottom-5 right-0 w-28 h-28 opacity-50 z-0">
              <Image
                source={images.home_box_bg}
                resizeMode="contain"
                className="w-full h-full"
              />
            </View>
          </TouchableOpacity>
        ))}
        <View className={`bg-blue mb-4 rounded-2xl p-4`}>
          {/* Absolute Positioned Background Image */}
          <View className="absolute -top-5 left-0 w-28 h-28 opacity-50 z-0 ">
            <Image
              source={images.home_box_bg}
              resizeMode="contain"
              className="w-full h-full rotate-180"
            />
          </View>
          <Text className={`text-white text-xl font-pSemiBold`}>
            Per Visit Charges For Care Buddy
          </Text>
          <View className="flex flex-row justify-between my-2">
            <Text className="text-white text-lg">0-2 Hours</Text>
            {/* <Text className="text-white text-xl font-pMedium">₹500</Text> */}
            <Text className="text-white text-xl font-pMedium">Rs. 500</Text>
          </View>
          <View className="flex flex-row justify-between my-2">
            <Text className="text-white text-lg">2-5 Hours</Text>
            <Text className="text-white text-xl font-pMedium">Rs.700</Text>
          </View>
          <View className="flex flex-row justify-between">
            <Text className="text-white text-lg">For Full Day ( 7 Hours )</Text>
            <Text className="text-white text-xl font-pMedium">Rs.1000</Text>
          </View>
          {/* Absolute Positioned Background Image */}
          <View className="absolute -bottom-5 right-0 w-28 h-28 opacity-50 z-0">
            <Image
              source={images.home_box_bg}
              resizeMode="contain"
              className="w-full h-full"
            />
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

function Commitment() {
  const commitments = [
    "“Welcome to Eldercare, where we dedicate ourselves to enhancing the quality of life for elders through compassionate, reliable, and personalized Wellness Assistance. Our mission is to empower seniors to live with dignity, independence, and joy by providing comprehensive support tailored to their unique needs.",
    "With a team of experienced healthcare professionals and caregivers, we specialize in offering a range of services, including Senior Citizen Care Taker Services, medical assistance, wellness programs, and emotional support. At the heart of our work is a commitment to building meaningful relationships and creating a safe, nurturing environment for our clients and their families.",
    "We understand the importance of trust and care in Wellness Assistance, and we strive to deliver excellence with every interaction. Whether you need support for daily activities, chronic condition management, or companionship, we are here to make every step of your journey easier and more fulfilling.”",
    "At Eldercare, we don’t just provide services—we create connections that matter. Because for us, every elder deserves a life filed with respect, happiness, and the best care possible.",
  ];

  return (
    <ThemedView className="p-4 mx-4">
      {/* <ThemedText className="text-3xl font-pSemiBold mb-2">
      Re-Imagine Elder Care for your loved ones
      </ThemedText> */}
      <Text className="m-4 italic text-red text-center font-bold">
        "Re-imagine Elder Care for your loved ones"
      </Text>
      <ThemedView>
        {commitments.map((commitment, index) => (
          <View key={index} className="text-gray-600 flex-row items-center">
            {/* <Text className="text-red text-4xl mt-1">•</Text> */}
            <ThemedText className="text-lg mt-2 font-pMedium">{commitment}</ThemedText>
          </View>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

function Testimonials() {
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  // 
  const testimonials = [
    {
      name: "Mrs. Pandey",
      location: "Delhi",
      text: "Mrs Pandey is a cancer survivor who lives by herself. A wife of an Indian Air force officer who lost her husband some years ago. She goes for her weekly chemotherapy sessions to Max hospital and also makes regular trips to Research and Referral Army hospital to see her primary care physician.With no family support system left and her health declining due to frailty and dependence she chose Eldercare services.",
    },
    {
      name: "Mr. Roy",
      location: "Delhi",
      text: "Mr Roy is a retired eminent scientist. He lives with his wife while his two daughters live in Germany.He retired as a Senior advisor (seed) National Cooperative Federation of India, Vice President KSL ( Product Research and Development), Maharashtra, UNIDO International Consultant, Malawi, Africa, and Consultant to various organisations in India and abroad. His entire life's research work suddenly came to a grinding halt 9years back upon his retirement. With a mind as sharp and brilliant as his at this age,we at Eldercare felt he has still a lot to offer for the betterment of human race.",
    },
    {
      name: "Mrs. & Mr. Sikka",
      location: "Delhi",
      text: "Mr Sikka has various properties across Delhi. Left alone by themselves they find it difficult to manage their investments , property management as well as the security and safety of their current home. Despite 5-6 domestic workers they deal with stress of paying their bills and other day to day running of home affairs plus an added burden of managing the staff at home.",
    },
    {
      name: "Mrs. Kohli",
      location: "Delhi",
      text: "Caring for a loved one with stroke can be taxing physically, mentally and emotionally. They require extensive rehabilitation in order to regain the ability to speak, and control their basic motor skills. Mrs Kohli is recovering from stroke . She stays with her daughter who is working full time. She used to go to the hospital 5days a week for neuro physiotherapy.",
    },
    {
      name: "Mr. Piramal",
      location: "New Jersy, USA",
      text: "Mr Piramal bought a property in the year 2009 in upmarket Noida from a prominent builder. He never got possession of the said property despite repeated reminders and visits to India. The legal team at Eldercare served a notice to the builder and forced the builder to come to the negotiation table. The long pending issue has been resolved and the property has been handed over to the client.",
    },
    {
      name: "Mrs. & Mr. Batra",
      location: "Ludhiyana",
      text: "The death of a parent create feelings of vulnerability and a huge sense of loss. It also leaves one with strong feelings of longing - a need to have a parent around forever to share our future accomplishments and offer support in our times of need. When Mr Batra arrived from London to do the final rites for his mother he was overwhelmed with her loss . We ensured that he was given enough time and space to grieve and not really be bogged down by other formalities. Eldercare took over and helped in conducting all the ceremonies for the final journey of his mother without having him to even worry about getting a DC from the authorities and other legal documents.",
    },
    // {
    //   name: "Mrs. Kohli",
    //   location: "Delhi",
    //   text: "",
    // },
  ];
  // Function to toggle expand/collapse
  const toggleExpand = (index) => {
    setExpandedIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index) // Collapse if already expanded
        : [...prev, index] // Expand if collapsed
    );
  };
  return (
    <ThemedView className="mb-24">
      <View className="p-4 w-full">
        <ThemedText className="text-3xl font-bold mb-2 ">
          Testimonials
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* {testimonials.map((testimonial, index) => (
            <View className="flex-1 w-96" key={index}>
              <View className="p-2">
                <FontAwesome6 name="quote-left" size={44} color="#66BAA1" />
                <ThemedText className="text-gray-700 text-base font-pMedium text-justify leading-8"
                numberOfLines={4}
                onTextLayout={(e) => setShowMore(e.nativeEvent.lines.length > 4)}>
                  {testimonial.text} 
                </ThemedText>
                <TouchableOpacity onPress={() => toggleExpand(index)}>
                <Text className="text-blue-500">
                  {isExpanded ? "Read Less" : "Read More..."}
                </Text>
              </TouchableOpacity>

                <ThemedText className="mt-2 text-right text-gray-500 text-base">
                  {testimonial.name}
                </ThemedText>
                <ThemedText className="mt-2 text-right text-gray-500 text-base">
                  {testimonial.location}
                </ThemedText>
                <ThemedText className="mt-4 text-center">
                  <View className="flex-row items-center justify-center gap-0.5 ">
                    <Text className="text-[12px] font-ppMedium text-center">See our testimonial here,</Text>
                    <TouchableOpacity onPress={() => { openURL("https://eldercare.co.in/gallery/") }}>
                      <Text className="text-[12px] font-ppMedium text-center color-blue">Testimonials</Text>
                    </TouchableOpacity>
                  </View>
                </ThemedText>
              </View>
            </View>
          ))} */}
          {testimonials.map((testimonial, index) => {
            const isExpanded = expandedIndexes.includes(index);
            return (
              <View className="flex-1 w-96 p-2" key={index}>
                <FontAwesome6 name="quote-left" size={44} color="#66BAA1" />
                <Text
                  className="text-gray-700 text-base font-pMedium text-justify leading-6"
                  numberOfLines={isExpanded ? undefined : 4}
                >
                  {testimonial.text}
                </Text>

                <TouchableOpacity
                  // onPress={() => toggleExpand(index)}
                  // onPress={() => {
                  //   if (!isExpanded) {
                  //     Linking.openURL("https://eldercare.co.in/#clientReviewSec");
                  //   } else {
                  //     toggleExpand(index);
                  //   }
                  // }}
                  onPress={() => Linking.openURL("https://eldercare.co.in/#clientReviewSec")}

                  

                >
                  <Text className="text-blue font-pMedium text-base text-right">
                    {isExpanded ? "Read Less" : "Read More..."}
                  </Text>
                </TouchableOpacity>

                <Text className="mt-2 text-right text-gray-500 text-base">
                  {testimonial.name}
                </Text>
                <Text className="mt-2 text-right text-gray-500 text-base">
                  {testimonial.location}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </ThemedView>
  );
}
