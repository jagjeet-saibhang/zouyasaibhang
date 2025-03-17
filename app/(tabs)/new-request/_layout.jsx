import { Stack } from "expo-router";
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="[serviceId]" options={{ title: "new-request", headerShown: false }} />
    </Stack>
  );
};

export default Layout;
