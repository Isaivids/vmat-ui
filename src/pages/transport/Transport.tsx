import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import {
  gettruckdetail,
  updateTruckDetail,
} from "../../store/slice/transportSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { InputText } from "primereact/inputtext";
const Transport = () => {
  const [data, setData]: any = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);

  const onInputChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setData(newData);
  };

  const renderInput = (rowData: any, field: any) => {
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field] || ""}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
      />
    );
  };

  const handleSave = async (rowData: any) => {
    const payload = {
      address: rowData.address,
      phonenumber: rowData.phonenumber,
      _id: rowData._id,
    };
    try {
      const response = await dispatch(updateTruckDetail(payload));
      if (response.payload.data && !response.payload.error) {
        const index = data.findIndex((item: any) => item._id === rowData._id);
        if (index !== -1) {
          data[index]._id = response.payload.data._id;
        }
        setSelectedRowId(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    if (backupData) {
      setData(backupData);
      setBackupData(null);
    }
    setSelectedRowId(null);
  };

  const handleEdit = (rowData: any) => {
    setSelectedRowId(rowData._id);
    setBackupData([...data]);
  };

  const renderButton = (rowData: any) => {
    return (
      <div className="flex gap-2">
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

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(gettruckdetail());
      if (trcukData.payload.data.length && !trcukData.payload.error) {
        setData(trcukData.payload.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchDataAndLog = async () => {
      await fetchData();
    };
    fetchDataAndLog();
  }, [fetchData]);

  return (
    <div className="p-2 w-screen">
      <DataTable value={data} showGridlines>
        <Column field="ats.truckname" header="Transport Name"></Column>
        <Column field="address" header="Address" body={renderInput}></Column>
        <Column
          field="phonenumber"
          header="Phone Number"
          body={renderInput}
        ></Column>
        <Column
          header="Actions"
          body={renderButton}
          style={{ width: "200px", right: "0", position: "sticky" }}
        ></Column>
      </DataTable>
    </div>
  );
};

export default Transport;
