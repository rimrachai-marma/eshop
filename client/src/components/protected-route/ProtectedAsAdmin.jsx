import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedAsAdmin({ children }) {
  const user = useSelector((state) => state.auth.userInfo);

  if (user?.role === "superadmin" || user?.role === "admin") {
    return children;
  }
  return <Navigate to="/" />;
}

export default ProtectedAsAdmin;
