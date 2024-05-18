import React, { useState } from "react";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import AdvVmat from "../../components/grids/Adv_vmat";
import AdvTrans from "../../components/grids/Adv_trans";
import AdvTwopay from "../../components/grids/Adv_twopay";

const Advance = () => {
  const [selection, setSelection] = useState<string>('1');

  const RadioSelection = () =>{
    return(
      <div className="flex my-3">
            <div className="flex flex-wrap gap-3">
                <div className="flex align-items-center">
                    <RadioButton inputId="vmat" value="1" onChange={(e: RadioButtonChangeEvent) => setSelection(e.value)} checked={selection === '1'} />
                    <label htmlFor="vmat" className="ml-2">By Vmat</label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="transporter" value="2" onChange={(e: RadioButtonChangeEvent) => setSelection(e.value)} checked={selection === '2'} />
                    <label htmlFor="transporter" className="ml-2">By Transporter</label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="twopay" value="3" onChange={(e: RadioButtonChangeEvent) => setSelection(e.value)} checked={selection === '3'} />
                    <label htmlFor="twopay" className="ml-2">By 2 Pay</label>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <RadioSelection />
      {selection === '1' && <AdvVmat />}
      {selection === '2' && <AdvTrans />}
      {selection === '3' && <AdvTwopay />}
    </div>
  );
};

export default Advance;
