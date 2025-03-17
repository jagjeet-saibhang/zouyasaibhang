import DocumentPickerComponent from "./DocumentPicker";
import CaptureImage from "./ImageCapture";
import InputText from "./InputText";
import PickerDateTime from "./PickerDateTime";
import PickerSelect from "./PickerSelect";
import RadioButtons from "./RadioButtons";
import TextArea from "./TextArea";
import CaptureFile from "./CaptureFile";

export const renderInputFields = (fields, formData, handleInputChange, setForm = null) =>
  fields.map((field) => {
    return field.type === "radio" ? (
      <RadioButtons
        field={field}
        key={field.key}
        placeholder={field.placeholder}
        items={field.items}
        value={formData[field.key]}
        onChange={(value) => handleInputChange(field.key, value)}
        required={field.required}
      />
    ) : field.type === "date" ? (
      <PickerDateTime
        field={field}
        key={field.key}
        label={field.label}
        placeholder={field.placeholder}
        value={formData[field.key] || new Date()}
        onChange={(value) => handleInputChange(field.key, value)}
        required={field.required}
        minimumDate={field.minimumDate}
      />
    ) : field.type === "select" ? (
      <PickerSelect
        field={field}
        key={field.key}
        label={field.label}
        placeholder={field.placeholder}
        value={formData[field.key]}
        onChange={(value) => handleInputChange(field.key, value)}
        items={field.items}
        required={field.required}
      />
    ) : field.type === "textarea" ? (
      <TextArea
        label={field.label}
        key={field.key}
        placeholder={field.placeholder}
        keyboardType={field.keyboardType || "default"}
        value={formData[field.key]}
        onChange={(value) => handleInputChange(field.key, value)}
        required={field.required}
      />
    ) : field.type === "file" ? (
      <DocumentPickerComponent
        field={field}
        key={field.key}
        name={field.key}
        value={formData[field.key]}
        fileName={formData[field.name]}
        label={field.label}
        placeholder={field.placeholder}
        setForm={setForm}
        required={field.required}
      />
    ) : field.type === "capture" ? (
      <CaptureImage
        field={field}
        key={field.key}
        name={field.key}
        label={field.label}
        value={formData[field.key]}
        placeholder={field.placeholder}
        setForm={setForm}
        required={field.required}
      />
    ) : field.type === "captureFile" ? (
      <CaptureFile
        field={field}
        key={field.key}
        name={field.key}
        fileName={formData[field.name]}
        label={field.label}
        placeholder={field.placeholder}
        setForm={setForm}
        required={field.required}
        value={formData[field.key]}
      />
    ) : (
      <InputText
        label={field.label}
        key={field.key}
        placeholder={field.placeholder}
        keyboardType={field.keyboardType || "default"}
        value={formData[field.key]}
        onChange={(value) => handleInputChange(field.key, value)}
        required={field.required}
        editable={field.editable}
      />
    );
  });
