import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from "react";
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import toast from "react-hot-toast";
import axios from 'axios';

export default function VerifyOtp() {
    const [isAnimating, setIsAnimating] = useState(false);
    const [otp, setOtp] = useState('');
    const location = useLocation();
    const { email } = location.state || {};
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsAnimating(true);

        if (!otp) {
            toast.error("Enter OTP please!");
            return;
        }

        try {
            const res = await axios.post('http://localhost:3333/auth/verify-otp', { email, otp });
            if (res.status === 201) {
                toast.success("OTP verified successfully!");
                navigate("/updatePwd", { state: { email } });
            } else {
                toast.error(res.data.message || "An error occurred");
            }
        } catch (error) {
            console.error("Error during OTP verification:", error);
            toast.error('Invalid OTP !!');
        }
    };

    return (
        <main className="flex-1 bg-slate-400 h-screen">
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Enter OTP</h2>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">Please enter the one-time password sent to your email.</p>
                        </div>
                        <form onSubmit={handleSubmit} className={`w-full max-w-md space-y-4 ${isAnimating ? "animate-fade-in" : ""}`}>
                            <div className="flex justify-center gap-2">
                                <Input
                                    id="otp"
                                    name="otp"
                                    type="number"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter your OTP"
                                />
                            </div>
                            <Button type="submit" className="w-full">Verify</Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
