import { Stack } from "expo-router";
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[requestId]"
        options={{ title: "Request-Details", headerShown: false }}
      />
    </Stack>
  );
};

export default Layout;
