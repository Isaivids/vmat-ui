import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { messages } from "../../api/constants";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { bulkupdate } from "../../store/slice/bulkUpdateSlice";

interface BulkUpdateProps {
  visible: boolean;
  onHide: () => void;
  data: any;
  type: number;
  onSuccess?: (info: { RTGS: string; PRD: string; MOP: string }) => void;
}

const BulkUpdate: React.FC<BulkUpdateProps> = ({ visible, onHide, data, type, onSuccess }) => {
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [rtgsNumber, setRtgsNumber] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch<AppDispatch>();

  const paymentOptions = messages.modeofpayments;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!paymentDate) newErrors.paymentDate = "Payment date is required.";
    if (!rtgsNumber.trim()) newErrors.rtgsNumber = "RTGS number is required.";
    if (!paymentMode) newErrors.paymentMode = "Payment mode is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFormatteddate = (inputDate: any) => {
    if ([null, undefined, ""].includes(inputDate)) {
      return "";
    } else {
      const date = new Date(inputDate);
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      return localDate;
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const updatedData = data.map((item: any) => ({
      ...item,
      PRD: getFormatteddate(paymentDate),
      RTGS : rtgsNumber,
      MOP: paymentMode,
    }));
    try {
      const response = await dispatch(
        bulkupdate({ type: type, body: updatedData })
      );
      if(!response.payload.error){
        onHide();
        setPaymentDate(null);
        setRtgsNumber("");
        setPaymentMode("");
        if (onSuccess) {
          onSuccess({
            RTGS: rtgsNumber,
            PRD: getFormatteddate(paymentDate),
            MOP: paymentMode,
          });
        }
      }
    } catch (error) {}
  };

  return (
    <Dialog
      header="Bulk Update"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={onHide}
      draggable={false}
      resizable={false}
    >
      <div className="p-fluid space-y-4">
        <div className="mb-4">
          <label className="block mb-1">Payment Received Date</label>
          <Calendar
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.value as Date)}
            showIcon
            placeholder="Select date"
            className="w-full"
          />
          {errors.paymentDate && (
            <small className="text-red-500">{errors.paymentDate}</small>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1">RTGS Number</label>
          <InputText
            value={rtgsNumber}
            onChange={(e) => setRtgsNumber(e.target.value)}
            placeholder="Enter RTGS number"
            className="w-full"
          />
          {errors.rtgsNumber && (
            <small className="text-red-500">{errors.rtgsNumber}</small>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Payment Mode</label>
          <Dropdown
            value={paymentMode}
            options={paymentOptions}
            onChange={(e) => setPaymentMode(e.value)}
            placeholder="Select a payment mode"
            optionLabel="name"
            optionValue="code"
            className="w-full"
          />
          {errors.paymentMode && (
            <small className="text-red-500">{errors.paymentMode}</small>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button label="Cancel" severity="secondary" onClick={onHide} />
          <Button label="Submit" onClick={handleSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default BulkUpdate;
