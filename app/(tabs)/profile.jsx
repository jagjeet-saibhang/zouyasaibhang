import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import InputText from "@/components/Inputs/InputText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ProfileImg from "@/assets/images/profileDoddle.png";
import { Loader, PrimaryButton } from "@/components/ui";
import usePostData from "@/hooks/usePostData";
import endpoints from "@/services/endpoints";
import { useGlobalContext } from "@/hooks/GlobalProvider";
import useFetchDataById from "@/hooks/useFetchDataById";
import { enumGender } from "@/services/enums";
import { renderInputFields } from "@/components/Inputs/renderInputFields";
import usePutData from "@/hooks/usePutData";
import { RefreshControl } from "react-native-gesture-handler";
import { ThemedText } from "@/components/ThemedText";
import PageTitle from "@/components/ui/PageTitle";
import CustomConfirmation from "@/components/CustomConfirmation";
import api from "@/services/api";
// import NewCalendar from "@/components/Inputs/Calendar";

const inputFields = [
  { placeholder: "First Name", label: "First Name", key: "firstName" },
  { placeholder: "Last Name", label: "Last Name", key: "lastName" },
  {
    placeholder: "Email",
    label: "Email",
    key: "email",
    keyboardType: "email-address",
  },
  {
    placeholder: "Phone No",
    label: "Phone No",
    key: "phoneNo",
    keyboardType: "phone-pad",
    editable: false,
  },
  {
    placeholder: "D.O.B",
    label: "D.O.B",
    key: "dateOfBirth",
    type: "date",
    minimumDate: "1900-01-01",
  },
  {
    placeholder: "Gender",
    key: "gender",
    type: "radio",
    items: Object.entries(enumGender).map(([key, value]) => ({
      label: value,
      value: parseInt(key),
    })),
  },
  {
    placeholder: "Address",
    label: "Address",
    key: "address",
    type: "textarea",
  },
  { placeholder: "City", label: "City", key: "city" },
  { placeholder: "State", label: "State", key: "state" },

  // { placeholder: "Country", label: "Country", key: "country" }, //commented out because not in backend
  {
    placeholder: "Pincode",
    label: "Pincode",
    key: "pinCode",
    keyboardType: "numeric",
  },
];

const vendorDocs = [
  {
    placeholder: "Aadhar Card",
    label: "Aadhar Card",
    key: "aadharCardDocFile",
    type: "file",
  },
  {
    placeholder: "Pan Card",
    label: "Pan Card",
    key: "panCardDocFile",
    type: "file",
  },
  {
    placeholder: "Police Verification",
    label: "Police Verification",
    key: "policeVerificationDocFile",
    type: "file",
  },
];

const venderCompanyInformation = [
  {
    placeholder: "Company Name",
    label: "Company Name",
    key: "companyName",
    keyboardType: "textarea",
    required: true,
  },
  {
    placeholder: "Company Pan",
    label: "Company Pan",
    key: "companyPanCardDocFile",
    type: "file",
  },
  {
    placeholder: "Incorporation Certificate",
    label: "Incorporation Certificate",
    key: "companyIncorporationCertificateFile",
    type: "file",
  },
  {
    placeholder: "GST Certificate",
    label: "GST Certificate",
    key: "companyGstCertificationFile",
    type: "file",
  },
];

const venderCompanyBankInfo = [
  {
    placeholder: "Bank Name",
    label: "Bank Name",
    key: "bankName",
    keyboardType: "textarea",
    // required: true,
  },
  {
    placeholder: "IFSC Code",
    label: "IFSC Code",
    key: "ifscCode",
    keyboardType: "textarea",
    // required: true,
  },
  {
    placeholder: "Branch Name",
    label: "Branch Name",
    key: "bankBranch",
    keyboardType: "textarea",
  },
  {
    placeholder: "Account Number",
    label: "Account Number",
    key: "accountNo",
    keyboardType: "textarea",
  },
];

const doctorDetails = [
  {
    placeholder: "Doctor Name",
    label: "Doctor Name 1",
    key: "doctorName",
    keyboardType: "textarea",
    required: true,
  },
  {
    placeholder: "Doctor Mobile Number 1",
    label: "Doctor Mobile Number 1",
    key: "doctorNo",
    keyboardType: "numeric",
    required: true,
  },
  {
    placeholder: "Doctor Name 2",
    label: "Doctor Name 2",
    key: "doctorName2",
    keyboardType: "textarea",
  },
  {
    placeholder: "Doctor Mobile Number 2",
    label: "Doctor Mobile Number 2",
    key: "doctorNo2",
    keyboardType: "numeric",
  },
];
const relativeDetails = [
  {
    placeholder: "Realative Name 1",
    label: "Realative Name 1",
    key: "relativeName1",
    keyboardType: "textarea",
    required: true,
  },
  {
    placeholder: "Realative No 1",
    label: "Realative No 1",
    key: "relativeNo1",
    keyboardType: "numeric",
    required: true,
  },
  {
    placeholder: "Realative Name 2",
    label: "Realative Name 2",
    key: "relativeName2",
    keyboardType: "textarea",
    // required: true,
  },
  {
    placeholder: "Realative No 2",
    label: "Realative No 2",
    key: "relativeNo2",
    keyboardType: "numeric",
  },
];

const emergencyContacts = [
  {
    placeholder: "Ambulance No",
    label: "Ambulance No",
    key: "ambulanceNo",
    keyboardType: "numeric",
  },
  {
    placeholder: "Hopital No",
    label: "Hospital No",
    key: "hospitalNo",
    keyboardType: "numeric",
  },
];

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const { user, handleLogout } = useGlobalContext();
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  // Show confirmation dialog
  const showConfirmation = () => setConfirmationVisible(true);

  const endpointInfo =
    user.userType == 2 ? endpoints.Vendor.get : endpoints.Customer.get;

  const endpoint =
    user.userType === 2
      ? endpoints.Vendor.put
      : endpoints.CustomerEmergencyContact.post;

  const endpointDelete =
    user.userType == 2 ? endpoints.Vendor.delete : endpoints.Customer.delete;
  const {
    data: userDetails,
    loading: userLoading,
    fetchData: fetchUser,
  } = useFetchDataById(`${endpointInfo}${user.id}`);
  console.log("-------", user.id);
  // console.log("user.cityId", user.cityId);
  console.log("userDetails", userDetails);

  const [form, setForm] = useState({});

  const deleteUser = async () => {
    const response = await api.delete(`${endpointDelete}${user.id}`);
    if (response === true) {
      handleLogout();
    }
    return response;
  };

  const handleInputChange = (key, value) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: key === "gender" ? parseInt(value) : value,
    }));
  };

  useEffect(() => {
    if (userDetails) {
      // Create a copy of userDetails with null values replaced by empty strings
      const updatedFormData = Object.fromEntries(
        Object.keys(userDetails).map((key) => {
          if (key === "gender") {
            return [key, parseInt(userDetails[key])];
          }
          const value = userDetails[key];
          return [key, value !== null && value !== undefined ? value : ""];
        })
      );
      setForm(updatedFormData);
    }
  }, [userDetails]);

  const { isSaving, postRequest } = usePostData();

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   try {
  //     const payload = { ...form, id: user.id };

  //     console.log("user", user);

  //     const response = await postRequest(endpoint, payload);

  //     console.log("response---", response);

  //     if (!response) {
  //       Alert.alert("Error", "No response from server. Please try again.");
  //       return;
  //     }
  //     if (response?.success) {
  //       console.log("Updated successfully");
  //     } else {
  //       const errorMessage =
  //         response?.validationErrors?.length > 0
  //           ? response.validationErrors.join("\n")
  //           : "Data is not updated.";
  //       Alert.alert("Error", errorMessage);
  //       console.log("errorMessage", errorMessage);
  //     }
  //   } catch (error) {
  //     console.error("Error in update:", error);
  //     Alert.alert("Error", "Something went wrong. Please try again later.");
  //   }
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 300);
  // };

  // const handleInputChange = (key, value) => {
  //   setForm((prevState) => ({
  //     ...prevState,
  //     [key]: key === "gender" ? parseInt(value) : value,
  //   }));
  // };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // const payload = {
      //   ...form,
      //   id: user.id,
      //   name: form.doctorName || "",
      //   number: form.doctorNo || "",
      //   remarks: "",
      //   statusId: user.userType,
      // };
      let payload = {
        ...form,
        id: userDetails.id,
        name: form.doctorName || "",
        number: form.doctorNo || "",
        remarks: "",
        statusId: user.userType,
      };

      if (user.userType === 2) {
        payload = {
          ...form,
          id: userDetails.id,
          statusId: user.userType,
          cityId: userDetails.cityId,
        };
      }

      const response = await postRequest(endpoint, payload);

      console.log("API Response:", response);

      if (!response) {
        Alert.alert("Error", "No response from server. Please try again.");
        return;
      }
      if (response?.success) {
        console.log("Updated successfully");
      } else {
        const errorMessage =
          response?.validationErrors?.length > 0
            ? response.validationErrors.join("\n")
            : "Data is not updated.";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Error in update:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  const onCancel = () => {
    setConfirmationVisible(false);
  };

  // Handle confirm action in confirmation dialog
  const onConfirm = async () => {
    setLoading(true);
    await deleteUser();
    setLoading(false);
    setConfirmationVisible(false);
  };
  const clickLogout = () => {
    setConfirmationMessage("Are you sure you want to Delete your account?");
    showConfirmation();
  };
  if (userLoading || loading) {
    return <Loader isLoading={userLoading || loading} />;
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={userLoading} onRefresh={fetchUser} />
        }
      >
        <ThemedView className="p-4">
          <PageTitle title="Profile" />
          {/* Profile Image Section */}
          <View className="mt-8 items-center">
            <Image
              source={ProfileImg} // Replace with url image URL
              className="w-32 h-32 rounded-full relative"
              resizeMode="cover"
            />
            {/* <View className="absolute right-36 bottom-0">
              <Text className="text-primary">
                <FontAwesome name="pencil-square" size={28} />
              </Text>
            </View> */}
          </View>

          {/* Form Section */}
          <View className="gap-2 mt-8">
            <View className="gap-4 flex-wrap flex-row border-b pb-4 border-gray-200">
              {renderInputFields(inputFields, form, handleInputChange)}
              {/* {inputFields.map((field) =>
                field.key === "dateOfBirth" ? (
                  <NewCalendar
                    key={field.key}
                    selectedDate={form.dateOfBirth}
                    onDateSelect={(date) =>
                      handleInputChange("dateOfBirth", date)
                    }
                  />
                ) : (
                  renderInputFields([field], form, handleInputChange)
                )
              )} */}
            </View>
            {/* user.userType == 2 */}
            {user.userType == 2 ? (
              <>
                <View className="gap-4 flex-wrap flex-row pb-4 ml-4">
                  {renderInputFields(vendorDocs, form, handleInputChange)}
                </View>

                <View className="mt-4">
                  <ThemedText className="text-2xl">
                    Company Information
                  </ThemedText>
                  <View className="gap-4 flex-wrap flex-row border-b pb-4 border-gray-200">
                    {renderInputFields(
                      venderCompanyInformation,
                      form,
                      handleInputChange
                    )}
                  </View>
                </View>

                <View className="mt-4">
                  <ThemedText className="text-2xl">Bank Information</ThemedText>
                  <View className="gap-4 flex-wrap flex-row border-b pb-4 border-gray-200">
                    {renderInputFields(
                      venderCompanyBankInfo,
                      form,
                      handleInputChange
                    )}
                  </View>
                </View>
              </>
            ) : (
              <View className="mt-3">
                <ThemedText className="text-2xl">
                  Personal Emergency Contacts
                </ThemedText>
                <ThemedText className="text-xl my-5">
                  <MaterialCommunityIcons
                    className="ml-10"
                    name="doctor"
                    size={22}
                  />{" "}
                  Doctor Contacts
                </ThemedText>

                <View className="gap-4 flex-wrap flex-row pb-4">
                  {renderInputFields(doctorDetails, form, handleInputChange)}
                </View>

                <ThemedText className="text-xl my-5">
                  <MaterialCommunityIcons
                    className="ml-10"
                    name="home-city-outline"
                    size={22}
                  />{" "}
                  Relative Contacts
                </ThemedText>
                <View className="gap-4 flex-wrap flex-row pb-4">
                  {renderInputFields(relativeDetails, form, handleInputChange)}
                </View>
                <View className="gap-4 flex-wrap flex-row pb-4">
                  {renderInputFields(
                    emergencyContacts,
                    form,
                    handleInputChange
                  )}
                </View>
              </View>
            )}
            <View className="mt-4">
              <PrimaryButton
                title="Update"
                handlePress={handleSubmit}
                isLoading={isSaving}
              />
            </View>
            <CustomConfirmation
              title="Delete"
              visible={confirmationVisible}
              message={confirmationMessage}
              onCancel={onCancel}
              onConfirm={onConfirm}
            />
            <View className="mt-4">
              <PrimaryButton
                title="Delete"
                handlePress={clickLogout}
                isLoading={isSaving}
                containerStyles="bg-red"
              />
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
