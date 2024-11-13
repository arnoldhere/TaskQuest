import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from "react-router-dom"
import { ChevronDown, ChevronUp, Calendar, CheckCircle2, UserPlus } from 'lucide-react'
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import FormatDate from '../../utils/FormatDate';

export default function ProjectDetail() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [projectData, setProjectData] = useState({})
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [progress, setProgress] = useState(0)
  const { id } = useParams()
  const navigate = useNavigate()
  const toastShownRef = useRef(false)

  const handleProgressChange = async (e) => {
    const newProgress = parseInt(e.target.value, 10)
    setProgress(newProgress)

    try {
      const token = Cookies.get("auth-token")
      await axios.put(`http://localhost:3333/leader/update-project-progress/${id}`, {
        progress: newProgress
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      toast.success('Progress updated successfully')
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Failed to update progress')
    }
  }
  // fetch project and the teams
  useEffect(() => {
    const FetchProject = async () => {
      try {
        const token = Cookies.get("auth-token");
        const res = await axios.get(`http://localhost:3333/leader/fetch-project-detail/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 201) {
          if (!toastShownRef.current) {
            toast.success(res.data.message);
            toastShownRef.current = true;
          }

          const project = res.data.project;

          // Calculate project progress based on tasks
          if (project.tasks && project.tasks.length > 0) {
            const completedTasks = project.tasks.filter(task => task.status === "completed").length;
            const progress = (completedTasks / project.tasks.length) * 100;
            setProjectData({ ...project, progress });
          } else {
            setProjectData({ ...project, progress: 0 });
          }

        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        toast.error('An error occurred while fetching project details.');
      }
    };
    const FetchTeams = async () => {
      try {
        const token = Cookies.get("auth-token")
        const res = await axios.get('http://localhost:3333/leader/fetch-teams', {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (res.status === 201) {
          setTeams(res.data.teams)
        } else {
          toast.error('Failed to fetch teams')
        }
      } catch (error) {
        console.error('Error fetching teams:', error)
        toast.error('An error occurred while fetching teams.')
      }
    }
    FetchTeams();
    FetchProject();
  }, [id]);

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
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
          <Calendar className="text-blue-500 h-6 w-6" />
          <span className="text-sm text-gray-600">
            Deadline: {projectData.deadline ? FormatDate(projectData.deadline) : "No deadline"}
          </span>
        </div>
        <div className="w-full sm:w-auto">
          <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-1">
            Project Progress
          </label>
          <input
            type="range"
            id="progress"
            name="progress"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-sm text-gray-600 mt-1 text-center">{progress}% Complete</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Project Teams</h3>
        {projectData.teams && projectData.teams.length > 0 ? (
          <ul className="list-disc pl-5">
            {projectData.teams.map((team) => (
              <li key={team.id} className="text-gray-600">{team.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No teams assigned to this project</p>
        )}
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
        <button
          onClick={handleAddTeam}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add Team
        </button>
      </div>

      <button
        className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 rounded-lg text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-semibold text-gray-800">Task Timeline</span>
        {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
      </button>

      <AnimatePresence>
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
      </AnimatePresence>
      <Toaster />
    </div>
  );
}
