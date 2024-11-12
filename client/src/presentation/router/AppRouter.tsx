import { createBrowserRouter } from "react-router-dom";
import { AuthenticationScreen } from "../auth/pages/AuthenticationScreen";
import UpdateUser from "../components/settings/UpdateUser";
import { PublicRoute } from "./routes/PublicRoute";
import { HomeScreen } from "../screens/HomeScreen";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export const AppRouter = createBrowserRouter([
    {
        path: '/',
        element:
            <PublicRoute>
                <AuthenticationScreen />
            </PublicRoute>,
    },
    {
        path: '/chats',
        element:
            <ProtectedRoute>
                <HomeScreen />
            </ProtectedRoute>
    },
    {
        path: '/settings/:id',
        element:
            <ProtectedRoute>
                <UpdateUser />
            </ProtectedRoute>
    }
])