import React from 'react';
import { Dropdown } from 'primereact/dropdown';

interface CommonDropdownProps {
  selectedValue : any,
  rowData: any;
  field: any;
  modeOfPayments: { code: string; name: string }[];
  selectedRowId: string;
  handleDropdownChange: (e: any, id: string, field: string) => void;
}

const CommonDropdown: React.FC<CommonDropdownProps> = ({
  selectedValue,
  rowData,
  field,
  modeOfPayments,
  selectedRowId,
  handleDropdownChange
}) => {

  return (
    <Dropdown
      value={selectedValue}
      options={modeOfPayments}
      optionLabel="name"
      placeholder="Select"
      disabled={rowData._id !== selectedRowId}
      onChange={(e) => handleDropdownChange(e, rowData._id, field.field)}
      style={{ width: '150px' }}
    />
  );
};

export default CommonDropdown;
