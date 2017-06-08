import {userPool} from "./cognito-pool.js";
import {CognitoUser} from "amazon-cognito-identity-js";

    // user must be locally stored and retrieved from previous authentication step
    var userData = {
        Username : 'fake',
        Pool : userPool
    };
    var fakeUser = new CognitoUser(userData);
    
export {fakeUser}
