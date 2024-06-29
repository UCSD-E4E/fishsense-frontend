import React, { Component } from 'react';

import { loggedIn } from '../services/login-service';

@loggedIn
class HomePage extends Component {
    render(): React.ReactNode {
        return <div>Home Page</div>
    }
}

export default HomePage;