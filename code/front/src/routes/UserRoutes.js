import React from "react";
import ProtectedRoute from "../utils/ProtectedRoute";
import UserLayout from "../component/UserLayout";
import Home from "../component/Home";
import AddTask from "../component/Member/AddTask";
import PageNotFound from "../component/PageNotfound";
import Waiting from "../component/Member/Waiting";

const userRoutes = [
    {
        path: "/",
        element: <UserLayout />,
        errorElement: <PageNotFound />,
        children: [
            {
                path: "home",
                element: (
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                ),
                errorElement: <PageNotFound />,
            },
            {
                path: "addTask",
                element: (
                    <ProtectedRoute>
                        <AddTask />
                    </ProtectedRoute>
                ),
                errorElement: <PageNotFound />,
            },
        ],
    },
    {
        path: "/page404",
        element: <PageNotFound />,
    },
    {
        path: "/wait",
        element: <Waiting />,
    },
];

export default userRoutes;
