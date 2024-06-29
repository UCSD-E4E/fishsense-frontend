import { Navigate, createBrowserRouter } from 'react-router-dom';

import HomePage from './pages/home-page';
import LoginPage from './pages/login-page';

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "*",
        element: <Navigate to="/" replace={true} />
    }
]);

export default router