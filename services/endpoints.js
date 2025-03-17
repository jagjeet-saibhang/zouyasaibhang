import ProjectSettings from "./projectSettings";

const endpoints = {
  OTP: {
    verify: `https://api.kaleyra.io/v1/${ProjectSettings.otpSID}/verify`,
    validate: `https://api.kaleyra.io/v1/${ProjectSettings.otpSID}/verify/validate`,
  },
  Auth: {
    authenticate: "Auth/authenticate",
    mobileAppLogin: "Auth/mobileAppLogin", //For Mobile App
    put: "Auth",
    mobileAppSignUp: "Auth/mobileAppSignUp", //For Mobile App
    pagination: "Auth/pagination",
    updateUserStatus: "Auth/updateUserStatus",
    getUserById: "Auth/getuserbyid?id=",
  },
  City: {
    get: "City?CityId=",
    getCityListByStateId: "City/getCityListByStateId",
  },
  CommonEmergencyContact: {
    getCommonEmergencyContactByCustomerId: "CommonEmergencyContact?CommonEmergencyContactId=",
    post: "CommonEmergencyContact",
    put: "CommonEmergencyContact",
    delete: "CommonEmergencyContact?id=",
    search: "CommonEmergencyContact/search",
  },
  Customer: {
    get: "Customer?CustomerId=",
    put: "Customer",
    getCustomerListForMobileApp: "Customer/getCustomerListForMobileApp", //For Mobile App
    updateCustomerStatus: "Customer/updateCustomerStatus",
    delete : "Customer?id="
  },
  CustomerEmergencyContact: {
    getCustomerEmergencyContactByCustomerId: "CustomerEmergencyContact?CustomerEmergencyContactId=",
    post: "CustomerEmergencyContact",
    put: "CustomerEmergencyContact",
    delete: "CustomerEmergencyContact?id=",
    search: "CustomerEmergencyContact/search",
  },
  CustomerMedicalHistory: {
    getCustomerMedicalHistoryByCustomerId: "CustomerMedicalHistory/getCustomerMedicalHistoryByCustomerId",
    getCustomerMedicalHistoryByServiceRequestId: "CustomerMedicalHistory/getCustomerMedicalHistoryByServiceRequestId",
    search: "CustomerMedicalHistory/search",
    delete: "CustomerMedicalHistory?id=",
    post: "CustomerMedicalHistory",
    put: "CustomerMedicalHistory",
  },
  Invoice: {
    sendOnClickPdfEmail: "Invoice/sendOnClick_InvoicePdfEmail",
  },
  Payment: {
    get: "Payment?PaymentId=",
    post: "Payment",
    put: "Payment",
    getPaymentByServiceRequestId: "Payment/getPaymentByServiceRequestId?ServiceRequestId=",
    getPaymentByCustomerIdForMobileApp: "Payment/getPaymentByCustomerIdForMobileApp",
    getPaymentByVendorIdForMobileApp: "Payment/getPaymentByVendorIdForMobileApp",
    search: "Payment/search",
    updatePaymentStatus: "Payment/updatePaymentStatus",
    updateVendorPaymentStatus: "Payment/updateVendorPaymentStatus",
  },
  Region: {
    get: "Region?RegionId=",
    getRegionList: "Region/getRegionList",
  },
  Review: {
    get: "Review?ReviewId=",
    getByCustomerId: "Review?CustomerId=",
    post: "Review",
    put: "Review",
    delete: "Review?id=",
    getAverageOverallRatingByAllCustomers: "Review/getAverageOverallRatingByAllCustomers",
    search: "Review/search",
  },
  Service: {
    get: "Service?ServiceId=",
    getServiceList: "Service/getServiceList",
    getServiceListForMobileApp: "Service/getServiceListForMobileApp",
    updateServiceStatus: "Service/updateServiceStatus",
  },
  ServiceRequest: {
    get: "ServiceRequest?ServiceRequestId=",
    post: "ServiceRequest",
    put: "ServiceRequest",
    getServiceRequestListForMobileApp: "ServiceRequest/getServiceRequestListForMobileApp",
    getServiceRequestForMobileApp: "ServiceRequest/getServiceRequestForMobileApp",
    updateServiceRequestStatus: "ServiceRequest/updateServiceRequestStatus",
    assignServiceRequestToVendor: "ServiceRequest/assignServiceRequestToVendor",
    assignVendorStaffToServiceRequest: "ServiceRequest/assignVendorStaffToServiceRequest",
  },
  ServiceRequestRemark: {
    getServiceRequestRemarksByServiceRequestId: "ServiceRequestRemark/getServiceRequestRemarksByServiceRequestId?ServiceRequestId=",
  },
  State: {
    get: "State?StateId=",
    getStateList: "State/getStateList",
    getStateListByRegionId: "State/getStateListByRegionId",
  },
  Vendor: {
    get: "Vendor?VendorId=",
    put: "Vendor",
    getVendorDocUrlByVendorId: "Vendor/getVendorDocUrlByVendorId?VendorId=",
    getVendorListForMobileApp: "Vendor/getVendorListForMobileApp",
    updateVendorStatus: "Vendor/updateVendorStatus",
    updateVendorKycStatus: "Vendor/updateVendorKycStatus",
    delete: "Vendor?id="
  },
  VendorStaff: {
    get: "VendorStaff?VendorStaffId=",
    post: "VendorStaff",
    put: "VendorStaff",
    delete: "VendorStaff?id=",
    getVendorStaffList: "VendorStaff/getVendorStaffList",
    getVendorStaffByVendorId: "VendorStaff/getVendorStaffByVendorId?vendorId=",
    getVendorStaffDocUrlByVendorStaffId: "VendorStaff/getVendorStaffDocUrlByVendorStaffId?VendorStaffId=",
    getVendorStaffListForMobileApp: "VendorStaff/getVendorStaffListForMobileApp",
    updateVendorStaffStatus: "VendorStaff/updateVendorStaffStatus",
    updateVendorStaffKycStatus: "VendorStaff/updateVendorStaffKycStatus",
  },
};

export default endpoints;
