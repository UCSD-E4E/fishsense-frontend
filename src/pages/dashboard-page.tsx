import React, { Component } from 'react';

import { loggedIn } from '../services/login-service';

@loggedIn
class DashboardPage extends Component {
    render(): React.ReactNode {
        return <p>Dashboard Page</p>
    }
}

export default DashboardPage;