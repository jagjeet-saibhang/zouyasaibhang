import { TextInput, Text } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme.web";

export default function InputText({
  label = "",
  placeholder = "",
  value = "",
  onChange = null,
  keyboardType = "default",
  required = false,
  className = "",
  style = {},
  editable = true,
}) {
  const color = useColorScheme() ?? "light";
  
  return (
    <>
      <ThemedText className="text-sm font-pRegular ml-3 mt-2">
        {label}
        {required && <Text className="text-red text-lg">*</Text>}
      </ThemedText>
      <ThemedView className={`w-full rounded-full`}>
        <TextInput
          className={`p-4 rounded-full text-lg font-pRegular border border-[#C1C1C1] focus:border-secondary ${
            color === "light"
              ? "bg-white text-black "
              : "bg-[#383838] text-white"
          }`  + className}
          placeholder={placeholder}
          placeholderTextColor="#c9c9c9"
          value={value ? String(value) : null}
          onChangeText={onChange}
          keyboardType={keyboardType}
          secureTextEntry={placeholder?.includes("password") ? true : false}
          style={style}
          editable={editable}
        />
      </ThemedView>
    </>
  );
}
