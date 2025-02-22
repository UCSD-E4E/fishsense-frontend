import { Navigate, createBrowserRouter } from 'react-router-dom';

import AccountPage from './pages/account-page';
import DashboardPage from './pages/dashboard-page';
import SignInPage from './pages/signin-page';
import SignOutPage from './pages/signout-page';
import ProjectIntroduction from './pages/ProjectIntroduction';
import { AuthRequired } from './services/account-service';
import UploadPage from './pages/UploadPage';

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthRequired>
                <DashboardPage />
            </AuthRequired>
        )
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
        element: (
            <AuthRequired>
                <AccountPage />
            </AuthRequired>
        )
    },
    {
        path: "/project-introduction",
        element: <ProjectIntroduction /> // Doesn't require authentication
    },
    {
        path: "/upload-page",
        element: <UploadPage /> // Doesn't require authentication
    },
    {
        path: "*",
        element: <Navigate to="/" replace={true} />
    }
]);

export default router;

