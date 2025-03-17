import { TextInput, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme.web";

export default function TextArea({ label = "", placeholder = "", value = "", onChange = null, numberOfLines = 4, required = false }) {
  const color = useColorScheme() ?? "light";
  return (
    <>
      <ThemedText className="text-sm font-pRegular ml-3 -mb-3">
        {label} {required && <Text className="text-red text-lg">*</Text>}
      </ThemedText>
      <View className={`w-full rounded-xl`}>
        <TextInput
          className={`p-4 rounded-3xl text-lg border border-[#C1C1C1] focus:border-secondary ${
            color === "light" ? "bg-white text-black " : "bg-[#383838] text-white"
          }`}
          placeholder={placeholder}
          placeholderTextColor="#c9c9c9"
          value={value}
          onChangeText={onChange}
          multiline={true}
          numberOfLines={numberOfLines}
          textAlignVertical="top" // Aligns text to the top for multiline input
          style={{
            minHeight: 80,
            textAlignVertical: "top",
          }}
        />
      </View>
    </>
  );
}
