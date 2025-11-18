import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from './Pages/Login'
import Signup from './Pages/Signup';
import { DanesListHome } from './Pages/DanesListHome';

function App() {

  return (
    <>
       <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Login/>}></Route>
                  <Route path="/Login" element= {<Login/>}></Route>
                  <Route path="/Signup" element = {<Signup/>}></Route>
                  <Route path="/DanesListHome" element = {<DanesListHome/>}></Route>
                </Routes>
        </BrowserRouter> 
    </>
  )
}

export default App
