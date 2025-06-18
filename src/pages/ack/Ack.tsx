import React, { useCallback, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getAck, updateAck } from "../../store/slice/ackSlice";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import {
  formatDate,
  getACK,
  getACK2,
  initialrows,
  messages,
  paginationRows,
} from "../../api/constants";
import { Checkbox } from "primereact/checkbox";
import CommonDatePicker from "../../components/calender/CommonDatePicker";
import CommonDropdown from "../../components/dropdown/CommonDropdown";
import CustomButtonComponent from "../../components/button/CustomButtonComponent";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";
import BulkUpdate from "../../components/dialogamt/BulkUpdate";
import CommonDialog from "../../components/common/CommonDialog";
const Ack = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  const searchQuery = useSelector((state: any) => state.search);
  const toast = useRef<Toast>(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const userDetails = useSelector((state: any) => state.user);
  const [rowColor, setRowColor]: any = useState([]);
  const [type, setType] = useState(1);
  const [visible, setVisible] = useState(false);
  // chekcbox
  const [showPending, setShowPending] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [newData, setNewData] = useState(true);
  const [showBulkUpdateDialog, setShowBulkUpdateDialog] = useState(false);
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

  const calculateUpdatedRow = (updatedRow: any) => {
    let addThree = 0;
    if ([3, 4, 5].includes(updatedRow.ats.modeofadvance)) {
      if (updatedRow.hidevc) {
        addThree += updatedRow.vmatcrossing;
      }
      if (updatedRow.hidevcm) {
        addThree += updatedRow.vmatcommision;
      }
      if (updatedRow.hidetc) {
        addThree += updatedRow.transcrossing;
      }
    } else {
      if ([1, 2].includes(updatedRow.ats.modeofadvance)) {
        addThree = updatedRow.vmatcommision;
      }
      if (updatedRow.hidetc) {
        addThree += 0;
      }
      if (updatedRow.hidevc) {
        addThree += 0;
      }
      if (updatedRow.hidevcm) {
        addThree += 0;
      }
    }
    if ([3, 4, 5].includes(updatedRow.ats.modeofadvance)) {
      updatedRow.pendingamountfromtruckowner =
        addThree + Number(updatedRow.expense);
      updatedRow.finaltotaltotruckowner =
        Number(updatedRow.ats.twopay) -
        Number(addThree) -
        Number(updatedRow.tdsack) +
        Number(updatedRow.expense) -
        Number(updatedRow.podcharge) -
        Math.abs(updatedRow.ats.lateday) +
        Number(updatedRow.ats.halting) +
        Number(updatedRow.loadingcharges || 0) +
        Number(updatedRow.others || 0);
        console.log("updatedRow.finaltotaltotruckowner", updatedRow.finaltotaltotruckowner);
    } else {
      updatedRow.pendingamountfromtruckowner = 0;
      // updatedRow.pendingamountfromtruckowner = Number(updatedRow.ats.truckbln) + (Number(addThree) + Number(expense) + Number(halting));
      updatedRow.finaltotaltotruckowner =
        Number(updatedRow.ats.truckbln)-
        // Number(updatedRow.tdsack) -
        Number(addThree) -
        Number(updatedRow.podcharge) -
        Math.abs(updatedRow.ats.lateday) +
        Number(updatedRow.ats.halting) +
        Number(updatedRow.expense) +
        Number(updatedRow.loadingcharges || 0) +
        Number(updatedRow.others || 0);
    }
    return updatedRow;
  };

  const onInputChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        const updatedRow: any = { ...row, [field]: value };
        if (["rtgsnumber", "remark"].includes(field)) {
          return updatedRow;
        }
        if (field === "trpaidtotruck" && Number(updatedRow.trpaidtotruck)) {
          const diffto =
            Number(updatedRow.trpaidtotruck) -
            Number(updatedRow.finaltotaltotruckowner);
          if (Math.sign(diffto) === 1) {
            updatedRow.diffto = diffto;
            updatedRow.difffrom = 0;
          } else {
            updatedRow.difffrom = Math.abs(diffto);
            updatedRow.diffto = 0;
          }
          return updatedRow;
        }
        return calculateUpdatedRow(updatedRow);
      }
      return row;
    });
    setData(newData);
  };

  const onDateChange = (e: any, id: any, field: any) => {
    const value = e.value;
    const newData = data.map((row: any) => {
      if (row._id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setData(newData);
  };

  const onDropdownChange = (e: any, id: any, field: any) => {
    const { value } = e;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        const updatedRow = { ...row, [field]: value.code };
        return calculateUpdatedRow(updatedRow);
      }
      return row;
    });
    setData(newData);
  };

  const getFormattedDate = (inputDate: any) => {
    const date = new Date(inputDate);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    return localDate;
  };

  const onTextAreaChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setData(newData);
  };

  const renderTextArea = (rowData: any, field: any) => {
    return (
      <div>
        {rowData._id === selectedRowId ? (
          <InputTextarea
            disabled={rowData._id !== selectedRowId}
            value={rowData[field.field] || ""}
            onChange={(e) => onTextAreaChange(e, rowData._id, field.field)}
            rows={1}
            cols={30}
            autoResize
          />
        ) : (
          <span style={{ whiteSpace: "pre-wrap" }}>
            {rowData[field.field] || ""}
          </span>
        )}
      </div>
    );
  };

  const handleSave = async (rowData: any) => {
    const payload = {
      acknowledgementReceivedDate: rowData.acknowledgementReceivedDate
        ? getFormattedDate(rowData.acknowledgementReceivedDate)
        : "",
      hidevc: rowData.hidevc,
      hidevcm: rowData.hidevcm,
      hidetc: rowData.hidetc,
      expense: Number(rowData.expense),
      finaltotaltotruckowner: Number(rowData.finaltotaltotruckowner),
      paymentReceivedDate: rowData.paymentReceivedDate
        ? getFormattedDate(rowData.paymentReceivedDate)
        : "",
      modeofpayment: rowData.modeofpayment,
      podcharge: rowData.podcharge,
      rtgsnumber: rowData.rtgsnumber,
      tdsack: Number(rowData.tdsack),
      trpaidtotruck: Number(rowData.trpaidtotruck),
      diffto: Number(rowData.diffto),
      difffrom: Number(rowData.difffrom),
      _id: rowData._id,
      ats: rowData.ats,
      remark: rowData.remark,
      others: Number(rowData.others || 0),
      loadingcharges: Number(rowData.loadingcharges || 0),
    };
    try {
      const response = await dispatch(updateAck(payload));
      if (response.payload.data && !response.payload.error) {
        const index = backupData.findIndex(
          (item: any) => item._id === rowData._id
        );
        if (index !== -1) {
          const {
            acknowledgementReceivedDate,
            hidevc,
            hidevcm,
            hidetc,
            expense,
            finaltotaltotruckowner,
            paymentReceivedDate,
            modeofpayment,
            podcharge,
            rtgsnumber,
            tdsack,
            remark,
            trpaidtotruck,
            diffto,
            difffrom,
            loadingcharges,
            others,
          } = response.payload.data;
          const updatedBackupData = backupData.map((item: any) =>
            item._id === rowData._id
              ? {
                  ...item,
                  acknowledgementReceivedDate: acknowledgementReceivedDate,
                  hidevc: hidevc,
                  hidevcm: hidevcm,
                  hidetc: hidetc,
                  expense: Number(expense),
                  finaltotaltotruckowner: Number(finaltotaltotruckowner),
                  paymentReceivedDate: paymentReceivedDate,
                  modeofpayment: modeofpayment,
                  podcharge: podcharge,
                  rtgsnumber: rtgsnumber,
                  tdsack: Number(tdsack),
                  remark: remark,
                  trpaidtotruck: Number(trpaidtotruck),
                  diffto: Number(diffto),
                  difffrom: Number(difffrom),
                  others: Number(others),
                  loadingcharges: Number(loadingcharges),
                }
              : item
          );
          setBackupData(updatedBackupData);
          const updatedRowColor = rowColor.map((item: any) => {
            if (item._id === rowData._id) {
              return {
                ...item,
                modeofpayment: response.payload.data.modeofpayment,
                acknowledgementReceivedDate:
                  response.payload.data.acknowledgementReceivedDate,
              };
            }
            return item;
          });
          setData([...updatedBackupData]);
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

  const handleCancel = () => {
    if (backupData) {
      setData(backupData);
      setBackupData(null);
    }
    setSelectedRowId(null);
  };

  const renderInput = (rowData: any, field: any) => {
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field] || ""}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        autoComplete="off"
      />
    );
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
    let dropValues: any = [];
    let selectedValue: any;
    if (field.field === "podcharge") {
      dropValues = messages.podCharge;
      selectedValue = dropValues.find(
        (option: any) => option.code === rowData.podcharge
      );
    } else {
      dropValues = messages.modeofpayments;
      selectedValue = dropValues.find(
        (option: any) => option.code === rowData.modeofpayment
      );
    }

    return (
      <CommonDropdown
        selectedValue={selectedValue}
        rowData={rowData}
        field={field}
        modeOfPayments={dropValues}
        selectedRowId={selectedRowId}
        handleDropdownChange={onDropdownChange}
      />
    );
  };

  const handleEdit = (rowData: any) => {
    setSelectedRowId(rowData._id);
    setSelectedProducts([]);
    setBackupData(data);
    const filtered = data.filter((x: any) => x._id === rowData._id);
    setData(filtered);
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

  const getType = useCallback(() => {
    if (showPending && showCompleted && newData) {
      return 0;
    } else if (showPending && showCompleted) {
      return 6;
    } else if (showPending && newData) {
      return 5;
    } else if (showCompleted && newData) {
      return 4;
    } else if (showCompleted) {
      return 3;
    } else if (newData) {
      return 2;
    } else if (showPending) {
      return 1;
    } else {
      return 7;
    }
  }, [showCompleted, showPending, newData]);

  const fetchData = useCallback(async () => {
    try {
      const ackdata = await dispatch(
        getAck({
          limit: rows,
          offset: page * rows,
          search: searchQuery,
          ftype: getType(),
          screen: type,
        })
      );
      if (Array.isArray(ackdata.payload.data) && !ackdata.payload.error) {
        setData(ackdata.payload.data);
        setRowColor(ackdata.payload.data);
        setTotalPage(ackdata.payload.pagination.totalDocuments);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: messages.error,
        detail: messages.loadfailure,
        life: 3000,
      });
    }
  }, [dispatch, getType, page, rows, searchQuery, type]);

  useEffect(() => {
    const fetchDataAndLog = async () => {
      await fetchData();
    };
    fetchDataAndLog();
  }, [fetchData]);

  const rowClassName = (rowData: any) => {
    const color: any = rowColor.filter((x: any) => x._id === rowData._id);
    if (color.length) {
      if (
        ["", null, undefined].includes(color[0].acknowledgementReceivedDate)
      ) {
        return "";
      } else {
        if (["PENDING", "", null, undefined].includes(color[0].modeofpayment)) {
          return "red";
        } else if (
          !["PENDING", "", null, undefined].includes(color[0].modeofpayment)
        ) {
          return "green";
        }
      }
    }
  };

  const handleCheckboxChange2 = (e: any) => {
    const { name, checked } = e.target;
    if (name === "pending") {
      setShowPending(checked);
    } else if (name === "completed") {
      setShowCompleted(checked);
    } else if (name === "newdata") {
      setNewData(checked);
    }
  };

  // Compute totals for each column
  const computeTotal = (field: any) => {
    return data
      .reduce((acc: any, item: any) => acc + (parseFloat(item[field]) || 0), 0)
      .toFixed(2);
  };

  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <Toast ref={toast} />
      <div className="flex justify-content-between align-items-center">
        <Button
          style={{ height: "30px" }}
          label="Download"
          severity="secondary"
          onClick={() => setVisible(true)}
          disabled={selectedProducts.length <= 0}
          className="mb-2"
        />
        <Button
          style={{ height: "30px" }}
          className="mb-1"
          label="Bulk Update"
          severity="warning"
          disabled={selectedProducts.length <= 0}
          onClick={() => setShowBulkUpdateDialog(true)}
        />
        <div className="card flex justify-content-center">
          <div className="flex flex-wrap gap-3">
            <div className="flex align-items-center">
              <RadioButton
                inputId="type1"
                name="type1"
                value={1}
                onChange={(e) => {setType(e.value); setSelectedProducts([])}}
                checked={type === 1}
              />
              <label htmlFor="type1" className="ml-2">
                Truck Balance by VMAT
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton
                inputId="type2"
                name="type2"
                value={2}
                onChange={(e) => {setType(e.value); setSelectedProducts([])}}
                checked={type === 2}
              />
              <label htmlFor="type2" className="ml-2">
                Truck Balance by Transporter
              </label>
            </div>
          </div>
        </div>
        <div className="flex align-items-center my-3">
          <Checkbox
            inputId="pending"
            name="pending"
            checked={showPending}
            onChange={handleCheckboxChange2}
            className="mr-2"
          />
          <label htmlFor="pending" className="mr-4">
            Pending
          </label>
          <Checkbox
            inputId="completed"
            name="completed"
            checked={showCompleted}
            onChange={handleCheckboxChange2}
            className="mr-2"
          />
          <label htmlFor="completed" className="mr-4">
            Completed
          </label>
          <Checkbox
            inputId="newdata"
            name="newdata"
            checked={newData}
            onChange={handleCheckboxChange2}
            className="mr-2"
          />
          <label htmlFor="newdata" className="mr-4">
            New Data
          </label>
        </div>
      </div>
      <DataTable
        value={data}
        showGridlines
        scrollable
        scrollHeight="70vh"
        rowClassName={rowClassName}
        selection={selectedProducts}
        onSelectionChange={(e: any) => setSelectedProducts(e.value)}
        selectionMode={"checkbox"}
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
          body={(rowData: any) => formatDate(rowData.ats.date)}
          style={{ minWidth: "100px" }}
        ></Column>
        <Column
          field="acknowledgementReceivedDate"
          header="Ack.Rec Date"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderDatePicker(rowData, field)
            ) : (
              <span>{formatDate(rowData[field.field]) || ""}</span>
            )
          }
        ></Column>
        <Column
          field="ats.truckname"
          header="Truck Name"
          style={{ minWidth: "150px" }}
        ></Column>
        <Column field="ats.trucknumber" header="Truck Number"></Column>
        <Column field="ats.transname" header="Transport Name"></Column>
        <Column field="ats.from" header="From"></Column>
        <Column field="ats.to" header="To"></Column>
        {type === 1 && <Column field="ats.truckbln" header="Truck Balance"></Column>}
        {type === 2 && <Column field="ats.twopay" header="By To Pay"></Column>}
        <Column
          field="expense"
          header="Unloading Wages"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderInput(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column>
        <Column
          field="loadingcharges"
          header="Loading Charges"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderInput(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column>
        {type === 2 && (
          <Column
            field="tdsack"
            header="TDS"
            body={(rowData: any, field: any) =>
              selectedRowId === rowData._id ? (
                renderInput(rowData, field)
              ) : (
                <span>{rowData[field.field] || ""}</span>
              )
            }
          ></Column>
        )}
        <Column
          field="others"
          header="Others"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderInput(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column>
        <Column field="ats.lateday" header="Late Delivery"></Column>
        <Column field="ats.halting" header="Halting"></Column>
        <Column field="remark" header="Remark" body={renderTextArea}></Column>
        <Column
          field="podcharge"
          header="POD Charge"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderDropdown(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column>
        {type === 2 && (
          <Column field="vmatcommision" header="VMAT Commission"></Column>
        )}
        {type === 2 && (
          <Column field="vmatcrossing" header="VMAT Crossing"></Column>
        )}
        {type === 2 && (
          <Column field="transcrossing" header="Transport Crossing"></Column>
        )}
        {type === 1 && (
          <Column field="vmatcommision" header="Commission"></Column>
        )}
        {type === 1 && (
          <Column field="ats.accountnumber" header="Account Number"></Column>
        )}
        <Column
          field="finaltotaltotruckowner"
          header="Final Payment to Truck Owner"
          style={{ minWidth: "200px" }}
          footer={`${computeTotal("finaltotaltotruckowner")}`}
        ></Column>
        {type === 2 && (
          <Column
            field="trpaidtotruck"
            header="Transporter Paid To Truck"
            body={(rowData: any, field: any) =>
              selectedRowId === rowData._id ? (
                renderInput(rowData, field)
              ) : (
                <span>{rowData[field.field] || ""}</span>
              )
            }
          ></Column>
        )}
        {type === 2 && (
          <Column
            field="diffto"
            header="Difference Amount from truck owner to VMAT"
            style={{ minWidth: "200px" }}
          ></Column>
        )}
        {type === 2 && (
          <Column
            field="difffrom"
            header="Difference Amount to Truck Owner"
            style={{ minWidth: "200px" }}
          ></Column>
        )}
        <Column
          field="paymentReceivedDate"
          header="Payment transfer to truck owner"
          body={(rowData:any, field:any) => selectedRowId === rowData._id ? renderDatePicker(rowData, field) : <span>{formatDate(rowData[field.field]) || ''}</span>}
        ></Column>
        <Column
          field="modeofpayment"
          header="Mode Of Payment"
          body={(rowData: any, field: any) =>
            selectedRowId === rowData._id ? (
              renderDropdown(rowData, field)
            ) : (
              <span>{rowData[field.field] || ""}</span>
            )
          }
        ></Column>
        <Column
          field="rtgsnumber"
          header="RTGS Number"
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
      <CommonDialog
        visible={visible}
        onHide={() => setVisible(false)}
        getDetails={type === 1 ? getACK() : getACK2()}
        data={selectedProducts}
        type={type === 1 ? 4 : 11}
        searchQuery={searchQuery}
      />
      <BulkUpdate
        visible={showBulkUpdateDialog}
        onHide={() => setShowBulkUpdateDialog(false)}
        data={selectedProducts}
        type={2}
        onSuccess={async (updated) => {
          // await fetchData();
          setSelectedProducts([]);
          setShowBulkUpdateDialog(false);
          toast.current?.show({
            severity: "success",
            summary: messages.success,
            detail: messages.updateoraddsuccess,
            life: 3000,
          });
        }}
      />
    </div>
  );
};

export default Ack;
