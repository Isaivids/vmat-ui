/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import {
  gettruckdetail,
  updateTruckDetail,
} from "../../store/slice/transportSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { InputTextarea } from "primereact/inputtextarea";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { initialrows, messages, paginationRows } from "../../api/constants";
import CustomButtonComponent from "../../components/button/CustomButtonComponent";

const TruckDetail = () => {
  const searchQuery = useSelector((state: any) => state.search.query);
  const toast = useRef<Toast>(null);
  const [data, setData]: any = useState([]);
  const dispatch: any = useDispatch<AppDispatch>();
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  const [transportDetails, setTransportDetails] = useState([]);
  //seection
  const [selectedProducts, setSelectedProducts] = useState([]);
  // const [visible, setVisible] = useState(false);
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
        value={rowData[field.field] || ""}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        rows={1}
        cols={30}
        autoResize
      />
    );
  };

  const handleSave = async (rowData: any) => {
    const payload = {
      truckname: rowData.truckname,
      trucknumber: rowData.trucknumber,
      transname: rowData.transname,
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
      const response = await dispatch(updateTruckDetail(payload));

      if (!response.payload.error) {
        const index = backupData.findIndex(
          (item: any) => item._id === rowData._id
        );
        if (index !== -1) {
          // data[index] = response.payload.data;
          const updatedBackupData = backupData.map((item: any) =>
            item._id === rowData._id
              ? {
                  ...item,
                  truckname: response.payload.data.truckname,
                  trucknumber: response.payload.data.trucknumber,
                  transname: response.payload.data.transname,
                  address: response.payload.data.address,
                  phonenumber: response.payload.data.phonenumber,
                  accountnumber: response.payload.data.accountnumber,
                  pannumber: response.payload.data.pannumber,
                  loadingaddress: response.payload.data.loadingaddress,
                  unloadingaddress: response.payload.data.unloadingaddress,
                  location: response.payload.data.location,
                  _id: response.payload.data._id,
                }
              : item
          );
          setBackupData(updatedBackupData);
          setData([...updatedBackupData]);
        } else {
          setBackupData([response.payload.data, ...backupData]);
          setData([response.payload.data, ...backupData]);
          // data.push(response.payload.data);
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

  // const onDropdownChange = (e: any, id: any, field: any) => {
  //   const { value } = e;
  //   const newData: any = data.map((row: any) => {
  //     if (row._id === id) {
  //       return {
  //         ...row,
  //         [field]: value?.transportname,
  //         pannumber: value?.pannumber,
  //         accountnumber: value?.accountnumber,
  //       };
  //     }
  //     return row;
  //   });
  //   setData(newData);
  // };

  // const renderDropdown = (rowData: any, field: any) => {
  //   const selectedValue = transportDetails.find(
  //     (option: any) => option.transportname === rowData?.transname
  //   );
  //   return (
  //     <Dropdown
  //       filter
  //       value={selectedValue}
  //       onChange={(e) => onDropdownChange(e, rowData._id, field.field)}
  //       options={transportDetails}
  //       optionLabel="transportname"
  //       placeholder="Select"
  //       style={{ width: "150px" }}
  //     />
  //   );
  // };

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
    setBackupData(data);
    const filtered = data.filter((x: any) => x._id === rowData._id);
    setData(filtered);
    setSelectedRowId(rowData._id);
  };

  const handleAddNewRow = () => {
    const newRow = {
      _id: new Date(),
      truckname: "",
      trucknumber: "",
      address: "",
      phonenumber: "",
      accountnumber: "",
      pannumber: "",
      loadingaddress: "",
      unloadingaddress: "",
      location: "",
    };
    setBackupData(data);
    setData([newRow]);
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
        gettruckdetail({
          limit: rows,
          offset: page * rows,
          search: searchQuery,
        })
      );
      if (Array.isArray(trcukData.payload.data) && !trcukData.payload.error) {
        setData(trcukData.payload.data);
        setTransportDetails(trcukData.payload.transportDetails);
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
      <div className="flex my-2 gap-2">
        <Button label="Add New Row" severity="info" onClick={handleAddNewRow} />
        {/* <Button
        label="Download"
        severity="secondary"
        onClick={() => downloadPDF(selectedProducts,getTruckDetails(),searchQuery,8)}
        disabled={selectedProducts.length <= 0}
      /> */}
      </div>
      <DataTable
        value={data}
        scrollable
        scrollHeight="80vh"
        showGridlines
        selection={selectedProducts}
        onSelectionChange={(e: any) => setSelectedProducts(e.value)}
        selectionMode={"checkbox"}
      >
        {/* <Column selectionMode="multiple"></Column> */}
        <Column
          field="truckname"
          header="Truck Name"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderInput(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column>
        <Column
          field="trucknumber"
          header="Truck Number"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderInput(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column>
        {/* <Column
          field="transname"
          header="Transport Name"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderDropdown(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column> */}
        <Column
          field="address"
          header="Address"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderInput(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column>
        <Column
          field="phonenumber"
          header="Phone Number"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderInput(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column>
        <Column
          field="accountnumber"
          header="Account Number"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderInput(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column>
        <Column
          field="pannumber"
          header="PAN Number"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderInput(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column>
        {/* <Column
          field="loadingaddress"
          header="Loading Address"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderInput(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column>
        <Column
          field="unloadingaddress"
          header="Unloading Address"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderInput(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column> */}
        <Column
          field="location"
          header="Location"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderInput(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column>
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

export default TruckDetail;
