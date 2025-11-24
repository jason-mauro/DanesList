import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from './Pages/Login'
import Signup from './Pages/Signup';
import { DanesListHome } from './Pages/DanesListHome';
import { CreateListing } from './Pages/CreateListing';
import { ViewListing } from './Pages/ViewListing';
import { EditListing } from './Pages/EditListing';
import { Messages } from './Pages/Messages';
import { Favorites } from './Pages/Favorites';
import { ManageMyListings } from './Pages/ManageMyListings';
import { MyAccount } from './Pages/Account';

function App() {

  return (
    <>
       <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Login/>}></Route>
                  <Route path="/Login" element= {<Login/>}></Route>
                  <Route path="/Signup" element = {<Signup/>}></Route>
                  <Route path="/DanesListHome" element = {<DanesListHome/>}></Route>
                  <Route path="/CreateListing" element = {<CreateListing/>}></Route>
                  <Route path="/ViewListing" element = {<ViewListing/>}></Route>
                  <Route path="/EditListing" element = {<EditListing/>}></Route>
                  <Route path="/Messages" element = {<Messages/>}></Route>
                  <Route path="/Favorites" element = {<Favorites/>}></Route>
                  <Route path="/ManageMyListings" element = {<ManageMyListings/>}></Route>
                  <Route path="/MyAccount" element = {<MyAccount/>}></Route>

                </Routes>
        </BrowserRouter> 
    </>
  )
}

export default App;