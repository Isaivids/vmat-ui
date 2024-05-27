import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { getByVmat, updateByVmat } from "../../store/slice/byvmatSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Paginator } from "primereact/paginator";

const AdvVmat = () => {
  const searchQuery = useSelector((state: any) => state.search.query);
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
          updatedRow.total = Number(updatedRow.ats.truckad) + Number(updatedRow.pendinglabourwages) + Number(updatedRow.extlabourwages) + Number(updatedRow.others) + Number(updatedRow.vmatcommision);
        }
        return updatedRow;
      }
      return row;
    });
    setData(newData);
  };

  const renderInput = (rowData: any, field: any) => {
    const isStringField = ['remarks'].includes(field.field);
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field] || ""}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        keyfilter={isStringField ? "alphanum" : "num"}
      />
    );
  };

  const handleSave = async (rowData: any) => {
    const payload = {
      pendinglabourwages: Number(rowData.pendinglabourwages),
      extlabourwages: Number(rowData.extlabourwages),
      others: Number(rowData.others),
      advanceamount: Number(rowData.advanceamount),
      total: Number(rowData.total),
      remarks: rowData.remarks,
      _id : rowData._id
    }
    try {
      const response = await dispatch(updateByVmat(payload));
      if (Array.isArray(response.payload.data) && !response.payload.error) {
        const index = data.findIndex((item:any) => item._id === rowData._id);
        if (index !== -1) {
          data[index]._id = response.payload.data._id;
        }
        setSelectedRowId(null);
        setTotalPage(response.payload.pagination.totalPages);
      }
    } catch (error) {
      console.log(error)
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
      const trcukData = await dispatch(getByVmat({ limit: rows, offset: page, search: searchQuery }));
      if (trcukData.payload.data.length && !trcukData.payload.error) {
        setData(trcukData.payload.data);
        setTotalPage(trcukData.payload.pagination.totalPages);
      }
    } catch (error) {
      console.log(error);
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
        <Column field="ats.trucknumber" header="Truck No"></Column>
        <Column field="ats.truckad" header="Adv. Amt"></Column>
        <Column
          field="pendinglabourwages"
          header="Pen. Labour Wages"
          body={renderInput}
        ></Column>
        <Column
          field="extlabourwages"
          header="Ext. Labour Wages"
          body={renderInput}
        ></Column>
        <Column field="others" header="Others" body={renderInput}></Column>
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
