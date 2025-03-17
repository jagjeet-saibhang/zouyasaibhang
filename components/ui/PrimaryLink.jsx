import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const PrimaryLink = ({
  title,
  handlePress,
  containerStyles = "min-h-[18px]",
  textStyles = "text-green font-pSemiBold text-2xl",
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`flex flex-row justify-center items-center ${containerStyles} ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading}
    >
      <Text className={`${textStyles}`}>{title}</Text>

      {isLoading && <ActivityIndicator animating={isLoading} color="#fff" size="small" className="ml-2" />}
    </TouchableOpacity>
  );
};

export default PrimaryLink;
