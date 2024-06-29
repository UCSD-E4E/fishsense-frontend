import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import accountService from '../services/account-service';

function SignInPage() {
  const navigate = useNavigate();
  const [needsSignIn, setNeedsSignIn] = useState<boolean|undefined>(undefined);

  useEffect(() => {
    async function getNeedsSignIn() {
      setNeedsSignIn(!await accountService.testSignedInAsync());
    }

    if (typeof needsSignIn === 'undefined') {
      getNeedsSignIn(); // Intentionally not subscribing to promise.
    }
  }, [needsSignIn]);

  if (typeof needsSignIn !== 'undefined' && !needsSignIn) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <h1>Login to FishSense</h1>
      <GoogleOAuthProvider clientId={accountService.clientId}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            accountService.signin(credentialResponse);
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