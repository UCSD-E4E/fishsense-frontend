import { CredentialResponse, googleLogout } from "@react-oauth/google";
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';

interface GoogleJwtPayload extends JwtPayload {
    given_name: string;
    family_name: string;
    name: string;
    picture: string;
}

class AccountService {
    clientId: string;

    private get credentialString(): string|null { 
        return localStorage.getItem("credential");
    }

    public get credential(): CredentialResponse|null {
        const credential = this.credentialString;

        if (!credential) { // We haven't logged in yet.
            return null;
        }

        const credentialJSON = JSON.parse(credential);
        console.log(credentialJSON);

        return credentialJSON;
    }

    public get jwt(): GoogleJwtPayload|null {
        const credential = this.credential;

        if (!credential?.credential) { // We haven't logged in yet.
            return null;
        }

        const jwt = jwtDecode(credential.credential);
        console.log(jwt);

        const expiration = jwt.exp || 0;
        const now = Date.now() / 1000;

        if (expiration <=  now) { // Expired
            return null;
        }
        
        return jwt as GoogleJwtPayload;
    }

    constructor() {
        // Safe to check in.  This is public.
        this.clientId = '585544089882-2e8mni8kmbs39kekip1k6d09q5gjmqvv.apps.googleusercontent.com';
    }

    public async getUserIdAsync(): Promise<string|null> {
        const credential = this.credentialString;

        if (!credential) {
            return null;
        }

        try {
            const response = await fetch("http://localhost:3001/api/account", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: credential
            });

            return await response.text();
        }
        catch (ex) {
            return null;
        }
    }

    public signin(credentialResponse: CredentialResponse) {
        console.log(credentialResponse);
        localStorage.setItem("credential", JSON.stringify(credentialResponse));
    }

    public signout() {
        localStorage.removeItem("credential");
        googleLogout();
    }

    public async testSignedInAsync(): Promise<boolean> {
        const jwt = this.jwt;
        
        if (!jwt) { // Not logged in.
            return false;
        }

        return await this.verifyAsync();
    }

    public async verifyAsync() {
        const userid = await this.getUserIdAsync();

        if (userid) {
            return true;
        }

        return false;
    }
}

export const accountService = new AccountService()

export function authRequired(component: Function): Function {
    const renderFunction = () => {
        // This error comes about because we are not in a React component.
        // This is supposed to wrap a real component, so this error is expected.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [needsSignIn, setNeedsSignIn] = useState<boolean|undefined>(undefined);
      
        // This error comes about because we are not in a React component.
        // This is supposed to wrap a real component, so this error is expected.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          async function getNeedsSignIn() {
            setNeedsSignIn(!await accountService.testSignedInAsync());
          }
      
          if (typeof needsSignIn === 'undefined') {
            getNeedsSignIn(); // Intentionally not subscribing to promise.
          }
        }, [needsSignIn]);
    
        if (needsSignIn) {
            console.log(needsSignIn)
            return <Navigate to="/signin" replace={true} />
        }

        return component();
    }

    return renderFunction;
}

export default accountService;