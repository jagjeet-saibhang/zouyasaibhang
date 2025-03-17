import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useGlobalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Loader, PrimaryButton } from "@/components/ui";
import PageTitle from "@/components/ui/PageTitle";
import useFetchDataById from "@/hooks/useFetchDataById";
import endpoints from "@/services/endpoints";
import moment from "moment";
import { RefreshControl } from "react-native-gesture-handler";
import { enumCommonStatus, enumCommonStatusTextColor, enumGender } from "@/services/enums";
import { renderInputFields } from "@/components/Inputs/renderInputFields";
import usePutData from "@/hooks/usePutData";
import { images } from "@/constants";

const step1InputFields = [
  {
    placeholder: "Image",
    label: "Profile Image",
    key: "imageFile",
    name: "imageFileName",
    type: "captureFile",
  },
  {
    placeholder: "First Name",
    label: "First Name",
    key: "firstName",
  },
  {
    placeholder: "Last Name",
    label: "Last Name",
    key: "lastName",
  },
  {
    placeholder: "Mobile Number",
    label: "Mobile Number",
    key: "phoneNo",
  },
  {
    placeholder: "Email",
    label: "Email",
    key: "email",
    keyboardType: "email",
  },
  {
    placeholder: "Date of Birth",
    label: "Date of Birth",
    key: "dateOfBirth",
    type: "date",
  },
  {
    placeholder: "Gender",
    key: "gender",
    type: "radio",
    items: Object.entries(enumGender).map(([key, value]) => ({ label: value, value: parseInt(key) })),
  },
  {
    placeholder: "Date of Joining",
    label: "Date of Joining",
    key: "joiningDate",
    type: "date",
  },
  {
    placeholder: "Address",
    label: "Address",
    key: "address",
    type: "textarea",
  },
  {
    placeholder: "City",
    label: "City",
    key: "city",
  },
  {
    placeholder: "State",
    label: "State",
    key: "state",
  },
  {
    placeholder: "Country",
    label: "Country",
    key: "country",
  },
  {
    placeholder: "PIN Code",
    label: "PIN Code",
    key: "pinCode",
  },
  {
    placeholder: "Height",
    label: "Height",
    key: "height",
    keyboardType: "numeric",
  },
  {
    placeholder: "Weight",
    label: "Weight",
    key: "weight",
    keyboardType: "numeric",
  },
  {
    placeholder: "Experience",
    label: "Experience",
    key: "experience",
    keyboardType: "numeric",
  },
  {
    placeholder: "Qualification",
    label: "Qualification",
    key: "qualification",
  },
  {
    placeholder: "Qualification Certificate",
    label: "Qualification Certificate",
    key: "qualificationCertificateDocFile",
    name: "qualificationCertificateDocFileName",
    type: "file",
  },
  {
    placeholder: "Aadhar Card",
    label: "Aadhar Card",
    key: "aadharCardDocFile",
    name: "aadharCardDocFileName",
    type: "file",
  },
  {
    placeholder: "Police Verification",
    label: "Police Verification",
    key: "policeVerificationDocFile",
    name: "policeVerificationDocFileName",
    type: "file",
  },
];

const StaffDetails = () => {
  const { staffId } = useGlobalSearchParams();

  const { data, loading, fetchData, setLoading } = useFetchDataById(staffId ? `${endpoints.VendorStaff.get}${staffId}` : undefined);

  const [formData, setFormdata] = useState({});

  useEffect(() => {
    if (staffId && data) {
      setFormdata(data);
    } else {
      setFormdata({});
    }
    setLoading(false);
  }, [data]);

  const handleInputChange = (key, value) => {
    setFormdata((prevState) => ({ ...prevState, [key]: value }));
  };

  const { isSaving, postRequest } = usePutData();

  const handleSubmit = async () => {
    try {
      // Post the details
      const res = await postRequest(endpoints.VendorStaff.put, formData);

      if (res) {
        setFormdata({}); // Reset form data
        router.push("/staff-list");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred"); // Show error alert
    }
  };

  if (loading) return <Loader isLoading={loading} />;
  if (!data)
    return (
      <SafeAreaView className="flex-1">
        <ThemedText className="text-xl text-center font-pSemiBold pt-4">No Record Found</ThemedText>
      </SafeAreaView>
    );
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView className="w-full h-full flex-1 py-4">
          <PageTitle title={`Update ${formData?.firstName || "Staff"}'s Details`} />
          <ThemedText className="font-pMedium text-xl text-center mt-2">Staff ID: {data?.idNumberStr}</ThemedText>
          <ThemedText className="font-pMedium text-xl text-center mb-2">
            <Text>
              Status:
              <Text style={{ color: enumCommonStatusTextColor[data?.statusId] }} className="font-pSemiBold underline px-1">
                {enumCommonStatus[data?.statusId]}
              </Text>
            </Text>
          </ThemedText>

          <View className="gap-4 mx-4 flex-wrap flex-row">
            {data?.imageUrl && <Image source={{ uri: data?.imageUrl }} className="w-32 h-32 rounded-full self-center" resizeMode="cover" />}
            {renderInputFields(step1InputFields, formData, handleInputChange, setFormdata)}
          </View>

          <Text>
            <View className="p-4 mb-4 gap-4 w-full items-center">
              <PrimaryButton title={"Submit"} handlePress={handleSubmit} isLoading={isSaving} />

              <PrimaryButton
                title="Cancel"
                handlePress={() => {
                  setFormdata({});
                  router.push("/staff-list");
                }}
                containerStyles="min-h-[48px] bg-red text-white px-8"
              />
            </View>
          </Text>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StaffDetails;
