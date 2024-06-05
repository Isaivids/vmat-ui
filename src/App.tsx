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
import ProtectedRoute from "./components/ProtectedRoute";
import Ccpto from "./pages/ccpto/Ccpto";
import Tcp from "./pages/tcp/Tcp";
import AdvTwopay from "./components/grids/Adv_twopay";
import TruckDetail from "./pages/truck/TruckDetail";
import TransportAdvance from "./pages/transportadvance/TransportAdvance";
import VmatAccount from "./pages/vmataccount/VmatAccount";

const App = () => {
  const atsState = useSelector((state: any) => state.ats);
  const ackState = useSelector((state: any) => state.ack);
  const truckState = useSelector((state: any) => state.truck);
  const transportState = useSelector((state: any) => state.transport);
  const transState = useSelector((state: any) => state.trans);
  const bytwopay = useSelector((state: any) => state.bytwopay);
  const bytrans = useSelector((state: any) => state.bytrans);
  const byvmat = useSelector((state: any) => state.byvmat);
  const user = useSelector((state: any) => state.user);
  const ccpto = useSelector((state: any) => state.ccpto);
  const tcp = useSelector((state: any) => state.tcp);
  const transportadvance = useSelector((state: any) => state.transportadvance);
  const vmat = useSelector((state: any) => state.vmat);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
            byvmat.loading ||
            user.loading ||
            ccpto.loading ||
            tcp.loading ||
            transportState.loading ||
            transportadvance.loading ||
            vmat.loading) && <SpinnerWithLogo />}
          <Routes>
            <Route element={<WithOutNavBar />}>
              <Route path="/" element={<Login />} />
            </Route>
            <Route element={<WithNavBar />}>
              <Route
                path="/amt"
                element={<ProtectedRoute element={<Amt />} />}
              />
              <Route
                path="/ack"
                element={<ProtectedRoute element={<Ack />} />}
              />
              <Route
                path="/advance"
                element={<ProtectedRoute element={<Advance />} />}
              />
              <Route
                path="/topay"
                element={<ProtectedRoute element={<AdvTwopay />} />}
              />
              <Route
                path="/payment"
                element={<ProtectedRoute element={<Payment />} />}
              />
              <Route
                path="/transport"
                element={<ProtectedRoute element={<Transport />} />}
              />
              <Route
                path="/truck"
                element={<ProtectedRoute element={<TruckDetail />} />}
              />
              <Route
                path="/ccpto"
                element={<ProtectedRoute element={<Ccpto />} />}
              />
              <Route
                path="/tcp"
                element={<ProtectedRoute element={<Tcp />} />}
              />
              <Route
                path="/transportadvance"
                element={<ProtectedRoute element={<TransportAdvance />} />}
              />
              <Route
                path="/vmataccount"
                element={<ProtectedRoute element={<VmatAccount />} />}
              />
            </Route>
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
