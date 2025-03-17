import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Text } from "react-native";

export default function PickerSelect({ items = [], label, placeholder, value = null, required = false, onChange = () => {} }) {
  const theme = useColorScheme() ?? "light";

  // Ensure items are formatted correctly
  const validItems = Array.isArray(items) ? items.filter((item) => item?.label && item?.value) : [];

  return (
    <>
      <ThemedText className="text-sm font-pRegular ml-3 mt-2">
        Select {label}
        {required && <Text className="text-red text-lg">*</Text>}
      </ThemedText>
      <ThemedView className="p-4 min-h-14 rounded-full border border-[#C1C1C1] focus:border-secondary w-full">
        <RNPickerSelect
          onValueChange={(value) => onChange(value)}
          items={validItems}
          placeholder={{
            label: placeholder || "Select",
            value: "",
            color: "gray",
          }}
          style={{
            inputAndroid: {
              color: theme === "light" ? "#000" : "#fff",
              margin: -14,
            },
            inputIOS: {
              color: theme === "light" ? "#000" : "#fff",
              margin: -14,
            },
          }}
          value={value}
        />
      </ThemedView>
    </>
  );
}
