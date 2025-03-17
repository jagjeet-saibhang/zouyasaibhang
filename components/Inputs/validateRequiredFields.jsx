export const validateRequiredFields = (inputFields, formData) => {
  const emptyFields = [];
  inputFields.forEach((field) => {
    if (field.required && !formData[field.key]) {
      emptyFields.push(field.label || field.placeholder || field.key);
    }
  });
  return emptyFields;
};
