import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView, Alert, Text, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { Loader, PrimaryButton } from "@/components/ui";
import endpoints from "@/services/endpoints";
import { ThemedText } from "@/components/ThemedText";
import PageTitle from "@/components/ui/PageTitle";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { renderInputFields } from "@/components/Inputs/renderInputFields";
import { useGlobalContext } from "@/hooks/GlobalProvider";
import api from "@/services/api";
import usePostData from "@/hooks/usePostData";
import useDeleteDataById from "@/hooks/useDeleteDataById";
import { RefreshControl } from "react-native-gesture-handler";
import CustomConfirmation from "@/components/CustomConfirmation";

const inputFields = [
  { placeholder: "Name", label: "Name", key: "name" },
  {
    placeholder: "Phone No",
    label: "Phone No",
    key: "number",
    keyboardType: "numeric",
  },
];

const InfoCard = ({ name, number, onDelete, deleting }) => {
  const handleCall = () => {
    // Check if the number is valid
    if (!number) {
      Alert.alert("Error", "Phone number is not available.");
      return;
    }

    // Use Linking to open the phone dialer
    Linking.openURL(`tel:${number}`)
      .then(() => console.log("Calling..."))
      .catch((err) => {
        Alert.alert("Error", "Unable to make a call.");
        console.error("Error making call:", err);
      });
  };
  return (
    <ThemedView className="flex-row justify-between items-center border border-gray-300 px-4 py-2 rounded-xl">
      <TouchableOpacity onPress={handleCall}>
        <View>
          <ThemedText className="text-xl font-pSemiBold">{name}</ThemedText>
          <ThemedText className="text-xl font-pSemiBold">{number}</ThemedText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8} onPress={deleting ? null : onDelete} className="p-2">
        <Text className="text-red border border-red rounded-full p-1">
          <MaterialIcons name="delete" size={24} />
        </Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

const SoS = () => {
  const { user } = useGlobalContext();
  const { deleteRecord, deleting } = useDeleteDataById();

  // State for confirmation dialog visibility and message
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInputFields, setShowInputFields] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Show confirmation dialog
  const showConfirmation = (id) => {
    setSelectedId(id);
    setConfirmationMessage("Are you sure you want to delete this contact?");
    setConfirmationVisible(true);
  };

  // Handle cancel action in confirmation dialog
  const onCancel = () => {
    setConfirmationVisible(false);
  };

  // Handle confirm action in confirmation dialog
  const onConfirm = async () => {
    if (selectedId) {
      try {
        await deleteRecord(`${endpoints.CustomerEmergencyContact.delete}${selectedId}`);
        await fetchCustomerContactDetails(user?.id);
      } catch (error) {
        Alert.alert("Error", "Failed to delete contact.");
      }
      setSelectedId(null);
    }
    setConfirmationVisible(false);
  };

  const [form, setForm] = useState({
    name: "",
    number: "",
  });
  const handleInputChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [emergencyContactData, setEmergencyContactData] = useState(null);

  useEffect(() => {
    const customerId = user?.id;
    fetchCustomerContactDetails(customerId);
  }, []);
  const fetchCustomerContactDetails = async (id) => {
    setLoading(true);
    try {
      const response = await api.post(endpoints.CustomerEmergencyContact.search, {
        search: { customerId: id },
        currentPage: 1,
        pageSize: 100,
        sortField: "name",
        sortOrder: "asc",
      });
      if (response) {
        setEmergencyContactData(response);
      } else {
        setEmergencyContactData(null);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const { isSaving, postRequest } = usePostData();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        number: form.number,
        remarks: "add marks",
        statusId: 1,
      };
      const res = await postRequest(endpoints.CustomerEmergencyContact.post, payload);
      if (res.success) {
        setForm({});
        setEmergencyContactData();
        setShowInputFields(false);
        fetchCustomerContactDetails(user?.id);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchCustomerContactDetails(user?.id)} />}
      >
        <CustomConfirmation
          title="Logout"
          visible={confirmationVisible}
          message={confirmationMessage}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
        <ThemedView className="p-4 w-full h-full">
          <PageTitle title={showInputFields ? "Add New Contact" : "Emergency Contacts"} />
          {!showInputFields && (
            <View className="m-4 flex-row justify-end text-center">
              <PrimaryButton title={"Add New Emergency Contact"} handlePress={() => setShowInputFields(true)} />
            </View>
          )}

          {/* input field section  */}
          {showInputFields ? (
            <>
              <View className="my-8 flex flex-wrap gap-4">{renderInputFields(inputFields, form, handleInputChange)}</View>
              <PrimaryButton title="Submit" handlePress={handleSubmit} isLoading={isSaving} />
              <PrimaryButton
                title={"Cancel"}
                handlePress={() => setShowInputFields(false)}
                isLoading={isSaving}
                containerStyles="min-h-[48px] bg-red text-white px-8 mt-4"
              />
            </>
          ) : (
            <View className="mt-4 gap-2">
              {emergencyContactData && emergencyContactData.length > 0 ? (
                emergencyContactData.map((contact) => (
                  <InfoCard
                    key={contact.id}
                    name={contact.name}
                    number={contact.number}
                    onDelete={() => showConfirmation(contact.id)}
                    deleting={deleting}
                  />
                ))
              ) : (
                <ThemedText>No emergency contacts found.</ThemedText>
              )}
            </View>
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SoS;
