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
import ProtectedRoute from './Components/ProtectedRoute';
import { ConversationProvider } from './context/ConversationContext';
import { NewMessage } from './Pages/NewMessage';

function App() {

  return (
    <>
        <ConversationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <DanesListHome />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/createListing"
                element={
                  <ProtectedRoute>
                    <CreateListing />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/listing/:id"
                element={
                  <ProtectedRoute>
                    <ViewListing />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditListing />
                  </ProtectedRoute>
                }
              />

              <Route 
                path="/messages/newMessage"
                element={
                  <ProtectedRoute>
                    <NewMessage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/manageListings"
                element={
                  <ProtectedRoute>
                    <ManageMyListings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <MyAccount />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </ConversationProvider>
    </>
  )
}

export default App;