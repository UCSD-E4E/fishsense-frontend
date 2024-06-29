import { CredentialResponse, googleLogout } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

class LoginService {
    clientId: string;

    public get credential(): CredentialResponse|null {
        const credential = localStorage.getItem("credential");

        if (credential) {
            return JSON.parse(credential);
        }

        return null;
    }

    public get isLoggedIn(): boolean {
        const credential = this.credential;

        if (!credential || !credential?.credential) { // We haven't logged in yet.
            return false;
        }

        const jwt = jwtDecode(credential.credential);
        const expiration = jwt.exp || 0;
        const now = Date.now() / 1000;

        if (expiration <= now) { // Expired
            return false;
        }

        return true;
    }

    constructor() {
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

export const loginService = new LoginService()

export function loggedIn<T extends { new (...args: any[]): any; }>(component: T): T {
    if (Object.hasOwn(component.prototype, "render")) {
        const renderFunction = component.prototype.render;

        component.prototype.render = function() {
            if (!loginService.isLoggedIn) {
                return <Navigate to="/login" replace={true} />
            }

            return renderFunction();
        }
    }

    return component;
}

export default loginService;