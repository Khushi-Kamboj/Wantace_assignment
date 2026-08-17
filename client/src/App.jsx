import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Estimator from './pages/Estimator';
import OwnerLogin from './pages/OwnerLogin';
import OwnerPanel from './pages/OwnerPanel';

function ProtectedRoute({ children }) {
  return localStorage.getItem('northline_owner_token') ? children : <Navigate to="/owner/login" replace />;
}

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Estimator />} />
    <Route path="/owner/login" element={<OwnerLogin />} />
    <Route path="/owner" element={<ProtectedRoute><OwnerPanel /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>;
}
