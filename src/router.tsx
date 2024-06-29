import { Navigate, createBrowserRouter } from 'react-router-dom';

import AccountPage from './pages/account-page';
import DashboardPage from './pages/dashboard-page';
import SignInPage from './pages/signin-page';
import SignOutPage from './pages/signout-page';

const router = createBrowserRouter([
    {
        path: "/",
        element: <DashboardPage />
    },
    {
        path: "/signin",
        element: <SignInPage />
    },
    {
        path: "/signout",
        element: <SignOutPage />
    },
    {
        path: "/account",
        element: <AccountPage />
    },
    {
        path: "*",
        element: <Navigate to="/" replace={true} />
    }
]);

export default router