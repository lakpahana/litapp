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
            isLoading={state.isLoading}
            hasErrors={hasAuthenticationErrors}
        >
           <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">LitApp</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">Home</a>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {state.isAuthenticated ? (
              <li className="nav-item">
                <a className="nav-link"
                    style={{ cursor: "pointer" }}
                onClick={handleLogout}>Logout</a>
              </li>
            ) : (
              <li className="nav-item">
                <a className="nav-link" onClick={handleLogin}
                    style={{ cursor: "pointer" }}
                
                >Login</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>

            {state.isAuthenticated ? (
                <div className="container">
                    <BookStore />
                </div>
            ) : (
                <body className="d-flex flex-column min-vh-100">
                    <main className="flex-grow-1">
                        <section className="hero py-5 text-center d-flex align-items-center">
                            <div className="container">
                                <h1 className="display-3 fw-bold">Get Coding Help from Peers</h1>
                                <p className="lead">LitApp connects students with peers who can provide coding help.</p>
                                <a className="btn btn-primary btn-lg mt-3" href="#" rel="ugc" onClick={handleLogin}>Try it Now</a>
                            </div>
                        </section>
                        <section className="py-5 border-bottom">
                            <div className="container">
                                <div className="row g-4">
                                    <div className="col-md-4 text-center">
                                        <img src="https://realprogramming.com/wp-content/uploads/2021/02/online-coding-classes.jpg" alt="Personalized Help" className="feature-img rounded-circle" width="250" height="250" />
                                        <h3 className="h5 fw-bold">Personalized Help</h3>
                                        <p className="text-muted">Get one-on-one coding help from experienced developers who can provide tailored guidance and support.</p>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <img src="https://codegeekz.com/wp-content/uploads/code1-735x490.jpg" alt="Accelerate Learning" className="feature-img rounded-circle" width="250" height="250" />
                                        <h3 className="h5 fw-bold">Accelerate Learning</h3>
                                        <p className="text-muted">Overcome coding challenges and level up your skills with hands-on practice and expert feedback.</p>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <img src="https://th.bing.com/th/id/R.cd18c9f4183725745cee7e78ed375e39?rik=aCF4eQadgOgsaA&pid=ImgRaw&r=0" alt="Build a Network" className="feature-img rounded-circle" width="250" height="250" />
                                        <h3 className="h5 fw-bold">Build a Network</h3>
                                        <p className="text-muted">Connect with a community of students and developers, and expand your professional network.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                    <footer className="footer d-flex flex-column flex-sm-row py-3 w-100 align-items-center px-4 border-top">
                        <p className="text-xs mb-0">&copy; 2024 LitApp. All rights reserved.</p>
                        <nav className="ms-sm-auto d-flex gap-2">
                            <a className="text-xs text-decoration-none" href="#" rel="ugc">Terms of Service</a>
                            <a className="text-xs text-decoration-none" href="#" rel="ugc">Privacy</a>
                        </nav>
                    </footer>
                </body>
            )}
        </DefaultLayout>
    );
};
