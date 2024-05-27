import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Amt from "./pages/amt/Amt";
import Ack from "./pages/ack/Ack";
import Advance from "./pages/advance/Advance";
import Payment from "./pages/payment/Payment";
import Transport from "./pages/transport/Transport";
import SpinnerWithLogo from "./components/spinner/SpinnerWithLogo";
import { useSelector } from "react-redux";
import Login from "./pages/login/Login";
import WithOutNavBar from "./components/WithOutNavBar";
import WithNavBar from "./components/WithNavBar";
import Loader from "./components/loader/Loader";
const App = () => {
  const atsState = useSelector((state: any) => state.ats);
  const ackState = useSelector((state: any) => state.ack);
  const truckState = useSelector((state: any) => state.truck);
  const transState = useSelector((state: any) => state.trans);
  const bytwopay = useSelector((state: any) => state.bytwopay);
  const bytrans = useSelector((state: any) => state.bytrans);
  const byvmat = useSelector((state: any) => state.byvmat);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {(atsState.loading ||
            ackState.loading ||
            truckState.loading ||
            transState.loading ||
            bytrans.loading ||
            bytwopay.loading ||
            byvmat.loading) && <SpinnerWithLogo />}
          <Routes>
            <Route element={<WithOutNavBar />}>
              <Route path="/" element={<Login />} />
            </Route>
            <Route element={<WithNavBar />}>
              <Route path="/amt" element={<Amt />} />
              <Route path="/ack" element={<Ack />} />
              <Route path="/advance" element={<Advance />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/transport" element={<Transport />} />
            </Route>
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
