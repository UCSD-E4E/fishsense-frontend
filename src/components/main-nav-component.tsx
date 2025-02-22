import React, { useEffect, useState } from 'react';
import { Hamburger, NavDrawer, NavDrawerBody, NavDrawerHeader, NavItem, NavSectionHeader } from '@fluentui/react-nav-preview';
import { Avatar, Tooltip } from '@fluentui/react-components';
import { Board20Filled, Board20Regular, SignOut20Filled, SignOut20Regular, bundleIcon } from '@fluentui/react-icons';
import accountService from '../services/account-service';

const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const SignOut = bundleIcon(SignOut20Filled, SignOut20Regular);

function MainNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [needsSignIn, setNeedsSignIn] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        async function getNeedsSignIn() {
            const isSignedIn = await accountService.testSignedInAsync();
            console.log("Is user signed in?", isSignedIn); // Debugging
            setNeedsSignIn(!isSignedIn);
        }

        if (typeof needsSignIn === 'undefined') {
            getNeedsSignIn(); 
        }
    }, [needsSignIn]);

    const toggleNav = () => {
        setIsOpen(!isOpen);
        console.log("Navigation toggled:", !isOpen); // Debugging
    };

    if (typeof needsSignIn === 'undefined') {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div style={{ position: 'fixed', top: 20, left: 20, zIndex: 1000 }}>
                <Tooltip content="Navigation" relationship="label">
                    <Hamburger onClick={toggleNav} />
                </Tooltip>
            </div>

            <NavDrawer open={isOpen} onOpenChange={toggleNav} type="overlay">
                <NavDrawerHeader>
                    <h3>Navigation</h3>
                </NavDrawerHeader>
                <NavDrawerBody>
                    <NavItem href="/" icon={<Dashboard />} value="1">Dashboard</NavItem>
                    <NavSectionHeader>Account</NavSectionHeader>
                    <NavItem href="/account" value="2">
                        <Avatar size={20} image={{ src: accountService.jwt?.picture }} />
                        {accountService.jwt?.name}
                    </NavItem>
                    <NavSectionHeader>Project</NavSectionHeader>
                    <NavItem href="/project-introduction" value="3">Project Introduction</NavItem>
                    <NavItem href="/upload-page" value="5">Upload</NavItem>
                    <NavItem href="/signout" icon={<SignOut />} value="4">Sign Out</NavItem>
                </NavDrawerBody>
            </NavDrawer>
        </div>
    );
}

export default MainNav;
