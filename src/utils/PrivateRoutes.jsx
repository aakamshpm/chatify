import { useAuth } from "../Context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const { currentUser } = useAuth();

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
