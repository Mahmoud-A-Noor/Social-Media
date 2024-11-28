import { Routes, Route } from "react-router-dom"
import Home from "./pages/home/page"
import Login from "./pages/login/Login.jsx"
import Register from "./pages/register/page"
import Profile from "./pages/profile/page"
import NotFound from "./pages/404/page"

import { AuthProvider } from './context/authContext.jsx';
import PrivateRoute from "./components/Route/PrivateRoute.jsx";


function App() {

  return (
    <>
        <AuthProvider>
            <Routes>
                <Route exact path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/:username" element={<PrivateRoute><Profile/></PrivateRoute>}/>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    </>
  )
}

export default App
