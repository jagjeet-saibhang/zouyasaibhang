import { Link } from "expo-router";
import { Text } from "react-native";

export default function DesignDevelop() {
  return (
    <Text className="text-sm font-pRegular text-gray-700 text-center">
      Design & Developed by{" "}
      <Link href="https://www.saibhang.io" className="underline text-blue-800">
        saibhang.io
      </Link>
    </Text>
  );
}
