import {Config, CognitoIdentityCredentials} from "aws-sdk";
import {CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import React from "react";
import ReactDOM from "react-dom";
//import appConfig from "./config";
import appConfig from "./cognito-config";

Config.region = appConfig.region;
Config.credentials = new CognitoIdentityCredentials({
IdentityPoolId: appConfig.IdentityPoolId
});

const userPool = new CognitoUserPool({
UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId,
});

export {Config, CognitoIdentityCredentials, CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, React, ReactDOM, appConfig, userPool}
