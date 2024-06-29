import React, { Component } from 'react';

import { authRequired } from '../services/account-service';

@authRequired
class DashboardPage extends Component {
    render(): React.ReactNode {
        return <p>Dashboard Page</p>
    }
}

export default DashboardPage;