import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from "react-router-dom"
import { ChevronDown, ChevronUp, Calendar, CheckCircle2, UserPlus } from 'lucide-react'
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { Badge, Button } from "@mui/material"
import axios from "axios";
import FormatDate from '../../utils/FormatDate';

export default function ProjectDetail() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [projectData, setProjectData] = useState({})
  const [teamsData, setTeamsData] = useState([])
  const [associatedTeams, setAssociatedTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()
  const toastShownRef = useRef(false)
  const status = [
    { title: "Not started", color: "danger" },
    { title: "Started", color: "info" },
    { title: "Completed", color: "success" },
    { title: "Delayed", color: "Warning" },
    { title: "Skipped", color: "primary" },
  ]
  // fetch project and the teams
  useEffect(() => {
    const FetchProject = async () => {
      try {
        const token = Cookies.get("auth-token");
        const res = await axios.get(`http://localhost:3333/leader/fetch-project-detail/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 201) {
          setProjectData(res.data.project);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        toast.error('An error occurred while fetching project details.');
      }
    };
    FetchProject();
    const FetchTeams = async () => {
      try {
        const token = Cookies.get("auth-token");
        const email = Cookies.get("email");
        console.log(email);

        // Sending email as a query parameter in the URL
        const res = await axios.get(`http://localhost:3333/leader/fetch-teams-of-leader?email=${email}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 201) {
          setTeamsData(res.data.teams);
          console.log("Teams : ", res.data.teams);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error('Internal server error:', error);
        toast.error('An error occurred while fetching project details.');
      }
    };
    FetchTeams();
    const FetchAssociatedTeams = async () => {
      try {
        const token = Cookies.get("auth-token");
        // Sending email as a query parameter in the URL
        const res = await axios.get(`http://localhost:3333/leader/fetch-associated-teams/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 201) {
          setAssociatedTeams(res.data.teams);
          console.log("Teams : ", res.data.teams);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error('Internal server error:', error);
        toast.error('Internal server error.');
      }
    }
    FetchAssociatedTeams()
  }, [id]);

  const changeProjectStatus = async () => {
    if (!selectedStatus) {
      toast.error('Please choose the project status...')
      return
    }

    try {
      const token = Cookies.get("auth-token")
      const res = await axios.post(`http://localhost:3333/leader/change-project-status`, {
        projectId: id,
        status: selectedStatus
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (res.status === 201) {
        toast.success('status changes successfully')
        // Refresh project data
        const updatedProject = await axios.get(`http://localhost:3333/leader/fetch-project-detail/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        setProjectData(updatedProject.data.project)
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.error('Error to change status of project:', error)
      toast.error('Internal server error')
    }
  }
  // add the team to project
  const handleAddTeam = async () => {
    if (!selectedTeam) {
      toast.error('Please select a team to add')
      return
    }

    try {
      const token = Cookies.get("auth-token")
      const res = await axios.post(`http://localhost:3333/leader/add-team-to-project`, {
        projectId: id,
        teamId: selectedTeam
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (res.status === 201) {
        toast.success('Team added successfully')
        // Refresh project data
        const updatedProject = await axios.get(`http://localhost:3333/leader/fetch-project-detail/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        setProjectData(updatedProject.data.project)
        const updatedAssociatedTeams = await axios.get(`http://localhost:3333/leader/fetch-associated-teams/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAssociatedTeams(updatedAssociatedTeams.data.teams);
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.error('Error adding team to project:', error)
      toast.error('An error occurred while adding the team.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">{projectData.name}</h2>
      <p className="text-gray-600 mb-4">{projectData.description}</p>
      <div className="flex flex-wrap justify-between items-center mb-3">
        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
          <Calendar className="text-blue-500 h-6 w-6" />
          <span className="text-sm text-gray-600">
            Deadline: {projectData.deadline ? FormatDate(projectData.deadline) : "No deadline"}
          </span>
        </div>
        <div className="w-full sm:w-auto">
          <label htmlFor="progress" className=" text-sm font-medium text-gray-500 mb-1">
            Current Project Status : <Button color="secondary">{projectData.status}</Button>
          </label>
          <div className="flex items-center">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border-2"
            >
              <option value="">Change project status</option>
              {status.map((s, index) => (
                <option key={index} className={`bg-${s.color}`} value={s.title}>{s.title}</option>
              ))}
            </select>
            <button
              onClick={changeProjectStatus}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Change
            </button>
          </div>

        </div>
      </div>
      <hr />
      <div className="mb-3">
        {/* Team Display in Tabular Form */}
        <div className="mb-4 container">
          <h3 className="text-xl font-semibold mb-2">Teams</h3>
          {associatedTeams.teams && associatedTeams.teams.length > 0 ? (
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-left text-gray-800 font-medium">Team Name</th>
                </tr>
              </thead>
              <tbody>
                {associatedTeams.teams.map((teamData, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b text-gray-600">
                      {teamData.team.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 text-center">No teams assigned to this project</p>
          )}
        </div>
        <hr />
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border-2"
        >
          <option value="" disabled selected>Select a team</option>
          {teamsData.map((t) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
        <button
          onClick={handleAddTeam}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add
        </button>
      </div>

      <button
        className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 rounded-lg text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-semibold text-gray-800">Task Timeline</span>
        {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
      </button>

      {/* <AnimatePresence>
        {isExpanded && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4"
          >
            {projectData.tasks && projectData.tasks.length > 0 ? (
              projectData.tasks.map((task, index) => (
                <li key={task.id} className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 w-4 h-4 rounded-full mt-2 ${task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                      }`}
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">{task.name}</h3>
                      <span className="text-sm text-gray-600">{task.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 capitalize">{task.status.replace('-', ' ')}</p>
                  </div>
                  {task.status === 'completed' && <CheckCircle2 className="text-green-500 h-6 w-6 flex-shrink-0" />}
                </li>
              ))
            ) : (
              <p className="text-gray-600 text-center">No tasks performed</p>
            )}
          </motion.ul>
        )}
      </AnimatePresence> */}
      <Toaster />
    </div>
  );
}
