import { Outlet, Navigate } from 'react-router-dom';
import { isUserLoggedIn } from './AuthUtils';

const ProtectedRoute: React.FC = () => {
    return isUserLoggedIn() ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default ProtectedRoute;
