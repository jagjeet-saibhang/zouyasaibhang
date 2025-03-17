import { View, Text, TouchableOpacity } from "react-native";
import { CheckCircle, Circle } from "lucide-react-native";

const RadioButton = ({ options, selected, onSelect }) => {
  return (
    <View className="flex-row space-x-4 gap-5">
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onSelect(option.value)}
          className="flex-row space-x-2 p-2"
        >
          {selected === option.value ? (
            <CheckCircle size={24} color="#095256" /> // Selected
          ) : (
            <Circle size={24} color="#495454" /> // Unselected
          )}
          {/* <Text className="text-lg text-black ml-1">{option.label}</Text>. */}
          <Text
            className={`text-lg ml-1 ${
              selected === option.value ? "text-[#095256] font-bold" : "text-[#495454]"
            }`}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButton;
