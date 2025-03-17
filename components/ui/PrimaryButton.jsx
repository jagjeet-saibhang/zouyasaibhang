import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const PrimaryButton = ({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "text-white font-SemiBold text-xl",
  isLoading,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`rounded-full flex flex-row justify-center items-center w-full min-h-[48px] bg-primary text-white px-8 ${containerStyles} ${
        isLoading || disabled ? "opacity-50" : ""
      }`}
      disabled={isLoading || disabled}
    >
      <Text className={`${textStyles}`}>{title}</Text>

      {isLoading && <ActivityIndicator animating={isLoading} color="#fff" size="small" className="ml-2" />}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
