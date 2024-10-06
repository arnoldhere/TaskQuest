import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function UpdatePwd() {
    const location = useLocation();
    const { email } = location.state || {};
    const [pwd, setPwd] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pwd) {
            toast.error("Enter a new password please!");
            return;
        }

        if (pwd.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }


        try {
            const res = await axios.post('http://localhost:3333/auth/updatePassword', { email, cpassword: pwd });
            if (res.status === 201) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message || "An error occurred");
            }
        } catch (error) {
            console.error("Error during password update:", error);
            toast.error('Failed to update password');
        }
    };

    return (
        <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Update Password</h2>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">Enter a new password for your account.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)}
                                    placeholder="Enter your new password"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Update Password</Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
