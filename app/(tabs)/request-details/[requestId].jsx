import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useGlobalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { images } from "@/constants";
import { Loader, PrimaryButton } from "@/components/ui";
import PageTitle from "@/components/ui/PageTitle";
import useFetchDataById from "@/hooks/useFetchDataById";
import endpoints from "@/services/endpoints";
import moment from "moment";
import { RefreshControl } from "react-native-gesture-handler";
import {
  enumGender,
  enumPaymentStatus,
  enumPaymentStatusTextColor,
  enumServiceRequestStatusForCustomer,
  enumServiceRequestStatusTextColor,
} from "@/services/enums";
import { renderInputFields } from "@/components/Inputs/renderInputFields";
import usePutData from "@/hooks/usePutData";
import TextArea from "@/components/Inputs/TextArea";
import CustomConfirmation from "@/components/CustomConfirmation";
import api from "@/services/api";
import SendEmailInvoice from "@/components/SendEmailInvoice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DocumentButton from "@/components/ui/DocumentButton";
import { useGlobalContext } from "@/hooks/GlobalProvider";
import { cashInputFields, chequeInputFields, radioFieldsForPaymentMode } from "@/services/formFields";

const RequestService = () => {
  const { requestId } = useGlobalSearchParams();
  const { user } = useGlobalContext();

  const { data: vendorStaffData, loading: vendorStaffLoading } = useFetchDataById(
    user?.userType === 2 ? `${endpoints.VendorStaff.getVendorStaffByVendorId}${user?.id}` : undefined
  );

  const { data, loading, fetchData } = useFetchDataById(requestId ? `${endpoints.ServiceRequest.get}${requestId}` : undefined);

  const [paymentDetails, setPaymentDetails] = useState({});
  const [confirmPayment, setConfirmPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelRequest, setShowCancelRequest] = useState(false);
  const [showAcceptRequest, setShowAcceptRequest] = useState(false);
  // State for confirmation dialog visibility and message
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [sendInvoiceEmailVisible, setSendInvoiceEmailVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [formData, setFormdata] = useState({
    paymentMode: 2,
  });
  const [selectedStaffMember, setSelectedStaffMember] = useState({ vendorStaffId: null, remarks: null });

  const fetchPaymentDetails = async () => {
    try {
      if (!requestId) return;

      // Fetch payment details by service request ID
      const response = await api.get(`${endpoints.Payment.getPaymentByServiceRequestId}${requestId}`);

      if (response) {
        // Set payment details
        setPaymentDetails(response);
      } else {
        // Reset payment details
        setPaymentDetails(null);
      }
    } catch (error) {
      // Reset payment details on error
      setPaymentDetails(null);
      Alert.alert("Error", error.message || "Failed to fetch payment details");
    }
  };
  useEffect(() => {
    if (data && requestId) {
      // fetch payment details if service request status is completed or canceled
      if (data?.statusId === 5 || data?.statusId === 6) {
        fetchPaymentDetails();
      }
    } else {
      return;
    }
  }, [requestId, data]);

  // Show confirmation dialog
  const showConfirmation = () => {
    setConfirmationMessage(`Are you sure you want to cancel this ${data?.idNumberStr} service request?`);
    setConfirmationVisible(true);
  };

  // Handle cancel action in confirmation dialog
  const onCancel = () => {
    setConfirmationVisible(false);
  };

  // Handle confirm action in confirmation dialog
  const onConfirm = async () => {
    await handleCancelServiceRequest();
    setConfirmationVisible(false);
  };

  const handleInputChange = (key, value) => {
    setFormdata((prevState) => ({ ...prevState, [key]: value }));
  };
  const handleSelectStaffMember = (key, value) => {
    setSelectedStaffMember((prevState) => ({ ...prevState, [key]: value }));
  };

  const [cancelRemark, setCancelRemark] = useState("");

  const { isSaving, postRequest } = usePutData();

  const handleCancelServiceRequest = async (cancelRemark) => {
    // Check if the service request is ongoing
    if (data?.statusId !== 4) {
      Alert.alert("Error", "Only ongoing service requests can be cancelled");
      return;
    }

    // Get the current date and time
    const currentDate = moment();

    // Format the date to match the desired format
    const formattedDate = currentDate.format("YYYY-MM-DD[T]00:00:00.000[Z]");

    // Create the payload for the request
    const payload = {
      serviceRequestId: requestId,
      statusId: 5, // Void - Cancelled
      remarks: cancelRemark,
      cancelledDate: formattedDate,
    };

    try {
      // Post the request to the API
      const res = await postRequest(endpoints.ServiceRequest.updateServiceRequestStatus, payload);
      if (res.success) {
        // Fetch the updated data
        fetchData();
        // Hide the cancel request modal
        setShowCancelRequest(false);
        // Reset the cancel remark
        setCancelRemark("");
        // Show a success alert
        Alert.alert("Success", "Service request cancelled successfully");
      }
    } catch (error) {
      // Show an error alert
      Alert.alert("Error", error.message || "An error occurred");
    }
  };

  const handleSubmitPayment = async () => {
    // Check if the payment mode is online
    if (formData.paymentMode === 1) {
      Alert.alert("Error", "Online payment mode is coming soon.");
      return;
    }

    setIsSubmitting(true); // Set submitting state to true

    try {
      let payload = {}; // Initialize payload

      // Handle cash payment mode
      if (formData.paymentMode === 2) {
        // Check for required fields
        if (!formData.cashAmount && !formData.cashDate) {
          Alert.alert("Error", "Please fill all fields");
          return;
        }
        // Construct payload for cash payment
        payload = {
          serviceRequestId: requestId,
          id: paymentDetails[0].id,
          paymentMode: parseInt(formData.paymentMode),
          statusId: 4, // Processing status
          cashAmount: formData.cashAmount,
          cashDate: formData.cashDate,
          totalAmount: paymentDetails[0].totalAmount,
          daysOfService: paymentDetails[0].daysOfService,
          perDayAmount: paymentDetails[0].perDayAmount,
          gst: paymentDetails[0].gst,
          razorpayPaymentId: paymentDetails[0].razorpayPaymentId,
        };
      }

      // Handle cheque payment mode
      if (formData.paymentMode === 3) {
        // Check for required fields
        if (!formData.chequeAmount || !formData.chequeDate || !formData.chequeImageFile) {
          Alert.alert("Error", "Please fill all fields");
          return;
        }
        // Construct payload for cheque payment
        payload = {
          id: paymentDetails[0].id,
          serviceRequestId: requestId,
          paymentMode: parseInt(formData.paymentMode),
          statusId: 4, // Processing status
          chequeAmount: formData.chequeAmount,
          chequeDate: formData.chequeDate,
          chequeImageFile: formData.chequeImageFile,
          chequeImageFileName: formData.chequeImageFileName,
          totalAmount: paymentDetails[0].totalAmount,
          daysOfService: paymentDetails[0].daysOfService,
          perDayAmount: paymentDetails[0].perDayAmount,
          gst: paymentDetails[0].gst,
          razorpayPaymentId: paymentDetails[0].razorpayPaymentId,
        };
      }
      // Post the payment details
      const res = await postRequest(endpoints.Payment.put, payload);

      if (res) {
        // Update the payment status to processed
        await postRequest(endpoints.Payment.updatePaymentStatus, { paymentId: paymentDetails[0].id, statusId: 5 }); // status id 5 is processed
        await fetchPaymentDetails(); // Fetch updated payment details
        setFormdata({ paymentMode: 2 }); // Reset form data
        setConfirmPayment(false); // Hide confirmation modal
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred"); // Show error alert
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleAssignStaffMember = async () => {
    try {
      const payload = {
        serviceRequestId: requestId,
        vendorStaffId: selectedStaffMember.vendorStaffId,
        remarks: selectedStaffMember.remarks,
        toDate: data?.toDate,
      };
      const res = await postRequest(endpoints.ServiceRequest.assignVendorStaffToServiceRequest, payload);
      if (res) {
        await fetchData();
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred");
    }
  };
  const handleGoBack = () => {
    if (confirmPayment) {
      setConfirmPayment(false);
      setShowCancelRequest(false);
      setFormdata({ paymentMode: 2 });
    } else {
      router.push("/requests");
    }
  };
  if (loading || user.userType === 2 ? vendorStaffLoading : false)
    return <Loader isLoading={loading || user.userType === 2 ? vendorStaffLoading : false} />;
  if (!data)
    return (
      <SafeAreaView className="flex-1">
        <ThemedView className="flex-1 items-center justify-center w-full h-full">
          <ThemedText className="font-pSemiBold text-2xl">Fetching data...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
        keyboardShouldPersistTaps="handled"
      >
        <SendEmailInvoice
          title="Send Email Invoice"
          visible={sendInvoiceEmailVisible}
          message={`Send Invoice for service request no. ${data?.idNumberStr}`}
          onCancel={() => setSendInvoiceEmailVisible(false)}
          invoiceId={data?.invoiceId}
        />
        <CustomConfirmation
          title="Cancel Service Request"
          visible={confirmationVisible}
          message={confirmationMessage}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
        <ThemedView className="w-full h-full flex-1 py-4">
          <PageTitle title="Service Details" />
          <ThemedText className="font-pMedium text-xl text-center mt-2">Request No. {data?.idNumberStr}</ThemedText>
          <ThemedText className="font-pMedium text-xl text-center">
            <Text>
              Request Status:
              <Text style={{ color: enumServiceRequestStatusTextColor[data?.statusId] }} className="font-pSemiBold underline px-1">
                {enumServiceRequestStatusForCustomer[data?.statusId]}
              </Text>
            </Text>
          </ThemedText>
          <ThemedText className="font-pMedium text-xl text-center mb-2">
            {user?.userType === 3 && (
              <Text>
                Payment Status:
                <Text style={{ color: enumPaymentStatusTextColor[paymentDetails[0]?.statusId] }} className="font-pSemiBold underline px-1">
                  {enumPaymentStatus[paymentDetails[0]?.statusId]}
                </Text>
              </Text>
            )}
          </ThemedText>

          <ThemedView className="mx-4 p-4 rounded-3xl shadow-md mb-4 border border-gray-200 flex-col items-center">
            <View className="flex-row justify-between items-center gap-x-4">
              <View className="flex flex-row items-center">
                <View>
                  <View className="flex-row">
                    <ThemedText className="font-pSemiBold text-xl">{data?.service?.serviceName}</ThemedText>
                  </View>
                  <View className="flex-row">
                    <ThemedText className="text-base">{moment(data?.fromDate).format("DD-MM-YY")} </ThemedText>
                    <ThemedText className="mx-2 text-base">to</ThemedText>
                    <ThemedText className="text-base">{moment(data?.toDate).format("DD-MM-YY")}</ThemedText>
                  </View>
                </View>
              </View>
              <View>
                <ThemedText className="font-pBold text-2xl text-right mr-4">₹{data?.perDayAmount}</ThemedText>
                <ThemedText className="font-pMedium text-sm mr-4">Per Day Amount</ThemedText>
              </View>
            </View>
          </ThemedView>
          {/* if service request status is not rejected */}
          {data?.statusId !== 7 && (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {showCancelRequest ? (
                <View className="gap-4 mx-4 flex-wrap flex-row my-8">
                  <TextArea
                    label="Reason for cancellation"
                    placeholder="Please enter reason here ..."
                    value={cancelRemark}
                    onChange={(value) => setCancelRemark(value)}
                  />
                  <PrimaryButton title="Submit Cancellation" handlePress={showConfirmation} isLoading={isSaving} />
                </View>
              ) : confirmPayment ? (
                <>
                  <ThemedView className="mx-4 p-4 rounded-3xl shadow-md mb-4 border border-gray-200 pt-4">
                    <View className="flex-row justify-between items-center mx-2">
                      <ThemedView className="flex-row items-center">
                        <ThemedText className="font-pMedium text-lg">Service Days: </ThemedText>
                        <ThemedText className="font-pBold text-2xl ">{paymentDetails[0]?.daysOfService}</ThemedText>
                      </ThemedView>
                      <ThemedView className="flex-row items-center">
                        <ThemedText className="font-pMedium text-lg">Total Amount: </ThemedText>
                        <ThemedText className="font-pBold text-2xl">₹{paymentDetails[0]?.totalAmount}</ThemedText>
                      </ThemedView>
                    </View>
                    <View className="flex-row justify-between items-center gap-4">
                      <DocumentButton title="View Invoice" url={paymentDetails[0]?.invoicePdfUrl} />
                      <EmailInvoice url={paymentDetails[0]?.invoicePdfUrl} setSendInvoiceEmailVisible={setSendInvoiceEmailVisible} />
                    </View>
                  </ThemedView>
                  {user?.userType === 3 && (
                    <>
                      <View className="gap-4 mx-4 flex-wrap flex-row border-t border-gray-200 pt-4">
                        {renderInputFields(radioFieldsForPaymentMode, formData, handleInputChange)}
                      </View>
                      <View className="gap-4 mx-4 flex-wrap flex-row">
                        {formData.paymentMode === 2 && renderInputFields(cashInputFields, formData, handleInputChange)}
                        {formData.paymentMode === 3 && renderInputFields(chequeInputFields, formData, handleInputChange, setFormdata)}
                      </View>
                      {formData.paymentMode === 1 && (
                        <ThemedView>
                          <ThemedText className="font-pMedium text-lg text-center">Coming Soon</ThemedText>
                        </ThemedView>
                      )}
                    </>
                  )}
                </>
              ) : data?.statusId === 2 && user?.userType === 2 ? (
                <View className="gap-4 mx-4 flex-wrap flex-row">
                  {renderInputFields(
                    [
                      {
                        placeholder: "Staff Member to Assign Request",
                        key: "vendorStaffId",
                        type: "select",
                        items: vendorStaffData.map((v, idx) => ({ label: `${v.firstName} ${v.lastName}`, value: v.id })),
                      },
                      {
                        label: "Remarks",
                        placeholder: "Remarks here...",
                        key: "remarks",
                        type: "textarea",
                      },
                    ],
                    selectedStaffMember,
                    handleSelectStaffMember
                  )}
                  <PrimaryButton title="Assign Staff Member" handlePress={handleAssignStaffMember} isLoading={isSaving} />
                </View>
              ) : (
                <>
                  <View className={`bg-[#E8F9F8] p-4 rounded-2xl shadow-lg mx-4 border-2 border-white ${!confirmPayment ? "mt-24" : ""}`}>
                    <View className="items-center -mt-28">
                      <Image
                        source={
                          vendorStaffData?.imageUrl
                            ? { uri: `${vendorStaffData?.imageUrl}?timestamp=${new Date().getTime()}` }
                            : images.request_img
                        }
                        className="w-30 h-30 rounded-full border-2 border-white"
                      />
                      <Text className="font-pSemiBold text-2xl mt-2 w-full text-center uppercase">
                        {data?.vendorStaff?.firstName + " " + data?.vendorStaff?.lastName}
                      </Text>
                    </View>
                    <View className="px-3">
                      <InfoItem label="Age" value={moment().diff(moment(data?.vendorStaff?.dateOfBirth), "years")} />
                      <InfoItem label="Gender" value={enumGender[data?.vendorStaff?.gender]} />
                      <InfoItem label="Qualification" value={data?.vendorStaff?.qualification} />
                    </View>
                    <View className="mt-4 flex flex-row flex-wrap gap-2">
                      <View className="mt-4 flex flex-row flex-wrap gap-2">
                        <DocumentButton title="Aadhar Card" url={data?.vendorStaff?.aadharCardDocUrl} />
                        <DocumentButton title="Police Verification" url={data?.vendorStaff?.policeVerificationDocUrl} />
                        <DocumentButton title="Qualification Certificate" url={data?.vendorStaff?.qualificationCertificateDocUrl} />
                      </View>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          )}

          <Text>
            <View className="p-4 mb-4 gap-4 w-full items-center">
              {/* service request status 7 rejected, 5 completed and 6 cancelled  */}
              {data?.statusId === 7 ? null : data?.statusId === 5 || data?.statusId === 6 ? (
                <PrimaryButton
                  title={
                    data && paymentDetails[0]?.statusId === 1
                      ? "Payment Done"
                      : confirmPayment && user?.userType === 3
                      ? `Submit Payment Details`
                      : "Confirm Payment"
                  }
                  handlePress={
                    confirmPayment && user?.userType === 3
                      ? handleSubmitPayment
                      : () => {
                          setConfirmPayment(!confirmPayment);
                        }
                  }
                  isLoading={isSubmitting || false}
                  disabled={data && paymentDetails[0]?.statusId === 1}
                />
              ) : null}
              {/* service request status 4 ongoing & 3 for assigned staff */}
              {user?.userType === 3 ? (
                  <PrimaryButton
                    title="Want to Accept Request?"
                    handlePress={() => setShowCancelRequest(!showCancelRequest)}
                    isLoading={false || isSaving}
                  />
              ) : null
              }
              {/* service request status 4 ongoing & 3 for assigned staff */}
              {data?.statusId === 4 || data?.statusId === 3 ? (
                user?.userType === 3 ? (
                  <PrimaryButton
                    title={showCancelRequest ? "No, I want to continue" : "Want to cancel request?"}
                    handlePress={() => setShowCancelRequest(!showCancelRequest)}
                    isLoading={false || isSaving}
                  />
                ) : null
              ) : null}
               
              <PrimaryButton
                title="Go Back"
                handlePress={handleGoBack}
                isLoading={false}
                disabled={isSaving || isSubmitting}
                containerStyles="min-h-[48px] bg-red text-white px-8"
              />
            </View>
          </Text>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestService;

const InfoItem = ({ label, value }) => {
  return (
    <View className="flex-row justify-between mt-2">
      <Text className="text-black font-pSemiBold text-lg">{label}</Text>
      <Text className="text-black font-pSemiBold text-lg">{value}</Text>
    </View>
  );
};

const EmailInvoice = ({ title = "Email Invoice", url = null, setSendInvoiceEmailVisible }) => {
  // Handle send invoice email action
  return (
    <ThemedView className="rounded-full flex-grow border border-slate-200">
      <TouchableOpacity onPress={url ? () => setSendInvoiceEmailVisible(true) : null} activeOpacity={0.7} className="py-2 px-4">
        <ThemedView className={`flex flex-row items-center ${!url ? "opacity-50" : ""}`}>
          <MaterialCommunityIcons name="email-send" size={20} color="#43AA8B" />
          <ThemedText className={`text-black font-base text-lg ml-2 ${!url ? "line-through" : ""}`}>{title}</ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
};
