import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Login, Signup } from "./pages";
import PrivateRoutes from "./utils/PrivateRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Home />} path="/" exact />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
