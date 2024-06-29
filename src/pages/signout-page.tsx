import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

import loginService from '../services/login-service';

class SignOutPage extends Component {
    render(): React.ReactNode {
        loginService.logout();

        return <Navigate to="/" replace={true} />
    }
}

export default SignOutPage;