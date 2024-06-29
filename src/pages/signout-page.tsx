import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

import accountService from '../services/account-service';

class SignOutPage extends Component {
    render(): React.ReactNode {
        accountService.logout();

        return <Navigate to="/" replace={true} />
    }
}

export default SignOutPage;