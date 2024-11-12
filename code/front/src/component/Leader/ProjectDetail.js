import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from "react-router-dom"
import { ChevronDown, ChevronUp, Calendar, CheckCircle2 } from 'lucide-react'
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import FormatDate from '../../utils/FormatDate';

export default function ProjectDetail() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [projectData, setProjectData] = useState({})
  const { id } = useParams(); // Extract project ID from the URL
  const navigate = useNavigate();
  const toastShownRef = useRef(false);

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

    FetchProject();
  }, [id]);

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
          <div className="bg-gray-200 rounded-full h-4 w-full sm:w-64">
            <div
              className="bg-blue-500 rounded-full h-4"
              style={{ width: `${projectData.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1 text-center">{projectData.progress}% Complete</p>
        </div>
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
            {/* {projectData.tasks && projectData.tasks.length > 0 ? (
              projectData.tasks.map((task, index) => (
                <li key={task.id} className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 w-4 h-4 rounded-full mt-2 ${task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'}`}
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
            )} */}
          </motion.ul>
        )}
      </AnimatePresence>
      <Toaster />
    </div>
  );
}
