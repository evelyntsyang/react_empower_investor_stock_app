import logo from "./logo.svg";
import "./App.css";
import LandingPage from "./components/landing_page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserPage from "./components/user_page";
import NavigationBar from "./components/navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <NavigationBar></NavigationBar>
        <Routes>      
          <Route path="/" element = {<LandingPage></LandingPage>} ></Route>
          <Route path="/userPage" element = {<UserPage></UserPage>} ></Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
