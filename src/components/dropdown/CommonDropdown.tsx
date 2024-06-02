import React from 'react';
import { Dropdown } from 'primereact/dropdown';

interface CommonDropdownProps {
  rowData: any;
  field: any;
  modeOfPayments: { code: string; name: string }[];
  selectedRowId: string;
  handleDropdownChange: (e: any, id: string, field: string) => void;
}

const CommonDropdown: React.FC<CommonDropdownProps> = ({
  rowData,
  field,
  modeOfPayments,
  selectedRowId,
  handleDropdownChange
}) => {
  const selectedValue = modeOfPayments.find(
    (option) => option.code === rowData.modeofpayment
  );

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
