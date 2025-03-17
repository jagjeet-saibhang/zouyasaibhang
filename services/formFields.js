import { enumPaymentMethods } from "./enums";

export const newServiceRequestStep1 = [
  // {
  //   placeholder: "Request for",
  //   key: "requestFor",
  //   type: "radio",
  //   items: [
  //     { label: "Self", value: 1 },
  //     { label: "Other", value: 2 },
  //   ],
  // },
  // {
  //   placeholder: "Relation",
  //   label: "Relation",
  //   key: "Relation",
  //   // key: "category",
  //   type: "select",
  //   items: [],
  // },
  {
    placeholder: "Service",
    label: "Service",
    key: "serviceId",
    // key: "category",
    type: "select",
    items: [],
  },
  
  {
    placeholder: "Experience",
    label: "Experience",
    key: "experience",
    keyboardType: "phone-pad",
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
    placeholder: "Service From",
    label: "Service From",
    key: "fromDate",
    type: "date",
    required: true,
    minimumDate: new Date(),
  },
  {
    placeholder: "Service To",
    label: "Service To",
    key: "toDate",
    type: "date",
    required: true,
    minimumDate: new Date(),
  },
  {
    placeholder: "Duration",
    key: "duration",
    type: "radio",
    items: [
      { label: "12 hrs.", value: 1 },
      { label: "24 hrs.", value: 2 },
    ],
  },
];

export const newServiceRequestStep2 = [
  { placeholder: "First Name", label: "First Name", key: "firstName" },
  { placeholder: "Last Name", label: "Last Name", key: "lastName" },
  { placeholder: "Age", label: "Age", key: "age", keyboardType: "numeric" },
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
    placeholder: "Medical History",
    label: "Medical History",
    key: "medicalHistory",
    type: "textarea",
  },
  {
    placeholder: "Current History",
    label: "Current History",
    key: "currentHealthIssue",
    type: "textarea",
  },
  {
    placeholder: "Instructions",
    label: "Instructions",
    key: "instruction",
    type: "textarea",
  },
];

export const radioFieldsForPaymentMode = [
  {
    placeholder: "Payment Mode",
    key: "paymentMode",
    type: "radio",
    items: Object.entries(enumPaymentMethods).map(([key, value]) => ({ label: value, value: parseInt(key) })),
  },
];

export const cashInputFields = [
  // {
  //   placeholder: "Payee Name",
  //   label: "Payee Name",
  //   key: "name",
  //   type: "text",
  // },
  {
    placeholder: "Cash Date",
    label: "Cash Date",
    key: "cashDate",
    type: "date",
  },
  {
    placeholder: "Cash Amount",
    label: "Cash Amount",
    key: "cashAmount",
    keyboardType: "numeric",
  },
];

export const chequeInputFields = [
  // {
  //   placeholder: "Payee Name",
  //   label: "Payee Name",
  //   key: "name",
  //   type: "text",
  // },
  {
    placeholder: "Cheque Date",
    label: "Cheque Date",
    key: "chequeDate",
    type: "date",
  },
  {
    placeholder: "Cheque Amount",
    label: "Cheque Amount",
    key: "chequeAmount",
    keyboardType: "numeric",
  },
  {
    placeholder: "Cheque",
    label: "Cheque",
    key: "chequeImageFile",
    type: "capture",
  },
];
