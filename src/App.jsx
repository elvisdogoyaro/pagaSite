import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Otp from "./pages/Otp";
import Phone from "./pages/Phone";
function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/phone" element={<Phone />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
