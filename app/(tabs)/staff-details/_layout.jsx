import { Stack } from "expo-router";
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="[staffId]" options={{ title: "Staff-Details", headerShown: false }} />
    </Stack>
  );
};

export default Layout;
