import React from "react";
import ProtectedRoute from "../utils/ProtectedRoute";
import LeaderLayout from "../component/LeaderLayout";
import LeaderLogin from "../component/Leader/Login";
import Team from "../component/Leader/Team";
import PageNotFound from "../component/PageNotfound";

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
