import React from "react";
import { Calendar } from "primereact/calendar";

interface CommonDatePickerProps {
  rowData: any;
  field: any;
  selectedRowId: string;
  onDateChange: (e: any, id: string, field: string) => void;
  isAdmin:any
}

const CommonDatePicker: React.FC<CommonDatePickerProps> = ({
  rowData,
  field,
  selectedRowId,
  onDateChange,
  isAdmin
}) => {
  const value = rowData[field.field];
  const isValidDate = value && !isNaN(new Date(value).getTime());

  const getLastMonthDate = () => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 2);
    if (today.getDate() > new Date(today.getFullYear(), today.getMonth(), 0).getDate()) {
      lastMonth.setDate(new Date(today.getFullYear(), today.getMonth(), 0).getDate());
    } else {
      lastMonth.setDate(today.getDate());
    }
    return lastMonth;
  };
  

  const minDate = getLastMonthDate();
  // const minDate = isAdmin.body.data.admin ? getLastMonthDate() : getYesterdayDate();

  return (
    <Calendar
      value={isValidDate ? new Date(value) : null}
      onChange={(e) => onDateChange(e, rowData._id, field.field)}
      disabled={rowData._id !== selectedRowId}
      style={{ width: "150px" }}
      minDate={minDate}
      dateFormat="dd/mm/yy"
      placeholder="Select Date"
    />
  );
};

export default CommonDatePicker;
