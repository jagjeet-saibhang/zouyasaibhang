import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useGlobalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { Loader, PrimaryButton } from "@/components/ui";
import { ThemedText } from "@/components/ThemedText";
import usePostData from "@/hooks/usePostData";
import endpoints from "@/services/endpoints";
import { useGlobalContext } from "@/hooks/GlobalProvider";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import useFetchDataById from "@/hooks/useFetchDataById";
import { renderInputFields } from "@/components/Inputs/renderInputFields";
import PageTitle from "@/components/ui/PageTitle";
import { validateRequiredFields } from "@/components/Inputs/validateRequiredFields";
import { newServiceRequestStep1, newServiceRequestStep2, } from "@/services/formFields";
import api from "@/services/api";
import RadioButton from "@/components/ui/RadioButtons";

const ServiceRequest = () => {
  const { user } = useGlobalContext();
  const { serviceId } = useGlobalSearchParams();
  const { data, fetchData } = useFetchDataById(endpoints.Service.getServiceList);

  const initialFormData = {
    requestFor: 1,
    serviceId: serviceId,
    experience: "",
    regionId: "",
    stateId: "",
    cityId: "",
    fromDate: "",
    toDate: "",
    duration: 1,
    statusId: "",
    firstName: "",
    lastName: "",
    age: 0,
    height: "",
    weight: "",
    medicalHistory: "",
    currentHealthIssue: "",
    instruction: "",
    relation: "", 
  };

  const RelationEnum = {
    FATHER: { label: "Father", value: 1 },
    MOTHER: { label: "Mother", value: 2 },
    SON: { label: "Son", value: 3 },
    DAUGHTER: { label: "Daughter", value: 4 },
    HUSBAND: { label: "Husband", value: 5 },
    WIFE: { label: "Wife", value: 6 },
    BROTHER: { label: "Brother", value: 7 },
    SISTER: { label: "Sister", value: 8 },
    GRANDFATHER: { label: "Grandfather", value: 9 },
    GRANDMOTHER: { label: "Grandmother", value: 10 },
  };
  
  const { data: regionData, loading: regionLoading } = useFetchDataById(serviceId ? endpoints.Region.getRegionList : undefined);
  const { isSaving, postRequest } = usePostData();
  // console.log("=====", regionData)
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormdata] = useState(initialFormData);
  const [updatedFormStep1, setUpdatedFormStep1] = useState(newServiceRequestStep1);

  const [selectedValue, setSelectedValue] = useState("1");

  const options = [
    { label: "Self", value: "1" },
    { label: "Other", value: "2" },
  ];

  
  // Separate states for dropdown lists
  const [regionList, setRegionList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  // Update region list when data is fetched
  useEffect(() => {
    if (regionData) {
      setRegionList(regionData.map(({ name, id }) => ({ label: name, value: id })));
    }
    // console.log("=====", regionData)
  }, [regionData]);

  // Fetch states when region changes
  useEffect(() => {
    const fetchStates = async () => {
      if (formData.regionId) {
        setStateList([]);
        try {
          const res = await api.post(endpoints.State.getStateListByRegionId, { regionId: formData.regionId });
          setStateList(res.map((state) => ({ label: state.name, value: state.id })));
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchStates();
  }, [formData.regionId]);

  const { data: serviceData, loading: serviceLoading } = useFetchDataById(endpoints.Service.getServiceList);
  useEffect(() => {

    if (serviceData) {
      setUpdatedFormStep1((prevData) =>
        prevData.map((field) => {
          if (field.key === "serviceId") {
            return {
              ...field,
              items: serviceData.map((item) => ({
                label: item.serviceName,
                value: item.id,
              })),
            };
          }
          return field; // Return the field for other cases
        })
      );
    }
  }, [serviceData]);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (formData.stateId) {
        setCityList([]);
        try {
          const res = await api.post(endpoints.City.getCityListByStateId, { stateId: formData.stateId });
          setCityList(res.map((city) => ({ label: city.name, value: city.id })));
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchCities();
  }, [formData.stateId]);

  // Update form fields dynamically based on fetched lists
  useEffect(() => {
    setUpdatedFormStep1((prevData) =>
      prevData.map((field) => {
        if (field.key === "regionId") return { ...field, items: regionList };
        if (field.key === "stateId") return { ...field, items: stateList };
        if (field.key === "cityId") return { ...field, items: cityList };
        return field;
      })
    );
  }, [regionList, stateList, cityList]);


  const handleInputChange = (key, value) => {
    setFormdata((prevState) => ({ ...prevState, [key]: value }));
  };

  const relationOptions = Object.values(RelationEnum); // Convert object to array


  const handleSubmit = async () => {
    const emptyFieldsStep1 = validateRequiredFields(
      newServiceRequestStep1,
      formData
    );
    const emptyFieldsStep2 = validateRequiredFields(
      newServiceRequestStep2,
      formData
    );

    if (emptyFieldsStep1.length > 0) {
      Alert.alert(
        "Validation Error",
        `The following fields are required: ${emptyFieldsStep1.join(", ")}`
      );
      return;
    }
    if (emptyFieldsStep2.length > 0) {
      Alert.alert(
        "Validation Error",
        `The following fields are required: ${emptyFieldsStep2.join(", ")}`
      );
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        relation: formData.relation,
        serviceId,
        customerId: user.id,
        statusId: 1,
        requestFor: formData?.requestFor,
        nurseCategory: formData?.nurseCategory,
        experience: formData?.experience,
        fromDate: formData?.fromDate,
        toDate: formData?.toDate,
        duration: formData?.duration,
        vendorId: "00000000-0000-0000-0000-000000000000",
        vendorStaffId: "00000000-0000-0000-0000-000000000000",
        cityId: formData?.cityId,
        paymentId: "00000000-0000-0000-0000-000000000000",
        "customerMedicalHistory": {
          "firstName": formData.firstName,
          "lastName": formData.lastName,
          "age": formData.age,
          "height": formData.height,
          "weight": formData.weight,
          "medicalHistory": formData.medicalHistory,
          "currentHealthIssue": formData.currentHealthIssue,
          "instruction": formData.instruction,
          "statusId": 0
        }
      };
console.log("+++++++++",formData)
      const res = await postRequest(endpoints.ServiceRequest.post, payload);
      if (res?.success) {
        setFormdata(initialFormData);
        router.push("/requests");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!serviceId) {
    return (
      <SafeAreaView className="flex-1">
        <ThemedView>
          <ThemedText className="text-center text-xl font-pSemiBold p-4">
            Service ID not found
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (loading || regionLoading) {
    return <Loader isLoading={loading || regionLoading} />;
  }



  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ThemedView className="w-full h-full">

          <View className="mt-4">
            <PageTitle title="Request Service" />
           
            {/* Step Indicators */}
            <View className="flex-row  justify-center mt-4 px-4">
              <StepIndicator
                step="1"
                label="Service Info"
                isActive={activeStep === 1}
                onPress={() => {
                  setLoading(true);
                  setActiveStep(1);
                  setTimeout(() => {
                    setLoading(false);
                  }, 300);
                }}
              />
              <View className="w-[20%] h-1 bg-[#DADADA] mx-2 mt-4" />
              <StepIndicator
                step="2"
                label="Personal Info"
                isActive={activeStep === 2}
                onPress={() => {
                  setLoading(true);
                  setActiveStep(2);
                  setTimeout(() => {
                    setLoading(false);
                  }, 300);
                }}
              />
            </View>

            <View className="px-6 gap-2">
              <Text className="text-black font-pSemiBold text-xl mt-6 ">Select Request for</Text>
              <RadioButton
                options={options}
                selected={selectedValue}
                onSelect={setSelectedValue}
              />
              {selectedValue === "2" && (
                <View className="gap-2 flex-wrap flex-row mt-4">
                  {renderInputFields(
                    [{ placeholder: "Relation", label: "Relation", key: "Relation", type: "select", items:relationOptions }],
                    formData,
                    handleInputChange
                  )}
                </View>
              )}
            </View>

            <View className="px-6 mt-6">
              {activeStep === 1 && (
                <View className="gap-4 flex-wrap flex-row">
                  {renderInputFields(
                    updatedFormStep1,
                    formData,
                    handleInputChange,
                    data
                  )}
                </View>
              )}
              {activeStep === 2 && (
                <View className="gap-4 mt-4 flex-wrap flex-row">
                  {renderInputFields(
                    newServiceRequestStep2,
                    formData,
                    handleInputChange
                  )}
                </View>
              )}
            </View>

          </View>

          <View className="m-4">
            {activeStep === 1 && (
              <PrimaryButton
                title="Next"
                handlePress={() => {
                  const emptyFields = validateRequiredFields(
                    updatedFormStep1,
                    formData
                  );
                  if (emptyFields.length > 0) {
                    Alert.alert(
                      "Validation Error",
                      `The following fields are required: ${emptyFields.join(
                        ", "
                      )}`
                    );
                    return;
                  }
                  setActiveStep(2);
                }}
                isLoading={loading}
              />
            )}
            {activeStep === 2 && (
              <PrimaryButton
                title="Submit"
                handlePress={handleSubmit}
                isLoading={isSaving}
              />
            )}

          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceRequest;

const StepIndicator = ({ step, label, isActive, onPress }) => (
  <TouchableOpacity className="items-center" onPress={onPress}>
    <Text
      className={`text-center text-xl pt-0.5 rounded-full w-8 h-8 flex items-center justify-center ${isActive ? "bg-[#C33149] text-white" : "bg-[#DADADA] text-black"
        }`}
    >
      {step}
    </Text>
    <ThemedText
      className={`text-xl mt-2 ${isActive ? "font-pBold" : "font-pMedium"}`}
    >
      {label}
    </ThemedText>
  </TouchableOpacity>
);
