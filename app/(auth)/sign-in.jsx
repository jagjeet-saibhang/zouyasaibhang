import { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { icons, images } from "../../constants";
//import { useGlobalContext } from "../../hooks/GlobalProvider";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import endpoints from "@/services/endpoints";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Loader, PrimaryButton } from "@/components/ui";
import { ThemedText } from "@/components/ThemedText";
import InputText from "@/components/Inputs/InputText";
import { useGlobalContext } from "@/hooks/GlobalProvider";
import ProjectSettings from "@/services/projectSettings";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import RadioButtons from "@/components/Inputs/RadioButtons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { openURL } from "expo-linking";
import { CountryPicker } from "react-native-country-codes-picker";
import PickerSelect from "@/components/Inputs/PickerSelect";
import useFetchDataById from "@/hooks/useFetchDataById";
import { renderInputFields } from "@/components/Inputs/renderInputFields";
import { newServiceRequestStep101, } from "@/services/formFields";

const SignIn = ({ lightColor, darkColor }) => {

  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const theme = useColorScheme() ?? "light";
  const { setUser, setIsLogged } = useGlobalContext();
  const [signInPage, setSignInPage] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSendingOTP, setSendingOTP] = useState(false);
  const [isSentOTP, setIsSentOTP] = useState(false);
  const [OTPVerificationId, setOTPVerificationId] = useState(null);
  const color = useColorScheme() ?? "light";
  const height = Dimensions.get("screen")

  const [form, setForm] = useState({
    phoneNo: null,
    userType: 3,
    countryCode: null,
    Name: null,
    stateList: undefined,
    cityList: undefined,
    firstName: "", // ✅ Add firstName
    lastName: "",  // ✅ Add lastName
  });

  const submit = async () => {
    if (!form.phoneNo || form?.phoneNo === "0000000000") {
      Alert.alert("Enter a valid Mobile No.");
      return;
    } else if (form?.phoneNo.length != 10) {
      Alert.alert("Enter 10 digit Mobile No.");
      // console.log(form?.phoneNo.length, countryCode.length);
      return;
    }
    else {
      if (form.phoneNo === "9872132071" || form.phoneNo === "8360272726" || form.phoneNo === "6377850611") {
        setSubmitting(true);
        await signInAndUp();
        setSubmitting(false);
        return; // Skip OTP verification for above users
      } else {
        signInAndUp();
        setSendingOTP(true);
        const payload = {
          to: {
            mobile: `${countryCode} + ${form.phoneNo}`,
          },
        }

        try {
          const response = await fetch(endpoints.OTP.verify, {
            method: "POST",
            headers: {
              "api-key": `${ProjectSettings.otpKeys}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          if (response.ok) {
            const data = await response.json();
            setOTPVerificationId(data.data.verify_id);
            setIsSentOTP(true);
            Alert.alert("Success", "OTP sent successfully");
          } else {
            Alert.alert("Error", "Failed to send OTP");
          }
        } catch (error) {
          const errorMessage = error.message || "An error occurred";
          Alert.alert("Error", errorMessage);
        } finally {
          setSendingOTP(false);
        }
      }
    }
  };

  const handleSubmitOTP = async () => {
    if (!form.otp) {
      Alert.alert("Error", "Enter a valid OTP");
      return;
    } else if (form.otp.length != 6) {
      Alert.alert("Error", "Enter 6 digit OTP");
      return;
    } else {
      setSubmitting(true);
      try {
        const payload = {
          verify_id: OTPVerificationId,
          otp: form.otp,
        };
        const responseOTP = await fetch(endpoints.OTP.validate, {
          method: "POST",
          headers: {
            "api-key": `${ProjectSettings.otpKeys}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (responseOTP.ok) {
          await signInAndUp();
        } else {
          Alert.alert("Error", "Invalid OTP");
        }
      } catch (error) {
        const errorMessage = error.message || "An error occurred";
        Alert.alert("Error", errorMessage);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const signInAndUp = async () => {
    try {
      let response = null;


      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNo,
        userType: form.userType, 
        cityId: formData.cityId
      };
  
      console.log("🚀 Signup Payload:", payload); // ✅ Debugging
  
     

      if (signInPage) {
        response = await api.post(endpoints.Auth.mobileAppLogin, form);
      } else {
        const res = await api.post(endpoints.Auth.mobileAppSignUp, { phoneNumber: form.phoneNo, userType: form.userType });

        if (res && res.success) {
          response = await api.post(endpoints.Auth.mobileAppLogin, form);
        } else {
          setIsSentOTP(false);
          Alert.alert("Error", res.message || "Something went wrong");
          console.log("Error--->>", res.message);
          return;
        }
      }

      if (response && response.success === false) {
        Alert.alert("Error", response.message);
      } else if (response && response.success) {
        const storageData = response.response;
        await AsyncStorage.removeItem("user");
        await AsyncStorage.setItem("user", JSON.stringify(storageData));
        setUser(storageData);
        setIsLogged(true);
        Alert.alert("Success", response.message);
        router.replace("/home");
      } else {
        Alert.alert("Error", response.message || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  const { user } = useGlobalContext();

  const step1InputFields = [

    {
      placeholder: "First Name",
      label: "First Name",
      key: "firstName",
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

  ];

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
  const [formData, setFormData] = useState(initialstate);
  const [updatedFormStep1, setUpdatedFormStep1] = useState(step1InputFields);
  const [regionList, setRegionList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);


  useEffect(() => {
    if (regionData) {
      // console.log("+++++++++++++++", regionData)
      const formattedRegions = regionData.map(({ name, id }) => ({
        label: name,
        value: id
      }));
      // console.log("first>>>>>>Formatted Region List", formattedRegions)
      setRegionList(formattedRegions);
    }
  }, [regionData]);

  const fetchStates = async (regionId) => {
    if (regionId) {
      // console.log("Fetching states for regionId:", regionId); 

      setStateList([]); // Reset before fetching

      try {
        const res = await api.post(endpoints.State.getStateListByRegionId, { regionId });
        console.log("🟢 State API Response:", res);

        setStateList(res.map((state) => ({ label: state.name, value: state.id })));
      } catch (error) {
        console.error("❌ Error fetching states:", error);
      }
    }
  };

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

  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.stateId) return; // ✅ Prevent unnecessary API calls

      setCityList([]); // Clear old cities before fetching

      try {
        console.log("🌍 Fetching cities for stateId:", formData.stateId);
        const res = await api.post(endpoints.City.getCityListByStateId, { stateId: formData.stateId });

        if (!res || !Array.isArray(res)) {
          console.error("❌ Invalid city data:", res);
          return;
        }

        const formattedCities = res.map((city) => ({
          label: city.name,
          value: city.id,
        }));

        console.log("🟢 Formatted City List:", formattedCities);
        setCityList(formattedCities); // ✅ Update city list
      } catch (error) {
        console.error("❌ Error fetching cities:", error);
      }
    };

    fetchCities();
  }, [formData.stateId]);


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
  // ===============================================
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" className="w-full h-full">
            <ThemedView
              className="w-full h-full"
            // style={{
            //   minHeight: Dimensions.get("window").height - 200,
            // }}
            >
              <ImageBackground source={images.login_image} className="w-full h-full absolute z-0" />
              <View className="w-full h-full flex flex-col justify-center items-center">
                <Image source={images.logo} className="w-100 h-32" />
                {/* Top Image Section */}
                <ThemedText className="text-4xl text-center font-pSemiBold my-10">{signInPage ? "Sign-In" : "Sign-Up"}</ThemedText>
                {isSentOTP ? (
                  <>
                    <ThemedText className="text-2xl font-semibold text-primary font-pSemiBold text-center">Verify OTP</ThemedText>
                    <View className="px-8 w-full gap-5">
                      <InputText
                        placeholder="Enter OTP"
                        label="Enter OTP"
                        value={form.otp}
                        onChange={(e) => setForm({ ...form, otp: e })}
                        keyboardType="phone-pad"
                      />

                      {
                        signInPage ?
                          <PrimaryButton title="Sign In" handlePress={handleSubmitOTP} isLoading={isSubmitting} />
                          : <PrimaryButton title="Sign Up" handlePress={handleSubmitOTP} isLoading={isSubmitting} />
                      }
                      <PrimaryButton
                        title="Cancel"
                        handlePress={() => {
                          setForm({});
                          setIsSentOTP(false);
                          setSubmitting(false);
                          setOTPVerificationId(null);
                          router.push("/");
                        }}
                        isLoading={isSendingOTP}
                        containerStyles="min-h-[48px] bg-red text-white px-8 mt-4"
                      />
                      <View className="flex-row items-center justify-center gap-0.5 ">
                        <Text className="text-[9px] font-ppMedium text-center">By continuing, you agree to our </Text>
                        <TouchableOpacity onPress={() => { openURL("https://eldercare.co.in/termsconditions/") }}>
                          <Text className="text-[9px] font-ppMedium text-center color-blue">Terms & Conditions</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    {/* Form Section */}
                    <View className="mb-2 w-full px-8">
                      <View className="gap-4">
                        {!signInPage && (
                          <View className={`w-full mb-2`}>
                            <ThemedText className="text-xl font-pMedium mb-2 ml-2">I'am a</ThemedText>
                            <View className="flex-row items-center gap-2">
                              {[
                                { label: "Client", value: 3 },
                                { label: "Partner", value: 2 },
                              ].map((item, index) => (
                                <TouchableOpacity
                                  key={index}
                                  className="flex-row items-center ml-4 my-1"
                                  onPress={(e) => setForm({ ...form, userType: item.value })}
                                >
                                  <Text
                                    className={`${theme === "light"
                                      ? item.value === form.userType
                                        ? "text-primary font-pSemiBold"
                                        : "text-gray-600"
                                      : item.value === form.userType
                                        ? "text-secondary font-pSemiBold"
                                        : "text-[#C1C1C1]"
                                      }`}
                                  >
                                    {item.value === form.userType ? (
                                      <FontAwesome name="dot-circle-o" size={28} />
                                    ) : (
                                      <FontAwesome name="circle-o" size={26} />
                                    )}
                                  </Text>
                                  <Text
                                    className={`ml-1 text-xl ${theme === "light"
                                      ? item.value === form.userType
                                        ? "text-primary font-pSemiBold"
                                        : "text-gray-600"
                                      : item.value === form.userType
                                        ? "text-secondary font-pSemiBold"
                                        : "text-[#C1C1C1]"
                                      }`}
                                  >
                                    {item.label}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        )}
                        <CountryPicker
                          // style={{ width: '100%', height: "60%" }}
                          show={show}

                          // when picker button press you will get the country object with dial code
                          pickerButtonOnPress={(item) => {
                            setCountryCode(item.dial_code);
                            setShow(false);
                          }}
                          onRequestClose={() => setShow(false)}
                        />


                        {
                          signInPage ?
                            <View>
                              <Text className="color-[#818181] text-lg font-pRegular ml-3 " >Mobile Number</Text>
                              <View
                                className={`flex-row overflow-hidden p-0 rounded-full text-lg font-pRegular border border-[#C1C1C1] focus:border-secondary items-center ${color === "light"
                                  ? "bg-white text-black "
                                  : "bg-[#383838] text-white"
                                  }`}>
                                <TouchableOpacity
                                  onPress={() => setShow(true)}
                                  style={{
                                    width: '25%',
                                    // height: 60,
                                    backgroundColor: 'transparent',
                                    padding: 10,
                                    // borderRadius: 10,
                                    justifyContent: 'center',
                                    // borderRightColor: 'black',
                                    // borderRightWidth: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 4,
                                  }}
                                >
                                  <Text className="text-lg font-pRegular text-black text-center">
                                    {countryCode}
                                  </Text>
                                  <Image
                                    source={images.downArrow}
                                    className="h-4 w-4"
                                    tintColor={'#818181'} />
                                </TouchableOpacity>
                                <InputText
                                  placeholder="Mobile Number"
                                  // label="Mobile Number"
                                  value={form.phoneNo}
                                  onChange={(e) => setForm({ ...form, phoneNo: e })}
                                  keyboardType="phone-pad"
                                  className="text-lg font-pRegular justify-center backround-color-black "
                                  style={{ borderColor: 'white', marginLeft: -30 }}
                                />
                              </View>
                            </View> :
                            <View>
                              {/* <Text className="color-[#818181] text-lg font-pRegular ml-3 " >Full Name</Text> */}
                              <InputText
                                label="First Name"
                                placeholder="First Name"
                                className="text-lg font-pRegular"
                                required={true}
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e })}
                              />
                              <InputText
                                label="Last Name"
                                placeholder="Last Name"
                                className="text-lg font-pRegular"
                                required={true}
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e })}
                              />
                              <ThemedText className="text-sm font-pRegular ml-3 mt-2">
                                Mobile Number
                                <Text className="text-red text-lg">*</Text>
                              </ThemedText>
                              <View
                                className={`flex-row overflow-hidden p-0 rounded-full text-lg font-pRegular border border-[#C1C1C1] focus:border-secondary items-center ${color === "light"
                                  ? "bg-white text-black "
                                  : "bg-[#383838] text-white"
                                  }`}>
                                <TouchableOpacity
                                  onPress={() => setShow(true)}
                                  style={{
                                    width: '25%',
                                    // height: 60,
                                    backgroundColor: 'transparent',
                                    padding: 10,
                                    // borderRadius: 10,
                                    justifyContent: 'center',
                                    // borderRightColor: 'black',
                                    // borderRightWidth: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 4,
                                  }}
                                >
                                  <Text className="text-lg font-pRegular text-black text-center">
                                    {countryCode}
                                  </Text>
                                  <Image
                                    source={images.downArrow}
                                    className="h-4 w-4"
                                    tintColor={'#818181'} />
                                </TouchableOpacity>
                                <InputText
                                  placeholder="Mobile Number"
                                  // label="Mobile Number"
                                  value={form.phoneNo}
                                  onChange={(e) => setForm({ ...form, phoneNo: e })}
                                  keyboardType="phone-pad"
                                  className="text-lg font-pRegular justify-center backround-color-black "
                                  style={{ borderColor: 'white', marginLeft: -30 }}
                                />
                              </View>


                              <PickerSelect
                                label="Region"
                                placeholder="Select Region"
                                value={formData.regionId}
                                // onValueChange={(value) => {
                                onChange={(value) => {
                                  console.log("??????????????------", value);
                                  setFormData((prev) => ({ ...prev, regionId: value }));
                                  fetchStates(value);
                                }}
                                items={regionList}
                                required={true}
                              />
                              <PickerSelect
                                label="State"
                                placeholder="Select State"
                                value={formData.stateId} // Selected state ID
                                onChange={(value) => {
                                  console.log("✅ Selected State:", value);
                                  setFormData((prev) => ({ ...prev, stateId: value }));
                                }}
                                items={stateList} // This must be an array of { label, value }
                                required={true}
                              />

                              <PickerSelect
                                label="City"
                                placeholder="Select City"
                                value={formData.cityId} // Selected city ID
                                onChange={(value) => { // ✅ Use onValueChange instead of onChange
                                  console.log("✅ Selected City:", value);
                                  setFormData((prev) => ({ ...prev, cityId: value })); // Update formData with cityId
                                }}
                                items={cityList} // ✅ Ensure cityList is an array of { label, value }
                                required={true}
                              />
                            </View>
                        }
                      </View>

                      <View className="mt-10">
                        <PrimaryButton handlePress={submit} title="Continue" isLoading={isSendingOTP || isSubmitting} />
                      </View>
                      {/* <TouchableOpacity className="mt-10 px-5 py-5" onPress={() => {
                        const selectedCityId = formData.cityId

                        console.log("📌 First Name:", form.firstName); // Logging first name
                        console.log("📌 Last Name:", form.lastName);
                        console.log("📌 Phone No---:", form.phoneNo);
                        console.log("📌 userType---:", form.userType);
                        console.log("📌 Selected City:", selectedCityId);

                      }}
                      >
                        <Text>SingUp</Text>
                      </TouchableOpacity> */}
                      <TouchableOpacity onPress={() => setSignInPage(!signInPage)} activeOpacity={0.7}>
                        <View className="mb-2 mt-16 text-center">
                          <ThemedText className="text-xl font-ppMedium text-center">
                            {signInPage ? "New User?" : "Already have an account?"}{" "}
                            <Text className={`${theme === "light" ? "text-primary" : "text-secondary"}  text-xl font-pSemiBold underline`}>
                              {signInPage ? "Sign Up" : " Sign In"}
                            </Text>
                          </ThemedText>
                          <ThemedText className="mt-4 text-center">
                            <View className="flex-row items-center justify-center gap-0.5 ">
                              <Text className="text-[9px] font-ppMedium text-center">By continuing, you agree to our </Text>
                              <TouchableOpacity onPress={() => { openURL("https://eldercare.co.in/termsconditions/") }}>
                                <Text className="text-[9px] font-ppMedium text-center color-blue">Terms & Conditions</Text>
                              </TouchableOpacity>
                            </View>
                          </ThemedText>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </ThemedView>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SignIn;
