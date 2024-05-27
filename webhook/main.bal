import ballerina/http;
import ballerina/log;
import ballerinax/trigger.asgardeo;

configurable asgardeo:ListenerConfig config = ?;
listener http:Listener httpListener = new (8090);
listener asgardeo:Listener webhookListener = new (config, httpListener);

service asgardeo:RegistrationService on webhookListener {
    remote function onAddUser(asgardeo:AddUserEvent event) returns error? {

        asgardeo:AddUserData? eventData2 = event.eventData;
        // Check if eventData2 is not null
        if (eventData2 is asgardeo:AddUserData) {
            // Now you can safely access the fields of eventData2
            string? userId = eventData2.userId;
            string? userName = eventData2.userName;
            string? email = eventData2.claims["http://wso2.org/claims/emailaddress"];
            string? firstName = eventData2.claims["http://wso2.org/claims/givenname"];
            string? lastName = eventData2.claims["http://wso2.org/claims/lastname"];

            log:printInfo("User ID: " + userId.toString());
            log:printInfo("User Name: " + userName.toString());
            log:printInfo("Email: " + email.toString());
            log:printInfo("First Name: " + firstName.toString());
            log:printInfo("Last Name: " + lastName.toString());
        } else {
            // Handle the case where eventData2 is null
            log:printError("Event data is null");
        }
        // log:printInfo(eventData2.userId);

        log:printInfo(event.toJsonString());

    }

    remote function onConfirmSelfSignup(asgardeo:GenericEvent event) returns error? {
        log:printInfo(event.toJsonString());
    }

    remote function onAcceptUserInvite(asgardeo:GenericEvent event) returns error? {
        log:printInfo(event.toJsonString());
    }

    //sign in
    remote function onUserSignIn(asgardeo:GenericEvent event) returns error? {
        log:printInfo(event.toJsonString());
    }
}

service /ignore on httpListener {
}
