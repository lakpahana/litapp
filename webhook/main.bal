import ballerina/http;
import ballerina/log;
import ballerinax/trigger.asgardeo;

configurable asgardeo:ListenerConfig config = ?;
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