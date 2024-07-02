import React from "react";
import { Calendar } from "primereact/calendar";

interface CommonDatePickerProps {
  rowData: any;
  field: any;
  selectedRowId: string;
  onDateChange: (e: any, id: string, field: string) => void;
}

const CommonDatePicker: React.FC<CommonDatePickerProps> = ({
  rowData,
  field,
  selectedRowId,
  onDateChange,
}) => {
  const value = rowData[field.field];
  const isValidDate = value && !isNaN(new Date(value).getTime());
  const getYesterdayDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
  };
  return (
    <Calendar
      value={isValidDate ? new Date(value) : null}
      onChange={(e) => onDateChange(e, rowData._id, field.field)}
      disabled={rowData._id !== selectedRowId}
      style={{ width: "150px" }}
      minDate={getYesterdayDate()}
      dateFormat="dd/mm/yy"
      placeholder="Select Date"
    />
  );
};

export default CommonDatePicker;
