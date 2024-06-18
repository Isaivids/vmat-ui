import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Button } from "primereact/button";
import { formatDate, getTCPDoc, messages } from "../../api/constants";
import { InputText } from "primereact/inputtext";
import { gettcp, updatetcp } from "../../store/slice/tcpSlice";
import { downloadPDF } from "./document";
import CustomButtonComponent from "../../components/button/CustomButtonComponent";


const Tcp = () => {
  const searchQuery = useSelector((state: any) => state.search);
  const toast = useRef<Toast>(null);
  const [data, setData]: any = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  //seection
  const [selectedProducts, setSelectedProducts] = useState([]);
  //eo selection
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
    const newData = data.map((row: any) => {
      if (row._id === id) {
        const updatedRow = { ...row, [field]: value };
        updatedRow.total =
          Number(updatedRow.transcrossing) + Number(updatedRow.others);
        return updatedRow;
      }
      return row;
    });
    setData(newData);
  };

  const renderInput = (rowData: any, field: any) => {
    const isStringField = ['remarks'].includes(field.field)
    return (
      <div className="flex align-items-center rel">
        <InputText
          disabled={rowData._id !== selectedRowId}
          value={rowData[field.field]}
          onChange={(e) => onInputChange(e, rowData._id, field.field)}
          keyfilter={isStringField ? undefined : "num"}
          style={{ width: "150px" }}
        />
      </div>
    );
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

  const handleSave = async (rowData: any) => {
    const payload = {
      total: rowData.total,
      others: rowData.others,
      remarks: rowData.remarks,
      _id: rowData._id,
    };
    try {
      const response = await dispatch(updatetcp(payload));
      if (!response.payload.error) {
        const index = data.findIndex((item: any) => item._id === rowData._id);
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
        gettcp({ limit: rows, offset: page * rows, search: searchQuery })
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
        label="Download"
        severity="secondary"
        className="my-3 text-bold"
        onClick={() => downloadPDF(selectedProducts,getTCPDoc())}
        disabled={selectedProducts.length <= 0}
      />
      <DataTable value={data} showGridlines scrollable scrollHeight="70vh"  selection={selectedProducts} onSelectionChange={(e:any) => setSelectedProducts(e.value)}>
        <Column selectionMode="multiple"></Column>
        <Column field="ats.sno" header="S.No"></Column>
        <Column field="ats.date" header="Date" body={(rowData:any) => formatDate(rowData.ats.date)}></Column>
        <Column field="ats.transname" header="Transport Name"></Column>
        <Column field="ats.trucknumber" header="Truck Number"></Column>
        <Column field="transcrossing" header="Trans Crossing"></Column>
        <Column field="others" body={renderInput} header="Others"></Column>
        <Column field="remarks" body={renderInput} header="Remarks"></Column>
        <Column field="total" header="Total"></Column>
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

export default Tcp;
