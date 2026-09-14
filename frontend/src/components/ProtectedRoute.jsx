import { Navigate } from 'react-router-dom';

function ProtectedRoute({ loggedIn, element }) {
  return loggedIn ? element : <Navigate to="/signin" replace />;
}

export default ProtectedRoute;
