import { CredentialResponse, googleLogout } from "@react-oauth/google";
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';

interface GoogleJwtPayload extends JwtPayload {
    given_name: string;
    family_name: string;
    name: string;
    email: string;
    picture: string;
}

class AccountService {
    clientId: string;

    private get credentialString(): string | null {
        return localStorage.getItem("credential");
    }

    public get credential(): CredentialResponse | null {
        const credential = this.credentialString;

        if (!credential) {
            return null;
        }

        try {
            return JSON.parse(credential);
        } catch (error) {
            console.error("Error parsing credential string:", error);
            return null;
        }
    }

    public get jwt(): GoogleJwtPayload | null {
        const credential = this.credential;

        if (!credential?.credential) {
            return null;
        }

        try {
            const jwt = jwtDecode<GoogleJwtPayload>(credential.credential);

            const expiration = jwt.exp || 0;
            const now = Date.now() / 1000;

            if (expiration <= now) {
                console.warn("JWT has expired.");
                return null;
            }

            return jwt;
        } catch (error) {
            console.error("Error decoding JWT:", error);
            return null;
        }
    }

    constructor() {
        this.clientId = '585544089882-2e8mni8kmbs39kekip1k6d09q5gjmqvv.apps.googleusercontent.com';
    }

    public async getUserIdAsync(): Promise<string | null> {
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
                body: credential,
            });

            if (!response.ok) {
                console.error("Failed to fetch user ID:", response.statusText);
                return null;
            }

            return await response.text();
        } catch (error) {
            console.error("Error fetching user ID:", error);
            return null;
        }
    }

    public signin(credentialResponse: CredentialResponse) {
        try {
            localStorage.setItem("credential", JSON.stringify(credentialResponse));
            console.log("Credential stored successfully.");
        } catch (error) {
            console.error("Failed to store credential:", error);
        }
    }

    public signout() {
        localStorage.removeItem("credential");
        googleLogout();
        console.log("User signed out.");
    }

    public async testSignedInAsync(): Promise<boolean> {
        const jwt = this.jwt;

        if (!jwt) {
            return false;
        }

        return await this.verifyAsync();
    }

    public async verifyAsync() {
        const userId = await this.getUserIdAsync();

        if (userId) {
            return true;
        }

        console.warn("User verification failed.");
        return false;
    }

    public getUserDetails() {
        const jwt = this.jwt;

        if (!jwt) {
            return { email: null, name: null };
        }

        return { email: jwt.email, name: jwt.name };
    }
}

export const accountService = new AccountService();

// Component wrapper for authenticated routes
export function AuthRequired({ children }: { children: React.ReactNode }) {
    const [needsSignIn, setNeedsSignIn] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        async function checkSignInStatus() {
            const isSignedIn = await accountService.testSignedInAsync();
            setNeedsSignIn(!isSignedIn);
        }

        if (typeof needsSignIn === "undefined") {
            checkSignInStatus();
        }
    }, [needsSignIn]);

    if (needsSignIn) {
        return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
}

export default accountService;