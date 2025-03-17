import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/GlobalProvider";
import api from "@/services/api";
import endpoints from "@/services/endpoints";
import { Loader, PrimaryButton } from "@/components/ui";
import AntDesign from "@expo/vector-icons/AntDesign";
import { RefreshControl } from "react-native-gesture-handler";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TextArea from "@/components/Inputs/TextArea";
import PageTitle from "@/components/ui/PageTitle";

export default function Review() {
  const { user } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([{ id: null, rating: 0, comments: "" }]);

  const getCustomerReview = async () => {
    try {
      const response = await api.post(endpoints.Review.search, {
        search: {
          customerId: user?.id,
        },
        currentPage: 1,
        pageSize: 10,
      });

      if (response && Array.isArray(response) && response.length > 0) {
        setData(response);
      } else {
        setData([{ id: null, rating: 0, comments: "" }]);
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomerReview();
  }, []);

  const handleCustomerRating = async () => {
    setLoading(true);
    if (!data[0]?.comments) {
      Alert.alert("Error", "Please enter comments");
      return;
    }
    if (data[0]?.rating <= 0) {
      Alert.alert("Error", "Please give rating from 1 to 5");
      return;
    }
    try {
      if (data[0]?.id) {
        const resPut = await api.put(`${endpoints.Review.put}`, {
          customerId: user?.id,
          rating: data[0].rating,
          comments: data[0].comments,
          statusId: 1,
          id: data[0]?.id,
        });

        if (resPut) {
          getCustomerReview();
          Alert.alert("Success", "Thanks for your feedback");
        }
      } else {
        const resPost = await api.post(`${endpoints.Review.post}`, {
          customerId: user?.id,
          rating: data[0].rating,
          comments: data[0].comments,
          statusId: 1,
        });

        if (resPost) {
          getCustomerReview();
          Alert.alert("Success", "Thanks for your feedback");
        }
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const customerRenderStars = (rating) => {
    const maxStars = 5;
    const filledStars = Math.floor(rating);

    return (
      <View className="flex flex-row items-center justify-center gap-x-7">
        {Array.from({ length: maxStars }).map((_, index) => (
          <TouchableOpacity
            onPress={() => {
              const newData = [...data];
              if (newData[0]) {
                newData[0].rating = index + 1;
                setData(newData);
              }
            }}
            key={index}
            disabled={loading}
          >
            {index < filledStars ? (
              <Text className="text-yellow">
                <AntDesign name="star" size={48} />
              </Text>
            ) : (
              <AntDesign name="staro" size={40} color="gray" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) return <Loader isLoading={loading} />;

  return (
    <>
      <SafeAreaView className="h-full">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={getCustomerReview} />}
        >
          <ThemedView className="w-full h-full p-4">
            <PageTitle title="Feedback" />

            <View className="mt-20">
              <ThemedText className="text-3xl font-pBold text-center">Rate Your Experience</ThemedText>
              <View className="mt-5">{customerRenderStars(data[0]?.rating || 0)}</View>
              <View className="gap-4 my-10">
                <TextArea
                  label={"Comments"}
                  placeholder={"Your Review here..."}
                  value={data[0]?.comments || ""}
                  onChange={(comments) => {
                    const newData = [...data];
                    if (newData[0]) {
                      newData[0].comments = comments;
                      setData(newData);
                    }
                  }}
                />
              </View>

              <PrimaryButton title={"Submit Your Feedback"} handlePress={handleCustomerRating} />
            </View>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
