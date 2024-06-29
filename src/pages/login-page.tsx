import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import loginService from '../services/login-service';

function LoginPage() {
  const navigate = useNavigate();

  if (loginService.isLoggedIn) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <h1>Login to FishSense</h1>
      <GoogleOAuthProvider clientId={loginService.clientId}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            loginService.login(credentialResponse);
            navigate("/")
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>
    </div>);
}

export default LoginPage;