import React from 'react';

import { authRequired } from '../services/account-service';

const DashboardPage = authRequired(
    function() {
        return <p>Dashboard Page</p>
    }
)

export default DashboardPage;