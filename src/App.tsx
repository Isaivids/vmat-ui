import React from "react";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Amt from "./pages/amt/Amt";
import Ack from "./pages/ack/Ack";
import Advance from "./pages/advance/Advance";
import Payment from "./pages/payment/Payment";
import Transport from "./pages/transport/Transport";
const App = () => {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Amt />} />
          <Route path="/amt" element={<Amt />} />
          <Route path="/ack" element={<Ack />} />
          <Route path="/advance" element={<Advance />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/transport" element={<Transport />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
