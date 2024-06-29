import { CredentialResponse, googleLogout } from "@react-oauth/google";
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

interface GoogleJwtPayload extends JwtPayload {
    given_name: string;
    family_name: string;
    name: string;
    picture: string;
}

class AccountService {
    clientId: string;

    public get credential(): CredentialResponse|null {
        const credential = localStorage.getItem("credential");

        if (credential) {
            return JSON.parse(credential);
        }

        return null;
    }

    public get jwt(): GoogleJwtPayload|null {
        const credential = this.credential;

        if (!credential?.credential) { // We haven't logged in yet.
            return null;
        }

        const jwt = jwtDecode(credential.credential);
        console.log(jwt);
        
        return jwt as GoogleJwtPayload;
    }

    public get isLoggedIn(): boolean {
        const jwt = this.jwt;
        
        if (!jwt) { // Not logged in.
            return false;
        }

        return true;
    }

    constructor() {
        // Safe to check in.  This is public.
        this.clientId = '585544089882-2e8mni8kmbs39kekip1k6d09q5gjmqvv.apps.googleusercontent.com';
    }

    public login(credentialResponse: CredentialResponse) {
        console.log(credentialResponse);
        localStorage.setItem("credential", JSON.stringify(credentialResponse));
    }

    public logout() {
        localStorage.removeItem("credential");
        googleLogout();
    }
}

export const accountService = new AccountService()

export function authRequired<T extends { new (...args: any[]): any; }>(component: T): T {
    if (Object.hasOwn(component.prototype, "render")) {
        const renderFunction = component.prototype.render;

        component.prototype.render = function() {
            if (!accountService.isLoggedIn) {
                return <Navigate to="/signin" replace={true} />
            }

            return renderFunction();
        }
    }

    return component;
}

export default accountService;