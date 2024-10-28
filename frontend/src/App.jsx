import { Routes, Route } from "react-router-dom"
import Home from "./pages/home/page"
import Login from "./pages/login/page"
import Register from "./pages/register/page"
import Profile from "./pages/profile/page"
import NotFound from "./pages/404/page"

function App() {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
