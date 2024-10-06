import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white fixed bottom-0 left-0 right-0 p-2 z-100">
            <div className="container mx-auto flex justify-between items-center">
                {/* Copyright Section */}
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
                    </p>
                {/* Links Section */}
                <div className="flex space-x-4">
                    <Link to="#" className="text-xs hover:underline underline-offset-4">
                        Terms of Service
                    </Link>
                    <Link to="#" className="text-xs hover:underline underline-offset-4">
                        Privacy
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
