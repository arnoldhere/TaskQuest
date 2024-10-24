import React from "react";
import ProtectedRoute from "../utils/ProtectedRoute";
import LeaderLayout from "../component/LeaderLayout";
import LeaderLogin from "../component/Leader/Login";
import CreateTeam from "../component/Leader/CreateTeam";
import PageNotFound from "../component/PageNotfound";
import LeaderDashboard from "../component/Leader/LeaderDashboard";
import ProjectDetail from "../component/Leader/ProjectDetail";
import TeamDetail from "../component/Leader/TeamDetail";

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
                        <CreateTeam />
                    </ProtectedRoute>
                ),
                errorElement: <PageNotFound />,
            },
            {
                path: "project-detail/:id",
                element: (
                    <ProtectedRoute>
                        <ProjectDetail />
                    </ProtectedRoute>
                ),
                errorElement: <PageNotFound />,
            },
            {
                path: "team-detail/:id",
                element: (
                    <ProtectedRoute>
                        <TeamDetail/>
                    </ProtectedRoute>
                ),
                errorElement: <PageNotFound />,
            },
        ],
    },
];

export default leaderRoutes;
