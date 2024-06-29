import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import accountService from '../services/account-service';

function SignInPage() {
  const navigate = useNavigate();

  if (accountService.isLoggedIn) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <h1>Login to FishSense</h1>
      <GoogleOAuthProvider clientId={accountService.clientId}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            accountService.login(credentialResponse);
            navigate("/")
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>
    </div>);
}

export default SignInPage;