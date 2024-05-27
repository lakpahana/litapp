import ballerina/http;
import ballerina/jwt;
import ballerina/log;
import ballerina/time;
import ballerinax/trigger.asgardeo;

configurable asgardeo:ListenerConfig config = ?;
listener http:Listener httpListener = new (8090);
listener asgardeo:Listener webhookListener = new (config, httpListener);
string EMAILADDRESS = "firebase-adminsdk-2vu9c@ballerina-firebase.iam.gserviceaccount.com";
string PROJECTID = "ballerina-firebase";
string FIREBASE_URL = "https://ballerina-firebase-default-rtdb.asia-southeast1.firebasedatabase.app/";

function generateJWT() returns string|error {
    time:Utc currentTime = time:utcNow();

    int nowSeconds = currentTime[0];
    int expSeconds = nowSeconds + 60;

    jwt:IssuerConfig issuerConfig = {
        issuer: EMAILADDRESS,
        audience: "https://www.googleapis.com/oauth2/v4/token",
        expTime: 60,  // Token expires in 60 seconds
        signatureConfig: {
            algorithm: jwt:RS256,
            config: {
                keyFile: "./my.key"
            }
        },
        customClaims: {
            iss: EMAILADDRESS,
            scope: "https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email",
            aud: "https://www.googleapis.com/oauth2/v4/token",
            iat: nowSeconds,
            exp: expSeconds
        }
    };

    // log:printInfo(PRIVATEKEY);

    string jwtToken = check jwt:issue(issuerConfig);
    return jwtToken;
}

function getAccessToken() returns string|error {
    string jwtToken = check generateJWT();

    http:Client oauthClient = check new ("https://www.googleapis.com");

    http:Request tokenRequest = new;
    tokenRequest.setPayload("grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" + jwtToken);
    tokenRequest.setHeader("Content-Type", "application/x-www-form-urlencoded");

    http:Response tokenResponse = check oauthClient->post("/oauth2/v4/token", tokenRequest);
    var jsonPayload = tokenResponse.getJsonPayload();
    if jsonPayload is json {
        return (check jsonPayload.access_token).toString();
    } else {
        return error("Failed to get access token");
    }
}

function callFirebase(string accessToken) returns json|error {
    string firebaseUrl = "users.json?access_token=" + accessToken;
    http:Client firebaseClient = check new (FIREBASE_URL);
    http:Response firebaseResponse = check firebaseClient->get(firebaseUrl);
    return check firebaseResponse.getJsonPayload();
}

function sendData(json data, string? uid, string accessToken) returns error? {
    // Create HTTP client to make PUT request
    log:printInfo("Sending data to Firebase...");
    log:printInfo(FIREBASE_URL + "users/" + uid.toString() + ".json?access_token = " + accessToken);
    http:Client httpClient = check new (FIREBASE_URL + "users/" + uid.toString() + ".json?access_token=" + accessToken);

    // Create PUT request
    http:Request putRequest = new;
    putRequest.setPayload(data.toString());
    putRequest.setHeader("Content-Type", "application/json");

    // Send PUT request
    http:Response putResponse = check httpClient->put("", putRequest);

    // Check response status
    if (putResponse.statusCode == 200) {
        log:printInfo("Data successfully sent to Firebase!");
        return null;
    } else {
        log:printError("Failed to send data to Firebase. Status code: " + string `putResponse.statusCode`);
        return error("Failed to send data to Firebase");
    }
}

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

            json userSave2 = {
                    "userName": userName.toString(),
                    "email": email.toString(),
                    "firstName": firstName.toString(),
                    "lastName": lastName.toString(),
                    "userId": userId
            
            };
            string accessToken = check getAccessToken();
            check sendData(userSave2, userId, accessToken);

        } else {
            // Handle the case where eventData2 is null
            log:printError("Event data is null");
        }
        // log:printInfo(eventData2.userId);

        // log:printInfo(event.toJsonString());
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
