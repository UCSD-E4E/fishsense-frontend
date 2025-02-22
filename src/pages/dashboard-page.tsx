import React, { useEffect, useState } from 'react';
import { AuthRequired, accountService } from '../services/account-service';
import MainNav from '../components/main-nav-component';
import { Hamburger } from '@fluentui/react-nav-preview';
import './DashboardPage.scss';

const DashboardPage: React.FC = () => {
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isNavOpen, setIsNavOpen] = useState(false);

    useEffect(() => {
        const jwt = accountService.jwt;
        if (jwt) {
            setUser({ name: jwt.name, email: jwt.email });
        }
        setLoading(false);
    }, []);

    const toggleNav = () => {
        setIsNavOpen((prev) => !prev);
        console.log("Navigation toggled:", !isNavOpen); // Debugging state
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>Error loading user information.</p>;
    }

    return (
        <div className="dashboard">
            <div className="nav-icon">
                <Hamburger onClick={toggleNav} />
            </div>

            {/* Conditional rendering of navigation */}
            {isNavOpen && (
                <div className="main-nav-container">
                    <MainNav />
                </div>
            )}

            <h1>Welcome, {user.name}</h1>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default DashboardPage;




