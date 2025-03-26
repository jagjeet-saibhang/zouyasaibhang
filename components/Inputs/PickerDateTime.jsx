// import React, { useState } from "react";
// import { Text, TouchableOpacity } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { ThemedText } from "../ThemedText";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import moment from "moment";
// import { ThemedView } from "../ThemedView";
// import { useColorScheme } from "@/hooks/useColorScheme";

// export default function PickerDateTime({ placeholder, value = null, label, onChange, required = false, minimumDate = null }) {
//   const theme = useColorScheme() ?? "light";

//   const [show, setShow] = useState(false);

//   // Convert value from ISO 8601 to timestamp for the DateTimePicker
//   const parsedValue = value ? new Date(value).getTime() : new Date().getTime();
//   const minDate = minimumDate ? new Date(minimumDate).getTime() : null;

//   const handleInputChange = (e) => {
//     if (e.type === "set") {
//       const selectedTimestamp = e.nativeEvent.timestamp;
//       const selectedDate = new Date(selectedTimestamp);

//       // Set time to 00:00:00.000 UTC
//       selectedDate.setUTCHours(0, 0, 0, 0);

//       // Convert to ISO string
//       const normalizedISO = selectedDate.toISOString();

//       // Call onChange with the ISO string
//       onChange(normalizedISO);
//     }
//     setShow(false);
//   };

//   return (
//     <ThemedView className={`w-full`}>
//       <ThemedText className={`text-sm font-pRegular ml-3 mb-1`}>
//         {label} {required && <Text className="text-red text-lg">*</Text>}
//       </ThemedText>
//       <TouchableOpacity
//         onPress={() => setShow(true)}
//         title={`Select ${label}`}
//         className="flex flex-row items-center px-4 py-3 rounded-full border border-[#C1C1C1] focus:border-secondary w-full"
//       >
//         {show ? (
//           <DateTimePicker
//             testID="datePicker"
//             mode={"date"}
//             value={new Date(parsedValue)}
//             is24Hour={true}
//             onChange={handleInputChange}
//             dateFormat="DD-MMM-YYYY"
//             minimumDate={minDate}
//             themeVariant="light"
//             textColor="red"
//           />
//         ) : (
//           <ThemedText
//             className={`${value ? "font-pRegular px-1" : "px-1"}  text-lg`}
//             style={value ? { color: theme === "light" ? "#000" : "#fff" } : { color: "#c9c9c9" }}
//           >
//             {value ? moment(value).format("DD-MMM-YYYY") : `Select ${placeholder}`}
//           </ThemedText>
//         )}
//         <Text className={`flex-1 text-right ${theme === "light" ? "text-primary" : "text-secondary"}`}>
//           <Ionicons name="calendar" size={28} />
//         </Text>
//       </TouchableOpacity>
//     </ThemedView>
//   );
// }

import React, { useState } from "react";
import { Text, TouchableOpacity, Platform, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "../ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";
import { ThemedView } from "../ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function PickerDateTime({
  placeholder,
  value = null,
  label,
  onChange,
  required = false,
  minimumDate = null,
}) {
  const theme = useColorScheme() ?? "light";
  const [show, setShow] = useState(false);

  const parsedValue = value ? new Date(value) : new Date();
  const minDate = minimumDate ? new Date(minimumDate) : null;

  const handleInputChange = (event, selectedDate) => {
    if (selectedDate) {
      selectedDate.setUTCHours(0, 0, 0, 0);
      onChange(selectedDate.toISOString());
    }
    setShow(false);
  };

  return (
    <ThemedView className={`w-full`}>
      <ThemedText className={`text-sm font-pRegular ml-3 mb-1`}>
        {label} {required && <Text className="text-red text-lg">*</Text>}
      </ThemedText>
      <TouchableOpacity
        onPress={() => setShow(true)}
        title={`Select ${label}`}
        className="flex flex-row items-center px-4 py-3 rounded-full border border-[#C1C1C1] focus:border-secondary w-full"
      >
        <ThemedText
          className={`${value ? "font-pRegular px-1" : "px-1"} text-lg`}
          style={
            value
              ? { color: theme === "light" ? "#000" : "#fff" }
              : { color: "#c9c9c9" }
          }
        >
          {value
            ? moment(value).format("DD-MMM-YYYY")
            : `Select ${placeholder}`}
        </ThemedText>
        <Text
          className={`flex-1 text-right ${
            theme === "light" ? "text-primary" : "text-secondary"
          }`}
        >
          <Ionicons name="calendar" size={28} />
        </Text>
      </TouchableOpacity>

      {show && (
        <View className="items-center">
          <ThemedText className="text-center text-lg font-pBold mt-2 bg-red-500">
            Calendar
          </ThemedText>
          <DateTimePicker
            testID="datePicker"
            mode="date"
            value={parsedValue}
            is24Hour={true}
            onChange={handleInputChange}
            minimumDate={minDate}
            themeVariant="light"
            display={Platform.OS === "ios" ? "inline" : "spinner"}
          />
        </View>
      )}
    </ThemedView>
  );
}
