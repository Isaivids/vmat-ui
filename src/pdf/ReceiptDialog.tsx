import { Dialog } from 'primereact/dialog';
import React from 'react'
import TransportReceipt from './TransportReceipt';

const ReceiptDialog = ({receipt,setReceipt,selectedData}:any) => {
  return (
    <Dialog
      header="Receipt"
      visible={receipt}
      style={{ width: "70vw" }}
      onHide={() => {
        if (!receipt) return;
        setReceipt(false);
      }}
    >
      <TransportReceipt data={selectedData}/>
    </Dialog>
  )
}

export default ReceiptDialog