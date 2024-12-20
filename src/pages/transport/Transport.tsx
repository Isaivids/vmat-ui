import React, { useCallback, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { InputTextarea } from "primereact/inputtextarea";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { initialrows, messages, paginationRows } from "../../api/constants";
import { getTransportDetail, updateTransportDetail } from "../../store/slice/truckSlice";
import CustomButtonComponent from "../../components/button/CustomButtonComponent";

const Transport = () => {
  const searchQuery = useSelector((state: any) => state.search.query);
  const toast = useRef<Toast>(null);
  const [data, setData]: any = useState([]);
  const dispatch: any = useDispatch<AppDispatch>();
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  //pagination
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(initialrows);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(0);
  const onPageChange = (event: any) => {
    setPage(event.page);
    setFirst(event.first);
    setRows(event.rows);
  };
  // ----------end of pagination
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
      <InputTextarea
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field]}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        rows={1} 
        cols={30}
        autoResize
      />
    );
  };

  const handleSave = async (rowData: any) => {
    // const { isValid, missingFields } = validateFields(rowData);
    // if (!isValid) {
    //   toast.current?.show({
    //     severity: "error",
    //     summary: messages.validationerror,
    //     detail: `${missingFields.join(", ")} is required`,
    //     life: 3000,
    //   });
    //   return;
    // }
    const payload = {
      truckname: rowData.truckname,
      transportname: rowData.transportname,
      address: rowData.address,
      phonenumber: rowData.phonenumber,
      accountnumber: rowData.accountnumber,
      pannumber: rowData.pannumber,
      loadingaddress: rowData.loadingaddress,
      unloadingaddress: rowData.unloadingaddress,
      location: rowData.location,
      _id: rowData._id,
    };

    try {
      const response = await dispatch(updateTransportDetail(payload));

      if (!response.payload.error) {
        const index = data.findIndex((item: any) => item._id === rowData._id);
        if (index !== -1) {
          data[index] = response.payload.data;
        } else {
          data.push(response.payload.data);
        }

        setSelectedRowId(null);
        toast.current?.show({
          severity: "success",
          summary: messages.success,
          detail: messages.updateoraddsuccess,
          life: 3000,
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: messages.error,
        detail: messages.updateoraddfailure,
        life: 3000,
      });
    }
  };

  const handleCancel = () => {
    if (backupData) {
      setData(backupData);
      setBackupData(null);
    } else {
      setData(data.filter((row: any) => row._id !== selectedRowId));
    }
    setSelectedRowId(null);
  };

  const handleEdit = (rowData: any) => {
    setSelectedRowId(rowData._id);
    setBackupData([...data]);
  };

  const handleAddNewRow = () => {
    const newRow = {
      _id: new Date(),
      transportname: "",
      truckname: "",
      address: "",
      phonenumber: "",
      accountnumber: "",
      pannumber: "",
      loadingaddress: "",
      unloadingaddress: "",
      location: "",
    };
    setData([newRow, ...data]);
    setSelectedRowId(newRow._id);
  };

  const renderButton = (rowData: any) => {
    return (
      <CustomButtonComponent
        rowData={rowData}
        selectedRowId={selectedRowId}
        handleEdit={handleEdit}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(
        getTransportDetail({ limit: rows, offset: page * rows, search: searchQuery })
      );
      if (Array.isArray(trcukData.payload.data) && !trcukData.payload.error) {
        setData(trcukData.payload.data);
        setTotalPage(trcukData.payload.pagination.totalDocuments);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: messages.error,
        detail: messages.loadfailure,
        life: 3000,
      });
    }
  }, [dispatch, page, rows, searchQuery]);

  useEffect(() => {
    const fetchDataAndLog = async () => {
      await fetchData();
    };
    fetchDataAndLog();
  }, [fetchData]);

  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <Toast ref={toast} />
      <Button
        label="Add New Row"
        severity="info"
        className="mb-2"
        onClick={handleAddNewRow}
      />
      <DataTable value={data} scrollable scrollHeight="80vh" showGridlines>
        <Column
          field="transportname"
          header="Transport Name"
          body={renderInput}
        ></Column>
        <Column field="address" header="Address" body={renderInput}></Column>
        <Column
          field="phonenumber"
          header="Phone Number"
          body={renderInput}
        ></Column>
        <Column field="accountnumber" header="Account Number" body={renderInput}></Column>
        <Column field="pannumber" header="PAN Number" body={renderInput}></Column>
        <Column field="loadingaddress" header="Loading Address" body={renderInput}></Column>
        <Column field="unloadingaddress" header="Unloading Address" body={renderInput}></Column>
        <Column field="location" header="Location" body={renderInput}></Column>
        <Column
          header="Actions"
          body={renderButton}
          style={{ width: "200px", right: "0", position: "sticky" }}
        ></Column>
      </DataTable>
      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalPage}
        onPageChange={onPageChange}
        rowsPerPageOptions={paginationRows}
      />
    </div>
  );
};

export default Transport;
