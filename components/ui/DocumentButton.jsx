import { Alert, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

export default function DocumentButton({ title, url = null }) {
  const handlePress = async () => {
    if (!url) {
      Alert.alert("Error", "No document URL provided.");
      return;
    }

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Cannot open this document.");
    }
  };
  return (
    <ThemedView className="rounded-full border border-slate-200">
      <TouchableOpacity activeOpacity={0.7} className="p-2" onPress={url ? handlePress : null} disabled={!url}>
        <ThemedView className={`flex-row items-center ${!url ? "opacity-50" : ""}`}>
          <Ionicons name="document" size={20} color="#43AA8B" />
          <ThemedText className={`text-black text-lg ${!url ? "line-through" : ""}`}>{title}</ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
}
