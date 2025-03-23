import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login"; // Asegúrate de que la ruta sea correcta
import Home from "./Components/Principal/principal"; // Asegúrate de que la ruta sea correcta
import NavBar from "./Components/NavBar/navBar"; // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
