import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from 'axios';
import Cookies from "js-cookie"
import toast, { Toaster } from 'react-hot-toast';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import PeopleSharpIcon from '@mui/icons-material/PeopleSharp';
import { IconButton } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
export default function CreateTeam() {
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toastShownRef = useRef(false);
    const navigate = useNavigate();

    // Fetch pending users on component mount
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const token = Cookies.get("auth-token");
                setIsLoading(true); // Show loader while fetching users
                const res = await axios.get('http://localhost:3333/leader/fetch-teams', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }); // Fetch 

                if (res.status === 201) {
                    setTeams(res.data.teams || []);
                    // console.log(res.data.teams);
                    // if (!toastShownRef.current) {
                    //     toast.success(res.data.message);
                    //     toastShownRef.current = true;
                    // }
                } else {
                    if (!toastShownRef.current) {
                        toast.error(res.data.message);
                        toastShownRef.current = true;
                    }
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
                toast.error('An error occurred  or unauthorized access');
            } finally {
                setIsLoading(false); // Hide loader after fetching 
            }
        };
        fetchTeams(); // Call the fetch function
    }, []);


    const handleOpenDetailsDialog = (_id) => {
        // toast.loading("please wait...");
        console.log(_id)
        navigate(`/leader/team-detail/${_id}`);
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();

        if (teamName.length < 3) {
            toast.error("Enter valid team name");
            return;
        }
        setIsLoading(true);
        try {
            const token = Cookies.get('auth-token');
            const email = Cookies.get('email');
            // Simulating API call
            const res = await axios.post("http://localhost:3333/leader/add-teamname", { email: email, teamName: teamName }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (res.status === 201) {
                toast.success(res.data.message);
                setTeamName('');
                setIsLoading(false)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.error('Failed to create team:', error);
            toast.error("internal server error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toaster />
            <div className="container mx-auto p-4 max-w-4xl">
                <Card className="mb-6">
                    <CardHeader
                        title={
                            <Typography variant="h6" className="text-2xl font-bold flex items-center">
                                <PeopleSharpIcon className="mr-2 h-6 w-6" />
                                Teams
                            </Typography>
                        }
                        className="pb-2"
                    />
                    <CardContent>
                        <form onSubmit={handleCreateTeam} className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Enter team name"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isLoading ? (
                                    "Loading.."
                                ) : (
                                    <>
                                        <AddCircleSharpIcon className="mr-2 h-4 w-4" />
                                        Create Team
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table className="min-w-full divide-y divide-gray-200">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Team Name</TableCell>
                                        <TableCell className="text-right">Members</TableCell>
                                        <TableCell className="text-right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <AnimatePresence>
                                        {teams.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-gray-500">
                                                    No teams found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            teams.map((team) => (
                                                <motion.tr
                                                    key={team.id}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
                                                >
                                                    <TableCell className="font-medium">{team.name}</TableCell>
                                                    <TableCell className="text-right">{team.members.length}</TableCell>
                                                    <TableCell className="text-right">
                                                        <motion.button
                                                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            {team._id ? (
                                                                <IconButton onClick={() => handleOpenDetailsDialog(team._id)}>
                                                                    <span className="text-center text-sm"><Visibility /> View</span>
                                                                </IconButton>
                                                            ) : (
                                                                <span>No ID available</span>
                                                            )}
                                                        </motion.button>
                                                    </TableCell>
                                                </motion.tr>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </TableBody>

                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
