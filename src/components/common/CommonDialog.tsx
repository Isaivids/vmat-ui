import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { downloadPDF } from "../../pages/tcp/document";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";

interface CommonDialogProps {
  visible: boolean;
  onHide: () => void;
  getDetails: { field: string; header: string }[];
  data: any;
  type: number;
  searchQuery?: string;
}

const CommonDialog: React.FC<CommonDialogProps> = ({
  visible,
  onHide,
  getDetails,
  data,
  type,
  searchQuery,
}) => {
  const initialForm = [
    { remark: "", amount: "" },
    { remark: "", amount: "" },
    { remark: "", amount: "" },
  ];
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e: any, index: any, field: any) => {
    const updatedRows: any = [...formData];
    updatedRows[index][field] = e.target.value;
    setFormData(updatedRows);
  };

  const footerContent = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => {
          onHide();
          setFormData(initialForm);
        }}
        className="p-button-text"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => {
          onHide();
          downloadPDF(
            data,
            getDetails,
            searchQuery,
            type,
            totalValue,
            formData,
          );
          setFormData(initialForm);
        }}
        autoFocus
      />
    </div>
  );

  const getColumnName = (type: number): string => {
    switch (type) {
      case 1:
        return "total";
      case 3:
        return "total";
      case 6:
        return "total";
      case 2:
        return "transadvtotruck";
      case 4:
        return "finaltotaltotruckowner";
      case 5:
        return "totalcrossing";
      case 7:
        return "tyrasporterpaidamt";
      case 9:
        return "transporterpaidadvanceamount";
      case 11 : 
        return "finaltotaltotruckowner";
      case 10:
        return "tyrasporterpaidamt";
      default:
        return "total"; // fallback
    }
  };

  const totalColumn = getColumnName(type);
  const totalValue = data?.reduce((sum: number, item: any) => {
    const value = parseFloat(item?.[totalColumn]) || 0;
    return sum + value;
  }, 0);

  return (
    <Dialog
      header="Notes"
      visible={visible}
      onHide={() => {
        if (!visible) return;
        onHide();
        setFormData(initialForm);
      }}
      style={{ width: "50vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      footer={footerContent}
    >
      <div className="flex flex-column gap-3">
        <h4>Total Amount: {totalValue}</h4>
        <div className="flex flex-column gap-3">
          {formData.map((row, index) => (
            <div className="flex gap-2 my-2" key={index}>
              <InputTextarea
                autoResize
                rows={1}
                className="col-5"
                placeholder="Enter the Remark"
                value={row.remark}
                onChange={(e) => handleChange(e, index, "remark")}
              />
              <InputText
                keyfilter="num"
                className="col-5"
                placeholder="Enter the Amount"
                value={row.amount}
                onChange={(e) => handleChange(e, index, "amount")}
              />
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
};

export default CommonDialog;
