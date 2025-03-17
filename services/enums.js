export const enumUserType = {
  1: "EC User",
  2: "Partner",
  3: "Client",
};
export const enumStatus = {
  1: "Active",
  2: "Inactive",
};

export const enumStatusCSSClasses = {
  1: "green-bg text-light", // Active
  2: "yellow-bg text-light", // Inactive
};

export const enumCommonStatus = {
  1: "Approved",
  2: "Pending",
  3: "Rejected",
};
export const enumCommonStatusTextColor = {
  0: "#227CA2", // InActive
  1: "#66BAA1",
  2: "#E79A28",
  3: "#A22522",
};

export const enumGender = {
  1: "Male",
  2: "Female",
  3: "Other",
};
export const enumKYCStatus = {
  1: "Completed",
  2: "In-Progress",
  3: "Pending",
  4: "Rejected",
};
export const enumServiceFor = {
  1: "Self",
  2: "Other",
};
export const enumServiceDuration = {
  1: "12 hrs.",
  2: "24 hrs.",
};
export const enumServiceStatus = {
  1: "Active",
  2: "Inactive",
};
export const enumServiceRequestStatusForCustomer = {
  1: "New",
  3: "Assigned Staff", // Done By Vendor
  4: "Ongoing", // From date to end date
  5: "Completed", // When period of service request is over
  6: "Cancelled", // by Customer
  7: "Rejected", // by Vendor
  // 8: "Repeated", // by Customer
};
export const enumServiceRequestStatusForVendor = {
  2: "New",
  3: "Assigned Staff", // Done By Vendor
  4: "Ongoing", // From date to end date
  5: "Completed", // When period of service request is over
  6: "Cancelled", // by Customer
  7: "Rejected", // by Vendor
  // 8: "Repeated", // by Customer
};
export const enumServiceRequestStatusTextColor = {
  1: "#095256", // New Primary,
  2: "#43AA8B", // Assigned to Vendor secondary
  3: "#E79A28", // Assigned to Vendor Staff
  4: "#227CA2", // Ongoing
  5: "#66BAA1", // Completed
  6: "#A22522", // Cancelled
  7: "#6f42c1", // Rejected
  //8: "#6610f2", // Repeated
};
export const enumPaymentStatus = {
  1: "Paid",
  2: "Pending",
  3: "Failed",
  4: "Processing",
  5: "Void",
};
export const enumPaymentStatusTextColor = {
  1: "#66BAA1",
  2: "#227CA2",
  3: "#A22522",
  4: "#095256",
  5: "#6f42c1",
};

export const enumPaymentMethods = {
  1: "Online",
  2: "Cash",
  3: "Cheque",
};

export const enumVendorPaymentStatus = {
  1: "Paid",
  2: "Pending",
  3: "Failed",
  4: "Processing",
  5: "Void",
};
