import { Text, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemedView } from "../ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
export default function RadioButtons({ placeholder, value = null, onChange, items, required = false }) {
  const theme = useColorScheme() ?? "light";
  return (
    <View className={`w-full mb-2`}>
      <ThemedText className="text-xl font-pMedium mb-2 ml-2">
        Select {placeholder} {required && <Text className="text-red text-lg">*</Text>}
      </ThemedText>
      <ThemedView className="flex-row items-center gap-2">
        {items?.map((item, index) => (
          <TouchableOpacity key={index} className="flex-row items-center ml-4 my-1" onPress={() => onChange(item.value)}>
            <Text
              className={`${
                theme === "light"
                  ? item.value === value
                    ? "text-primary font-pSemiBold"
                    : "text-gray-600"
                  : item.value === value
                  ? "text-secondary font-pSemiBold"
                  : "text-[#C1C1C1]"
              }`}
            >
              {item.value === value ? <FontAwesome name="dot-circle-o" size={28} /> : <FontAwesome name="circle-o" size={26} />}
            </Text>
            <Text
              className={`ml-1 text-xl ${
                theme === "light"
                  ? item.value === value
                    ? "text-primary font-pSemiBold"
                    : "text-gray-600"
                  : item.value === value
                  ? "text-secondary font-pSemiBold"
                  : "text-[#C1C1C1]"
              }`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </View>
  );
}
