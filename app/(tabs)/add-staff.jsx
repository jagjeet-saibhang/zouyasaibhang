import React, { useEffect, useState } from "react";
import { ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Loader, PrimaryButton } from "@/components/ui";
import PageTitle from "@/components/ui/PageTitle";
import useFetchDataById from "@/hooks/useFetchDataById";
import endpoints from "@/services/endpoints";
import { enumGender } from "@/services/enums";
import { renderInputFields } from "@/components/Inputs/renderInputFields";
import usePutData from "@/hooks/usePutData";
import api from "@/services/api";
import usePostData from "@/hooks/usePostData";
import { useGlobalContext } from "@/hooks/GlobalProvider";
import { validateRequiredFields } from "@/components/Inputs/validateRequiredFields";

const step1InputFields = [
  {
    placeholder: "Image",
    label: "Profile Image",
    key: "imageFile",
    type: "captureFile",
  },
  {
    placeholder: "First Name",
    label: "First Name",
    key: "firstName",
    required: true,
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
    required: true,
  },
  {
    placeholder: "Gender",
    key: "gender",
    type: "radio",
    items: Object.entries(enumGender).map(([key, value]) => ({ label: value, value: parseInt(key) })),
  },
  {
    placeholder: "Select Service",
    label: "Service",
    key: "serviceId",
    type: "select",
    items: [],
    required: true,
  },
  {
    placeholder: "Region",
    label: "Region",
    key: "regionId",
    type: "select",
    items: [],
    required: true,
  },
  {
    placeholder: "State",
    label: "State",
    key: "stateId",
    type: "select",
    items: [],
    required: true,
  },
  {
    placeholder: "City",
    label: "City",
    key: "cityId",
    type: "select",
    items: [],
    required: true,
  },
  {
    placeholder: "Date of Joining",
    label: "Date of Joining",
    key: "joiningDate",
    type: "date",
    required: true,
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
    keyboardType: "numeric",
  },
  {
    placeholder: "Qualification Certificate",
    label: "Qualification Certificate",
    key: "qualificationCertificateDocFile",
    type: "file",
  },
  {
    placeholder: "Aadhar Card",
    label: "Aadhar Card",
    key: "aadharCardDocFile",
    type: "file",
  },
  {
    placeholder: "Police Verification",
    label: "Police Verification",
    key: "policeVerificationDocFile",
    type: "file",
  },
];

const AddNewStaff = () => {
  const { user } = useGlobalContext();

  const initialstate = {
    "vendorId": user?.id,
    "serviceId": "",
    "cityId": "",
    "firstName": "",
    "lastName": "",
    "gender": 1,
    "email": "",
    "phoneNo": "",
    "dateOfBirth": "",
    "address": "",
    "country": "",
    "state": "",
    "city": "",
    "pinCode": "",
    "kycStatus": 1,
    "weight": 0,
    "height": "",
    "qualification": "",
    "qualificationCertificateDocFile": "",
    "qualificationCertificateDocFileName": "",
    "joiningDate": "",
    "experience": "",
    "policeVerificationDocFile": "",
    "policeVerificationDocFileName": "",
    "aadharCardDocFile": "",
    "aadharCardDocFileName": "",
    "imageFile": "",
    "imageFileName": "",
    "statusId": 1
  }
  const { data: regionData, loading: regionLoading } = useFetchDataById(endpoints.Region.getRegionList);
  const { data: serviceData, loading: serviceLoading } = useFetchDataById(endpoints.Service.getServiceList);
  const [formData, setFormdata] = useState(initialstate);
  const [updatedFormStep1, setUpdatedFormStep1] = useState(step1InputFields);
  
  const handleInputChange = (key, value) => {
  setFormdata((prevState) => ({ ...prevState, [key]: value,  }));
  };

  const {postRequest, isSaving} = usePostData()

  const handleSubmit = async () => {
     const emptyFieldsStep = validateRequiredFields(
          updatedFormStep1,
          formData
    );
        // console.log(emptyFieldsStep);
        
        if (emptyFieldsStep.length > 0) {
          Alert.alert(
            "Validation Error",
            `The following fields are required: ${emptyFieldsStep.join(", ")}`
          );
          return;
        }
    try {
      // Post the details
      const res = await postRequest(endpoints.VendorStaff.put, formData);

      if (res?.success) {
        setFormdata(initialstate); // Reset form data
        router.push("/staff-list");
      }
    } catch (error) {
      Alert.alert( "An error occurred"); // Show error alert
      
    }
  };

  useEffect(() => {
    if (regionData) {
      setUpdatedFormStep1((prevData) =>
        prevData.map((field) => {
          if (field.key === "regionId") {
            return {
              ...field,
              items: regionData.map((item) => ({
                label: item.name,
                value: item.id,
              })),
            };
          }
          return field; // Return the field for other cases
        })
      );
    }
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

  useEffect(() => {
    const getStateList = async (id) => {
      setUpdatedFormStep1((prevData) =>
        prevData.map((field) => {
          if (field.key === "stateId") {
            return {
              ...field,
              placeholder: "Loading...",
            };
          }
          return field; // Return the field for other cases
        })
      );
      try {
        const res = await api.post(endpoints.State.getStateListByRegionId, {
          regionId: id,
        });
        if (res) {
          setUpdatedFormStep1((prevData) =>
            prevData.map((field) => {
              if (field.key === "stateId") {
                return {
                  ...field,
                  items: res.map((item) => ({
                    label: item.name,
                    value: item.id,
                  })),
                };
              }
              return field; // Return the field for other cases
            })
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setUpdatedFormStep1((prevData) =>
          prevData.map((field) => {
            if (field.key === "stateId") {
              return {
                ...field,
                placeholder: "Select State",
              };
            }
            return field; // Return the field for other cases
          })
        );
      }
    };
    if (formData?.regionId) {
      getStateList(formData.regionId);
    }
  }, [formData?.regionId]);

  useEffect(() => {
    const getCityList = async (id) => {
      setUpdatedFormStep1((prevData) =>
        prevData.map((field) => {
          if (field.key === "cityId") {
            return {
              ...field,
              placeholder: "Loading...",
            };
          }
          return field; // Return the field for other cases
        })
      );
      try {
        const res = await api.post(endpoints.City.getCityListByStateId, {
          stateId: id,
        });

        if (res) {
          setUpdatedFormStep1((prevData) =>
            prevData.map((field) => {
              if (field.key === "cityId") {
                return {
                  ...field,
                  items: res.map((item) => ({
                    label: item.name,
                    value: item.id,
                  })),
                };
              }
              return field; // Return the field for other cases
            })
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setUpdatedFormStep1((prevData) =>
          prevData.map((field) => {
            if (field.key === "cityId") {
              return {
                ...field,
                placeholder: "Select City",
              };
            }
            return field; // Return the field for other cases
          })
        );
      }
    };
    if (formData?.stateId) {
      getCityList(formData.stateId);
    }
  }, [formData?.stateId]);

  if (serviceLoading || regionLoading) return <Loader isLoading={serviceLoading || regionLoading} />;

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <ThemedView className="w-full h-full flex-1 py-4">
          <PageTitle title={`Add New Staff Member`} />

          <ThemedView className="gap-4 mx-4 flex-wrap flex-row">
            {renderInputFields(updatedFormStep1, formData, handleInputChange, setFormdata)}
          </ThemedView>


          <ThemedText>
            <ThemedView className="p-4 mb-4 gap-4 w-full items-center">
              <PrimaryButton title={"Submit"} handlePress={handleSubmit} isLoading={isSaving} />

              <PrimaryButton
                title="Cancel"
                handlePress={() => {
                  setFormdata(initialstate);
                  router.push("/staff-list");
                }}
                containerStyles="min-h-[48px] bg-red text-white px-8"
              />
            </ThemedView>
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddNewStaff;
