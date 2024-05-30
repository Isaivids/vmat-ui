import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { getByVmat, updateByVmat } from "../../store/slice/byvmatSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Paginator } from "primereact/paginator";
import { validateFields } from "./validation1";
import { messages } from "../../api/constants";
import { Toast } from "primereact/toast";

const AdvVmat = () => {
  const searchQuery = useSelector((state: any) => state.search.query);
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
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
  // ----------end of pagination
  const onInputChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        const updatedRow = { ...row, [field]: value };
        if(!['remarks'].includes(field)){
          updatedRow.total = Number(updatedRow.ats.truckadv) + Number(updatedRow.pendinglabourwages) + Number(updatedRow.extlabourwages) + Number(updatedRow.others) + Number(updatedRow.vmatcommision);
        }
        return updatedRow;
      }
      return row;
    });
    setData(newData);
  };

  const renderInput = (rowData: any, field: any) => {
    const isStringField = ['remarks','othersreason'].includes(field.field);
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field]}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        keyfilter={isStringField ? "alphanum" : "num"}
      />
    );
  };

  const handleSave = async (rowData: any) => {
    const { isValid, missingFields } = validateFields(rowData);
    if (!isValid) {
      toast.current?.show({
        severity: "error",
        summary: messages.validationerror,
        detail: `${missingFields.join(", ")} is required`,
        life: 3000,
      });
      return;
    }
    const payload = {
      pendinglabourwages: Number(rowData.pendinglabourwages),
      extlabourwages: Number(rowData.extlabourwages),
      others: Number(rowData.others),
      othersreason : rowData.othersreason,
      advanceamount: Number(rowData.advanceamount),
      total: Number(rowData.total),
      remarks: rowData.remarks,
      _id : rowData._id
    }
    try {
      const response = await dispatch(updateByVmat(payload));
      if (!response.payload.error) {
        const index = data.findIndex((item:any) => item._id === rowData._id);
        if (index !== -1) {
          data[index]._id = response.payload.data._id;
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

  const handleEdit = (rowData: any) => {
    setSelectedRowId(rowData._id);
    setBackupData([...data]);
  };

  const renderButton = (rowData: any) => {
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
            <Button
              label="Cancel"
              severity="danger"
              onClick={handleCancel}
            />
          </>
        )}
      </div>
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(getByVmat({ limit: rows, offset: page * rows, search: searchQuery }));
      if (trcukData.payload.data.length && !trcukData.payload.error) {
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
      <DataTable value={data} showGridlines scrollable scrollHeight="80vh">
        <Column
          field="ats.sno"
          header="S.No"
          style={{ minWidth: "150px" }}
        ></Column>
        <Column
          field="ats.date"
          header="Date"
          style={{ minWidth: "150px" }}
        ></Column>
        <Column field="ats.truckname" header="Truck Name"></Column>
        <Column field="ats.trucknumber" header="Truck Number"></Column>
        <Column field="advanceamount" header="Advance"></Column>
        <Column
          field="pendinglabourwages"
          header="Pending Labour Wages"
          body={renderInput}
        ></Column>
        <Column
          field="extlabourwages"
          header="Extra Labour Wages"
          body={renderInput}
        ></Column>
        <Column field="others" header="Others" body={renderInput}></Column>
        <Column field="othersreason" header="Reason" body={renderInput}></Column>
        <Column field="vmatcommision" header="VMAT Commision"></Column>
        <Column field="total" header="Total"></Column>
        <Column field="remarks" header="Remarks" body={renderInput}></Column>
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
        />
    </div>
  );
};

export default AdvVmat;
