import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Loader } from "@/components/ui";
import { useGlobalContext } from "@/hooks/GlobalProvider";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader isLoading={false} />
      <StatusBar backgroundColor="#000000" style="light" />
    </>
  );
};

export default AuthLayout;
