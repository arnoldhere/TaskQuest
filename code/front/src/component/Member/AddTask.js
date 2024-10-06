import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { FormLabel } from '@mui/material';

export default function AddTask() {
    const [isAnimating, setIsAnimating] = useState(false)
    const [taskTitle, setTaskTitle] = useState("")
    const [taskDescription, setTaskDescription] = useState("")
    const navigate = useNavigate();

    const handleTaskTitleChange = (e) => {
        setTaskTitle(e.target.value)
    }
    const handleTaskDescriptionChange = (e) => {
        setTaskDescription(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsAnimating(true)
        try {

            const finalData = { taskTitle, taskDescription }
            console.log(finalData)
            const user = localStorage.getItem('user');
            console.log(user)
            // send the data to backend through axios api 
            const res = await axios.post("http://localhost:3333/task/add", {
                data: finalData, user: user
            });
            // Handle response based on status
            if (res.status === 201) {
                toast.success(res.data.message);
                navigate("/home")
            } else {
                toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error.message)
            toast.error("Registration interrupted !! \n Email is already in use ");
        }

    }
    return (
        <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Add a Task</h2>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">Enter the details for your new task.</p>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className={`w-full max-w-md space-y-4 ${isAnimating ? "animate-fade-in" : ""}`}
                        >
                            <div className="space-y-2">
                                <FormLabel htmlFor="task-title">Task Title</FormLabel>
                                <Input
                                    id="task-title"
                                    type="text"
                                    value={taskTitle}
                                    onChange={handleTaskTitleChange}
                                    placeholder="Enter task title"
                                />
                            </div>
                            <div className="space-y-2">
                                <FormLabel htmlFor="task-description">Task Description</FormLabel>
                                <Input
                                    id="task-description"
                                    value={taskDescription}
                                    onChange={handleTaskDescriptionChange}
                                    placeholder="Enter task description"
                                    className="min-h-[100px]"
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Add Task
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}