import { View, ActivityIndicator, Dimensions, Platform, Image } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { images } from "@/constants";
import { useColorScheme } from "@/hooks/useColorScheme.web";
const Loader = ({ isLoading }) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;
  const theme = useColorScheme() ?? "light";
  if (!isLoading) return null;

  return (
    <ThemedView>
      <View
        className="absolute flex justify-center items-center w-full h-full "
        style={{
          height: screenHeight,
        }}
      >
        <Image source={images.logo} className="mb-20" resizeMode="contain" />
        <ThemedText className="text-3xl font-pRegular text-center">Please wait...</ThemedText>
        <ActivityIndicator animating={isLoading} color={theme === "light" ? "#000" : "#fff"} size={osName === "ios" ? "large" : 50} />
      </View>
    </ThemedView>
  );
};

export default Loader;
