import React, { Component } from 'react';
import { Hamburger, NavDrawer, NavDrawerBody, NavDrawerHeader, NavItem, NavSectionHeader } from '@fluentui/react-nav-preview';
import { Avatar, Tooltip } from '@fluentui/react-components';
import { Board20Filled, Board20Regular, SignOut20Filled, SignOut20Regular, bundleIcon } from '@fluentui/react-icons';
import loginService from '../services/login-service';

const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const SignOut = bundleIcon(SignOut20Filled, SignOut20Regular);

interface MainNavState {
    isOpen: boolean;
}

class MainNav extends Component<{}, MainNavState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    renderHamburgerWithToolTip() {
        return (
            <Tooltip content="Navigation" relationship="label">
                <Hamburger onClick={() => this.setState({isOpen: !this.state.isOpen})} />
            </Tooltip>
        );
    }

    render(): React.ReactNode {
        if (!loginService.isLoggedIn) {
            return <div></div>;
        }

        return (
            <div>
                <NavDrawer
                    open={this.state.isOpen}
                    type="overlay"
                >
                    <NavDrawerHeader>{this.renderHamburgerWithToolTip()}</NavDrawerHeader>

                    <NavDrawerBody>
                        <NavItem href="/" icon={<Dashboard />} value="1">Dashboard</NavItem>

                        <NavSectionHeader>Account</NavSectionHeader>
                        <NavItem href="/account" value="2">
                            <Avatar size={20} image={{
                                src: loginService.jwt?.picture
                            }} /> 
                            {loginService.jwt?.name}
                        </NavItem>
                        <NavItem href="/signout" icon={<SignOut />} value="3">Sign Out</NavItem>
                    </NavDrawerBody>
                </NavDrawer>

                {this.renderHamburgerWithToolTip()}
            </div>);
    }
}

export default MainNav;