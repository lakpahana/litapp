import ballerina/http;
import ballerina/log;
import ballerinax/trigger.asgardeo;

configurable asgardeo:ListenerConfig config = {
    clientId: "7kpGO8EjuMsmq2O_LAZQ2EAj95ca",
    clientSecret: "Meho4FxHTMwnfqhMf36TAPxMZMpvcqOIC40b5uFg4sYa",
    organization: "lakpahana",
    tokenEndpointHost: "https://api.asgardeo.io/t/lakpahana/oauth2/token",
    callbackURL: "https://litapp.us-cdp2.choreoapps.dev/auth/logout/callback",
    hubURL: "https://litapp.us-cdp2.choreoapps.dev/auth/logout/callback",
    keyServiceURL: "http://localhost:8090/keys"
};

listener http:Listener httpListener = new (8090);
listener asgardeo:Listener webhookListener = new (config, httpListener);

service asgardeo:RegistrationService on webhookListener {
    remote function onAddUser(asgardeo:AddUserEvent event) returns error? {
        log:printInfo(event.toJsonString());
    }

    remote function onConfirmSelfSignup(asgardeo:GenericEvent event) returns error? {
        log:printInfo(event.toJsonString());
    }

    remote function onAcceptUserInvite(asgardeo:GenericEvent event) returns error? {
        log:printInfo(event.toJsonString());
    }
}

service /ignore on httpListener {
}
