import { CredentialResponse, googleLogout } from "@react-oauth/google";
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';

interface GoogleJwtPayload extends JwtPayload {
    given_name: string;
    family_name: string;
    name: string;
    picture: string;
    email: string;
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
        return credentialJSON;
    }

    public get jwt(): GoogleJwtPayload|null {
        const credential = this.credential;

        if (!credential?.credential) { // We haven't logged in yet.
            return null;
        }

        const jwt = jwtDecode(credential.credential);

        const expiration = jwt.exp || 0;
        const now = Date.now() / 1000;

        if (expiration <=  now) { // Expired
            return null;
        }
        
        return jwt as GoogleJwtPayload;
    }

    constructor() {
        // Safe to check in.  This is public.
        this.clientId = "931946598531-mbukvvb7g21kdifbf67g64igk036ect4.apps.googleusercontent.com";
    }

    public async getUserIdAsync(): Promise<string|null> {
        const credential = this.credentialString;

        if (!credential) {
            return null;
        }

        try {
            console.log("Credential: ", credential);
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/login/api/account", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: credential
            });

            // return await response.text();
            const text = await response.text();
            console.log("Backend response text:", text);
            if (text === '{"Status":"User not found"}') {
                return "not_existing_user";
            }
    
            return text;
        }
        catch (ex) {
            return null;
        }
    }

    public signin(credentialResponse: CredentialResponse) {
        localStorage.setItem("credential", JSON.stringify(credentialResponse));
    }

    public signout() {
        localStorage.removeItem("credential");
        googleLogout();
    }

    public createuser(payload: any) {

        const credential = this.credentialString;

        if (!credential) {
            return null;
        }

        fetch(process.env.REACT_APP_BACKEND_URL + '/login/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
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
            return <Navigate to="/signin" replace={true} />
        }

        return component();
    }

    return renderFunction;
}

export default accountService;