import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

export default function ForgotPassword() {
    const [isAnimating, setIsAnimating] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const waitOtp = async (e) => {
        e.preventDefault();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.error("Please enter a valid email!");
            return;
        }

        try {
            toast.loading("Please wait a while....", { duration: 3000 })
            const res = await axios.post('http://localhost:3333/auth/request-otp', { email });
            if (res.status === 201) {
                toast.success(res.data.message);
                navigate("/verify", { state: { email } });
            } else {
                toast.error(res.data.message || "An error occurred");
            }
        } catch (error) {
            console.error("Error during OTP request:", error);
            toast.error('Account not found');
        }
    };

    return (
        <main className="flex-1 bg-slate-400 h-screen">
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Forgot Password</h2>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">Enter your email to reset your password.</p>
                        </div>
                        <form onSubmit={waitOtp} method="POST" className={`w-full max-w-md space-y-4 ${isAnimating ? "animate-fade-in" : ""}`}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Send OTP</Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
