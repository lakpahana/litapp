import { BasicUserInfo, Hooks, useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { default as authConfig } from "../config.json";
import { DefaultLayout } from "../layouts/default";
import { BookStore } from "../components";
import { useLocation } from "react-router-dom";
import { LogoutRequestDenied } from "../components/LogoutRequestDenied";
import { USER_DENIED_LOGOUT } from "../constants/errors";

interface DerivedState {
    authenticateResponse: BasicUserInfo,
    idToken: string[],
    decodedIdTokenHeader: string,
    decodedIDTokenPayload: Record<string, string | number | boolean>;
}

/**
 * Home page for the Sample.
 *
 * @param props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const HomePage: FunctionComponent = (): ReactElement => {

    const {
        state,
        signIn,
        signOut,
        getBasicUserInfo,
        getIDToken,
        getDecodedIDToken,
        on
    } = useAuthContext();

    const [ derivedAuthenticationState, setDerivedAuthenticationState ] = useState<DerivedState>(null);
    const [ hasAuthenticationErrors, setHasAuthenticationErrors ] = useState<boolean>(false);
    const [ hasLogoutFailureError, setHasLogoutFailureError ] = useState<boolean>();

    const search = useLocation().search;
    const stateParam = new URLSearchParams(search).get('state');
    const errorDescParam = new URLSearchParams(search).get('error_description');

    useEffect(() => {

        if (!state?.isAuthenticated) {
            return;
        }

        (async (): Promise<void> => {
            const basicUserInfo = await getBasicUserInfo();
            const idToken = await getIDToken();
            const decodedIDToken = await getDecodedIDToken();

            const derivedState: DerivedState = {
                authenticateResponse: basicUserInfo,
                idToken: idToken.split("."),
                decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
                decodedIDTokenPayload: decodedIDToken
            };

            setDerivedAuthenticationState(derivedState);
        })();
    }, [ state.isAuthenticated , getBasicUserInfo, getIDToken, getDecodedIDToken ]);

    useEffect(() => {
        if(stateParam && errorDescParam) {
            if(errorDescParam === "End User denied the logout request") {
                setHasLogoutFailureError(true);
            }
        }
    }, [stateParam, errorDescParam]);

    const handleLogin = useCallback(() => {
        setHasLogoutFailureError(false);
        signIn()
            .catch(() => setHasAuthenticationErrors(true));
    }, [ signIn ]);

   /**
     * handles the error occurs when the logout consent page is enabled
     * and the user clicks 'NO' at the logout consent page
     */
    useEffect(() => {
        on(Hooks.SignOut, () => {
            setHasLogoutFailureError(false);
        });

        on(Hooks.SignOutFailed, () => {
            if(!errorDescParam) {
                handleLogin();
            }
        })
    }, [ on, handleLogin, errorDescParam]);

    const handleLogout = () => {
        signOut();
    };

    // If `clientID` is not defined in `config.json`, show a UI warning.
    if (!authConfig?.clientID) {

        return (
            <div className="content">
                <h2>You need to update the Client ID to proceed.</h2>
                <p>Please open &quot;src/config.json&quot; file using an editor, and update
                    the <code>clientID</code> value with the registered application&apos;s client ID.</p>
                <p>Visit repo <a
                    href="https://github.com/asgardeo/asgardeo-auth-react-sdk/tree/master/samples/asgardeo-react-app">README</a> for
                    more details.</p>
            </div>
        );
    }

    if (hasLogoutFailureError) {
        return (
            <LogoutRequestDenied
                errorMessage={USER_DENIED_LOGOUT}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
        );
    }

    return (
        <DefaultLayout
            isLoading={ state.isLoading }
            hasErrors={ hasAuthenticationErrors }
        > 

<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="#">LitApp</a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                                                        <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/home">Home</a>
                                    </li>
                                    //if user is authenticated, show the logout button
                                    {state.isAuthenticated && (
                                        <li className="nav-item">
                                            <a className="nav-link" onClick={handleLogout}>Logout</a>
                                        </li>
                                    )}
                                    //if user is not authenticated, show the login button
                                    {!state.isAuthenticated && (
                                        <li className="nav-item">
                                            <a className="nav-link" onClick={handleLogin}>Login</a>
                                        </li>
                                    )}
                                   
                                </ul>

                                </div>
                        </div>
                    </nav>


      
            {
                state.isAuthenticated
                    ? (
                        // <div className="content container">
                           
                        //     <button
                        //         className="btn primary mt-4"
                        //         onClick={ () => {
                        //             handleLogout();
                        //         } }
                        //     >
                        //         Logout
                        //     </button>
                        // </div>
                        <div className="container">


                        <BookStore  />
    </div>
                    )
                    : (
                        <body className="d-flex flex-column min-vh-100">
                        <main className="flex-grow-1">
                            <section className="w-100 pt-5 pb-5 border-top border-bottom">
                                <div className="container">
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <h1 className="display-3 fw-bold">Get Coding Help from Peers</h1>
                                            <p className="text-muted lead">LitApp connects students with peers who can provide coding help.</p>
                                            <a className="btn btn-primary mt-3" href="#" rel="ugc" onClick={handleLogin}>Try it Now</a>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="w-100 py-5">
                                <div className="container">
                                    <div className="row g-4">
                                        <div className="col-md-4">
                                            <div className="d-flex gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeLinecap="currentColor" strokeLinecap-width="2" strokeLinecap-linecap="round" strokeLinecap-linejoin="round" className="h-6 w-6 text-primary">
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                <div>
                                                    <h3 className="h5 fw-bold">Personalized Help</h3>
                                                    <p className="text-muted">Get one-on-one coding help from experienced developers who can provide tailored guidance and support.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"   className="h-6 w-6 text-primary">
                                                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                                                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                                                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                                                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                                                </svg>
                                                <div>
                                                    <h3 className="h5 fw-bold">Accelerate Learning</h3>
                                                    <p className="text-muted">Overcome coding challenges and level up your skills with hands-on practice and expert feedback.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeLinecap="currentColor" strokeLinecap-width="2" strokeLinecap-linecap="round" strokeLinecap-linejoin="round" className="h-6 w-6 text-primary">
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="9" cy="7" r="4"></circle>
                                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                                </svg>
                                                <div>
                                                    <h3 className="h5 fw-bold">Build a Network</h3>
                                                    <p className="text-muted">Connect with a community of students and developers, and expand your professional network.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                        
                                </div>
                            </section>
                        </main>
                        <footer className="d-flex flex-column flex-sm-row py-3 w-100 align-items-center px-4 border-top">
                            <p className="text-muted text-xs">© 2024 LitApp. All rights reserved.</p>
                            <nav className="ms-sm-auto d-flex gap-2">
                                <a className="text-muted text-xs text-decoration-none" href="#" rel="ugc">Terms of Service</a>
                                <a className="text-muted text-xs text-decoration-none" href="#" rel="ugc">Privacy</a>
                            </nav>
                        </footer>
                    </body>
                    )
            }
        </DefaultLayout>
    );
};
