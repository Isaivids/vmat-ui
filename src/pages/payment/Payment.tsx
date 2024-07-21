import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  getTransCrossing,
  updateTransAdvance,
} from "../../store/slice/transSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Paginator } from "primereact/paginator";
import { formatDate, getTBP, messages } from "../../api/constants";
import { Toast } from "primereact/toast";
import CommonDatePicker from "../../components/calender/CommonDatePicker";
import CommonDropdown from "../../components/dropdown/CommonDropdown";
import CustomButtonComponent from "../../components/button/CustomButtonComponent";
import { Button } from "primereact/button";
import { downloadPDF } from "../tcp/document";
import { Checkbox } from "primereact/checkbox";
const Payment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);
  const searchQuery = useSelector((state: any) => state.search);
  const modeOfPayments = messages.modeofpayments;
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const userDetails = useSelector((state: any) => state.user);
  const [rowColor, setRowColor]:any = useState([])
  // chekcbox
  const [showPending, setShowPending] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [filteredData, setFilteredData]:any = useState([]);
  //pagination
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(0);
  const onPageChange = (event: any) => {
    setPage(event.page);
    setFirst(event.first);
    setRows(event.rows);
  };

  const onInputChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        const updatedRow = { ...row, [field]: value };
        const currentPlusOrMinus = Number(row.plusorminus) || 0;
        const newPlusOrMinusValue = Number(value) || 0;

        if (field === "plusorminus") {
          updatedRow.loadunloadchar =
            Number(row.loadunloadchar) -
            Number(currentPlusOrMinus) +
            Number(newPlusOrMinusValue);
        }
        updatedRow.tyrasporterpaidamt =
          Number(updatedRow.ats.transbln) +
          Number(updatedRow.loadunloadchar) +
          Number(updatedRow.loadingwagespending) +
          Number(updatedRow.extraloadingwagespaidbydriver);

        return updatedRow;
      }
      return row;
    });
    setData(newData);
  };

  const onInputBlur = (id: any, field: any) => {
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        if (field === "plusorminus") {
          const updatedRow = { ...row, [field]: 0 };
          return updatedRow;
        }
      }
      return row;
    });
    setData(newData);
  };

  const renderInput = (rowData: any, field: any) => {
    const isStringField = ["remarks", "rtgsnumber"].includes(field.field);
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field]}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        keyfilter={isStringField ? undefined : "num"}
        onBlur={() => onInputBlur(rowData._id, field.field)}
      />
    );
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

  const getFormattedDate = (inputDate: any) => {
    if (["", null, undefined].includes(inputDate)) {
      return "";
    } else {
      const date = new Date(inputDate);
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      return localDate;
    }
  };

  const handleSave = async (rowData: any) => {
    const payload = {
      loadunloadchar: Number(rowData.loadunloadchar),
      tyrasporterpaidamt: Number(rowData.tyrasporterpaidamt),
      modeofpayment: rowData.modeofpayment,
      paymentreceiveddate: getFormattedDate(rowData.paymentreceiveddate),
      remarks: rowData.remarks,
      extraloadingwagespaidbydriver: Number(
        rowData.extraloadingwagespaidbydriver
      ),
      loadingwagespending: Number(rowData.loadingwagespending),
      rtgsnumber: rowData.rtgsnumber,
      _id: rowData._id,
      atsid: rowData.ats._id,
    };
    try {
      const response = await dispatch(updateTransAdvance(payload));
      if (response.payload.data && !response.payload.error) {
        const index = data.findIndex((item: any) => item._id === rowData._id);
        if (index !== -1) {
          data[index]._id = response.payload.data._id;
          const updatedRowColor = rowColor.map((item: any) => {
            if (item._id === rowData._id) {
              return { ...item, modeofpayment: response.payload.data.modeofpayment };
            }
            return item;
          });   
          setRowColor(updatedRowColor);
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

  const handleEdit = (rowData: any) => {
    setSelectedRowId(rowData._id);
    setBackupData([...data]);
  };

  const handleCancel = () => {
    if (backupData) {
      setData(backupData);
      setBackupData(null);
    }
    setSelectedRowId(null);
  };

  const onDateChange = (e: any, id: any, field: any) => {
    const value = e.value;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setData(newData);
  };

  const onDropdownChange = (e: any, id: any, field: any) => {
    const { value } = e;
    const newData = data.map((row: any) => {
      if (row._id === id) {
        return { ...row, [field]: value.code };
      }
      return row;
    });
    setData(newData);
  };

  const renderDatePicker = (rowData: any, field: any) => {
    return (
      <CommonDatePicker
        rowData={rowData}
        field={field}
        selectedRowId={selectedRowId}
        onDateChange={onDateChange}
        isAdmin={userDetails}
      />
    );
  };

  const renderDropdown = (rowData: any, field: any) => {
    const selectedValue = messages.modeofpayments.find(
      (option: any) => option.code === rowData.modeofpayment
    );
    return (
      <CommonDropdown
        selectedValue={selectedValue}
        rowData={rowData}
        field={field}
        modeOfPayments={modeOfPayments}
        selectedRowId={selectedRowId}
        handleDropdownChange={onDropdownChange}
      />
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(
        getTransCrossing({
          limit: rows,
          offset: page * rows,
          search: searchQuery,
        })
      );
      if (Array.isArray(trcukData.payload.data) && !trcukData.payload.error) {
        setData(trcukData.payload.data);
        setRowColor(trcukData.payload.data);
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

  const rowClassName = (rowData: any) => {
    const color:any = rowColor.filter((x:any) => x._id === rowData._id);
    if(color.length){
      if (["PENDING", "", null, undefined].includes(color[0].modeofpayment)) {
        return "red";
      }
      return "green";
    }
  };

  useEffect(() => {
    filterDataFunction(data, showPending, showCompleted);
  }, [data, showPending, showCompleted]);

  const filterDataFunction = (
    data: any,
    showPending: boolean,
    showCompleted: boolean
  ) => {
    const filtered = data.filter((row: any) => {
      if (
        showPending &&
        [null, "", undefined, "PENDING"].includes(row.modeofpayment)
      ) {
        return true;
      }
      if (
        showCompleted &&
        ![null, "", undefined, "PENDING"].includes(row.modeofpayment)
      ) {
        return true;
      }
      return false;
    });
    setFilteredData(filtered);
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    if (name === "pending") {
      setShowPending(checked);
      filterDataFunction(data, checked, showCompleted);
    } else if (name === "completed") {
      setShowCompleted(checked);
      filterDataFunction(data, showPending, checked);
    }
  };

  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <Toast ref={toast} />
      <div className="flex justify-content-between">
      <Button
        label="Download"
        severity="secondary"
        onClick={() => downloadPDF(selectedProducts, getTBP(),searchQuery,7)}
        disabled={selectedProducts.length <= 0}
        className="mb-2"
      />
              <div className="flex align-items-center my-3">
          <Checkbox
            inputId="pending"
            name="pending"
            checked={showPending}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="pending" className="mr-4">
            Pending
          </label>
          <Checkbox
            inputId="completed"
            name="completed"
            checked={showCompleted}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="completed" className="mr-4">
            Completed
          </label>
        </div>
      </div>
      <DataTable
        value={filteredData}
        showGridlines
        scrollable
        scrollHeight="80vh"
        rowClassName={rowClassName}
        selection={selectedProducts}
        onSelectionChange={(e: any) => setSelectedProducts(e.value)}
      >
        <Column selectionMode="multiple"></Column>
        <Column
          field="ats.sno"
          header="S.No"
          style={{ minWidth: "100px" }}
        ></Column>
        <Column
          field="ats.date"
          header="Date"
          body={(rowData:any) => formatDate(rowData.ats.date)}
          style={{ minWidth: "100px" }}
        ></Column>
        <Column field="ats.truckname" header="Truck Name"></Column>
        <Column field="ats.trucknumber" header="Truck Number"></Column>
        <Column field="ats.from" header="From"></Column>
        <Column field="ats.to" header="To"></Column>
        <Column field="ats.transbln" header="Transport balance"></Column>
        <Column
          field="loadingwagespending"
          header="Loading Wages Pending"
          body={renderInput}
        ></Column>
        <Column
          field="extraloadingwagespaidbydriver"
          header="Extra loading wages paid by driver"
          body={renderInput}
        ></Column>
        <Column
          field="loadunloadchar"
          header="Unloading Wages"
          // body={renderInput}
        ></Column>
        <Column
          field="plusorminus"
          header="Unloading Charge"
          body={renderInput}
        ></Column>
        <Column
          field="tyrasporterpaidamt"
          header="Transporter to be Paid"
          style={{ minWidth: "200px" }}
        ></Column>
        <Column field="remarks" header="Remarks" body={renderInput}></Column>
        <Column
          field="paymentreceiveddate"
          header="Payment Received Date"
          body={renderDatePicker}
        ></Column>
        <Column
          field="modeofpayment"
          header="Mode Of Payment"
          body={renderDropdown}
        ></Column>
        <Column
          field="rtgsnumber"
          header="RTGS Number"
          body={renderInput}
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
        rowsPerPageOptions={[10, 20, 30]}
      />
    </div>
  );
};

export default Payment;
