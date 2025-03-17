import { Linking } from "react-native";

export const openWhatsApp = (phoneNumber, message) => {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  Linking.openURL(url).catch((err) => console.error("An error occurred", err));
};
