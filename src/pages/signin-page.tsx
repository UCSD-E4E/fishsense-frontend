import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import './signin-page.scss'
import accountService from '../services/account-service';

function SignInPage() {
  const navigate = useNavigate();
  const [needsSignIn, setNeedsSignIn] = useState<boolean|undefined>(undefined);

  useEffect(() => {
    accountService.testSignedInAsync().then(async (signedIn) => {
      if (signedIn) {
        const userId = await accountService.getUserIdAsync();
        if (userId !== "not_existing_user") {
          navigate("/");
        }
      }
    });
  }, [navigate]);

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
    <div className="signin-container">
      <div>
        <h1>Login to FishSense</h1>
        <GoogleOAuthProvider clientId={accountService.clientId}>
          <GoogleLogin
            ux_mode="popup"
            onSuccess={async credentialResponse => {
              accountService.signin(credentialResponse);
              const userId = await accountService.getUserIdAsync();

              if (userId === "not_existing_user") {
                navigate("/create-account");
              } else {
                navigate("/");
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