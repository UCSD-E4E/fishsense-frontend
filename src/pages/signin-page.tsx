import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import './signin-page.scss'
import accountService from '../services/account-service';

function SignInPage() {
  const navigate = useNavigate();
  const [needsSignIn, setNeedsSignIn] = useState<boolean|undefined>(undefined);

  useEffect(() => {
    async function getNeedsSignIn() {
      setNeedsSignIn(!await accountService.testSignedInAsync());
    }

    if (typeof needsSignIn === 'undefined') {
      console.log("Checking if signed in...");
      getNeedsSignIn(); // Intentionally not subscribing to promise.
    }
  }, [needsSignIn]);

  if (typeof needsSignIn !== 'undefined' && !needsSignIn) {
    console.log("Already signed in, redirecting to home...");
    return <Navigate to="/" />
  }

  return (
    <div className="signin-container">
      <div>
        <h1>Login to FishSense</h1>
        <GoogleOAuthProvider clientId={accountService.clientId}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const res = await accountService.signin(credentialResponse);
              if (res !== "not_existing_user") {
                // console.log("Login Success:", credentialResponse);
                navigate("/");
              }
              else {
                // console.log("Account doesn't exist:", credentialResponse);
                navigate("/create-account");
              }
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </GoogleOAuthProvider>
      </div>
    </div>);
}

export default SignInPage;