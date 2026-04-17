import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { messages } from "../../api/constants";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { ConfirmPopup } from "primereact/confirmpopup";
import { InputNumber } from "primereact/inputnumber";
import {
  fetchCompletedBills,
  updateInvestAmount,
} from "../../store/slice/investSlice";

const Invest = () => {
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData]: any = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editedValue, setEditedValue] = useState<number | null>(null);
  const [totalToBePaid, setTotalToBePaid] = useState<number>(0);
  const [totalOutStanding, setTotalOutStanding] = useState<number>(0);
  const getFormattedDate = (inputDate: any) => {
    if (!inputDate) return "-";
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US");
  };

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(fetchCompletedBills());
      if (
        Array.isArray(trcukData.payload.data) &&
        trcukData.payload.data.length > 0 &&
        !trcukData.payload.error
      ) {
        setData(trcukData.payload.data);
        setTotalToBePaid(trcukData.payload.overallToBePaid || 0);
        setTotalOutStanding(trcukData.payload.overallOutstanding);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: messages.error,
        detail: messages.loadfailure,
        life: 3000,
      });
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onEdit = (rowIndex: number) => {
    setEditingRowIndex(rowIndex);
    // setEditedValue(data[rowIndex]?.invested || 0);
    setEditedValue(data[rowIndex]?.invest || 0);
  };

  const onCancel = () => {
    setEditingRowIndex(null);
    setEditedValue(null);
  };

  const onSave = async (rowIndex: number, rowData: any) => {
    try {
      const trcukData = await dispatch(
        updateInvestAmount({
          id: data[rowIndex].id,
          date: rowData.date,
          amount: editedValue,
        }),
      );
      if (!trcukData.payload.error) {
        fetchData();
      }
    } catch (error) {}
    setEditingRowIndex(null);
    setEditedValue(null);
  };

  return (
    <div className="p-2" style={{ overflowX: "auto", width: "100%" }}>
      <Toast ref={toast} />
      <ConfirmPopup />

      {/* <div className="flex justify-content-between mx-4 mb-3">
        <div className="flex align-items-center">
          <label className="mr-2">Total Investment</label>
          <h3 className="mr-2">₹ {sum.invested}</h3>
        </div>
        <div className="flex align-items-center">
          <label className="mr-2">Outgoing Amount</label>
          <h3 className="mr-2">₹ {sum.outgoing}</h3>
        </div>
      </div> */}

      <div className="flex justify-content-between mx-4 mb-3">
        <div className="flex align-items-center">
          <label className="mr-2">Total To Be Paid</label>
          <h3 className="mr-2 text-red-500">₹ {totalToBePaid}</h3>
        </div>
        <div className="flex align-items-center">
          <label className="mr-2">Total Outstanding</label>
          <h3 className="mr-2 text-red-500">₹ {totalOutStanding}</h3>
        </div>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <DataTable
          value={data}
          showGridlines
          scrollable
          scrollHeight="85vh"
          style={{ width: "100%" }}
        >
          <Column
            field="date"
            header="Date"
            style={{ width: "15%" }}
            body={(rowData) => getFormattedDate(rowData.date)}
          />
          <Column
            header="Invest Amount"
            style={{ width: "15%" }}
            body={(rowData, { rowIndex }) => {
              const isEditing = editingRowIndex === rowIndex;

              return isEditing ? (
                <div className="flex align-items-center">
                  <InputNumber
                    value={editedValue}
                    onValueChange={(e: any) =>
                      setEditedValue(e.value !== null ? e.value : 0)
                    }
                    mode="decimal"
                    min={0}
                    inputStyle={{ width: "6rem" }}
                  />

                  <Button
                    icon="pi pi-check"
                    className="p-button-sm p-button-success ml-2"
                    onClick={() => onSave(rowIndex, rowData)}
                  />

                  <Button
                    icon="pi pi-times"
                    className="p-button-sm p-button-secondary ml-2"
                    onClick={onCancel}
                  />
                </div>
              ) : (
                <div className="flex align-items-center justify-content-between">
                  ₹ {rowData.invest || 0}
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-sm p-button-text ml-2"
                    onClick={() => onEdit(rowIndex)}
                  />
                </div>
              );
            }}
          />
          {/* <Column
            field="bankbalance"
            header="Bank Balance"
            style={{ width: "15%" }}
          /> */}
          <Column
            field="openingBalance"
            header="Opening Balance"
            style={{ width: "13%" }}
            body={(rowData) =>
              `₹ ${rowData.openingBalance?.toLocaleString() || 0}`
            }
            bodyStyle={{ fontStyle: "italic", color: "#666" }}
          />
          <Column
            field="outgoing"
            header="Outgoing Amount"
            style={{ width: "15%" }}
          />
          <Column
            field="incoming"
            header="Incoming Amount"
            style={{ width: "15%" }}
          />
          <Column
            field="bankbalance"
            header="Closing (Bank) Balance"
            style={{ width: "15%" }}
            body={(rowData) => (
              <b style={{ color: rowData.bankbalance >= 0 ? "green" : "red" }}>
                ₹ {rowData.bankbalance?.toLocaleString()}
              </b>
            )}
          />
          <Column
            field="outstanding"
            header="Outstanding"
            bodyStyle={{ color: "#d32f2f", fontWeight: 600 }}
          />

          <Column
            field="tobepaid"
            header="To be Paid"
            bodyStyle={{ color: "#f57c00", fontWeight: 600 }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default Invest;
