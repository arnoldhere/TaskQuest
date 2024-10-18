import React from "react";
import ProtectedRoute from "../utils/ProtectedRoute";
import LeaderLayout from "../component/LeaderLayout";
import LeaderLogin from "../component/Leader/Login";
import Team from "../component/Leader/Team";
import PageNotFound from "../component/PageNotfound";
import LeaderDashboard from "../component/Leader/LeaderDashboard";

const leaderRoutes = [
    {
        path: "/leader/login",
        element: <LeaderLogin />,
        errorElement: <PageNotFound />,
    },
    {
        path: "/leader",
        element: <LeaderLayout />,
        errorElement: <PageNotFound />,
        children: [
            {
                path: "dashboard",
                element: (
                    <ProtectedRoute>
                        <LeaderDashboard />
                    </ProtectedRoute>
                ),
                errorElement: <PageNotFound />,
            },
            {
                path: "team",
                element: (
                    <ProtectedRoute>
                        <Team />
                    </ProtectedRoute>
                ),
                errorElement: <PageNotFound />,
            },
        ],
    },
];

export default leaderRoutes;
