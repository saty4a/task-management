import { useNavigate } from "react-router-dom";

const Routes = () => {
  const navigate = useNavigate();
  const routeChange = (paths) => {
    navigate(`${paths}`);
  };
  return {
    routeChange,
  };
};

export default Routes;
