import React, { useEffect, useState } from 'react';
import { Hamburger, NavDrawer, NavDrawerBody, NavDrawerHeader, NavItem, NavSectionHeader } from '@fluentui/react-nav-preview';
import { Avatar, Tooltip } from '@fluentui/react-components';
import { Board20Filled, Board20Regular, SignOut20Filled, SignOut20Regular, bundleIcon } from '@fluentui/react-icons';
import accountService from '../services/account-service';

const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const SignOut = bundleIcon(SignOut20Filled, SignOut20Regular);

function MainNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [needsSignIn, setNeedsSignIn] = useState<boolean|undefined>(undefined);
  
    useEffect(() => {
      async function getNeedsSignIn() {
        setNeedsSignIn(!await accountService.testSignedInAsync());
      }
  
      if (typeof needsSignIn === 'undefined') {
        getNeedsSignIn(); // Intentionally not subscribing to promise.
      }
    }, [needsSignIn]);

    const renderHamburgerWithToolTip = () => {
        return (
            <Tooltip content="Navigation" relationship="label">
                <Hamburger onClick={() => setIsOpen(!isOpen)} />
            </Tooltip>
        );
    }

    if (needsSignIn) {
        return <div></div>;
    }

    return (
        <div>
            <NavDrawer
                open={isOpen}
                type="overlay"
            >
                <NavDrawerHeader>{renderHamburgerWithToolTip()}</NavDrawerHeader>

                <NavDrawerBody>
                    <NavItem href="/" icon={<Dashboard />} value="1">Dashboard</NavItem>

                    <NavSectionHeader>Account</NavSectionHeader>
                    <NavItem href="/account" value="2">
                        <Avatar size={20} image={{
                            src: accountService.jwt?.picture
                        }} /> 
                        {accountService.jwt?.name}
                    </NavItem>
                    <NavItem href="/signout" icon={<SignOut />} value="3">Sign Out</NavItem>
                </NavDrawerBody>
            </NavDrawer>

            {renderHamburgerWithToolTip()}
        </div>);
}

export default MainNav;