import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function Protected({ children }) {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLogedIn = !!userInfo;

  const from = useLocation().pathname;

  if (!isLogedIn) {
    return <Navigate to={`/login?redirect=${from}`} state={{ from }} />;
  }

  return children;
}

export default Protected;
