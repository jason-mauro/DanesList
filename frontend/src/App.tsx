import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from './Pages/Login'
import Signup from './Pages/Signup';

function App() {

  return (
    <>
       <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Login/>}></Route>
                  <Route path="/Login" element= {<Login/>}></Route>
                  <Route path="/Signup" element = {<Signup/>}></Route>
                  </Routes>
        </BrowserRouter> 
    </>
  )
}

export default App
