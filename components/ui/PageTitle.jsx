import { View, TouchableOpacity } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StatusBar } from "expo-status-bar";
import { useThemeColor } from '@/hooks/useThemeColor';

export default function PageTitle({ title = "" }) {
  const router = useRouter(); // Use hook instead of direct import
  const canGoBack = router.canGoBack();

  const handleGoBack = () => {
    if (canGoBack) {
      router.back();
    }
  };
  const backgroundColor = useThemeColor({ light: 'white', dark: 'black' }, 'background');
  return (
    <ThemedView className="flex-row items-center justify-between h-[55px] border-b-[1px] border-gray-300">
      <StatusBar backgroundColor={backgroundColor}/>
      <View>
        {/* {canGoBack && (
          <TouchableOpacity className="flex-row items-center py-2 pl-4 -mr-8" onPress={handleGoBack} activeOpacity={0.8}>
            <ThemedText>
              <FontAwesome5 name="chevron-left" size={32} />
            </ThemedText>
          </TouchableOpacity>
        )} */}
      </View>
      <View className="flex-1 flex-nowrap">
        <ThemedText className="text-2xl  font-pSemiBold text-center">{title}</ThemedText>
      </View>
    </ThemedView>
  );
}
