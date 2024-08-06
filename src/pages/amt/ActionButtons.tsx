import React from "react";
import { Button } from "primereact/button";

interface ActionButtonsProps {
  rowData: any;
  selectedRowId: string | null;
  handleEdit: (id: string) => void;
  confirm2: (event: any, id: string) => void;
  openReceiptDialog: (rowData: any) => void;
  getMemoOpen: (rowData: any) => void;
  handleSave: (id: string) => void;
  handleCancel: (id: string) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  rowData,
  selectedRowId,
  handleEdit,
  confirm2,
  openReceiptDialog,
  getMemoOpen,
  handleSave,
  handleCancel,
}) => {
  return (
    <div className="flex gap-2 justify-content-center">
      {!selectedRowId ? (
        <>
          <Button
            label="Edit"
            severity="warning"
            onClick={() => handleEdit(rowData._id)}
          />
          <Button
            severity="danger"
            onClick={(event: any) => confirm2(event, rowData._id)}
          >
            <i className="pi pi-trash"></i>
          </Button>
          <Button
            label="Bill"
            severity="secondary"
            onClick={() => openReceiptDialog(rowData)}
          />
          <Button label="Memo" onClick={() => getMemoOpen(rowData)} />
        </>
      ) : selectedRowId === rowData._id ? (
        <>
          <Button
            label="Save"
            severity="success"
            onClick={() => handleSave(rowData._id)}
          />
          <Button
            label="Cancel"
            severity="danger"
            onClick={() => handleCancel(rowData._id)}
          />
        </>
      ) : null}
    </div>
  );
};

export default ActionButtons;
