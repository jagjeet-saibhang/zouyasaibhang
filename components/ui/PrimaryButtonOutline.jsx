import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const PrimaryButtonOutline = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`rounded-xl min-h-[48px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "bg-primary" : "border-primary border-2"
      }`}
      disabled={isLoading}
    >
      <Text className={`font-pSemiBold text-lg ${textStyles} ${isLoading ? "text-white" : "text-primary"}`}>{title}</Text>

      {isLoading && <ActivityIndicator animating={isLoading} color="#fff" size="small" className="ml-2" />}
    </TouchableOpacity>
  );
};

export default PrimaryButtonOutline;
