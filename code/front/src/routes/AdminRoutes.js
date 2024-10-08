import React from "react";
import ProtectedRoute from "../utils/ProtectedRoute";
import PageNotFound from "../component/PageNotfound";
import AdminLayout from "../component/AdminLayout"
import AdminLogin from "../component/Admin/Login"
import AdminDashboard from "../component/Admin/AdminDashboard";
import NewUsersList from "../component/Admin/NewUsersList";

const adminRoutes = [
    {
        path: "/admin/login",
        element: < AdminLogin />,
        errorElement: <PageNotFound />,
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        errorElement: <PageNotFound />,
        children: [
            {
                path: "dashboard",
                element: (
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                ),
                errorElement: <PageNotFound />,
            },
            {
                path: "new-users",
                element: (
                    <ProtectedRoute>
                        <NewUsersList />
                    </ProtectedRoute>
                ),
                errorElement: <PageNotFound />,
            },
        ],
    },
];

export default adminRoutes;
