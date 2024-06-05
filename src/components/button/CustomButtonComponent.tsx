import React from 'react';
import { Button } from 'primereact/button';

interface CustomButtonComponentProps {
  rowData: any;
  selectedRowId: string | null;
  handleEdit: (rowData: any) => void;
  handleSave: (rowData: any) => void;
  handleCancel: () => void;
}

const CustomButtonComponent: React.FC<CustomButtonComponentProps> = ({
  rowData,
  selectedRowId,
  handleEdit,
  handleSave,
  handleCancel,
}) => {
  return (
    <div className="flex gap-2 justify-content-center">
      {!selectedRowId && (
        <Button
          label="Edit"
          severity="warning"
          onClick={() => handleEdit(rowData)}
        />
      )}
      {selectedRowId === rowData._id && (
        <>
          <Button
            label="Save"
            severity="success"
            onClick={() => handleSave(rowData)}
          />
          <Button label="Cancel" severity="danger" onClick={handleCancel} />
        </>
      )}
    </div>
  );
};

export default CustomButtonComponent;
