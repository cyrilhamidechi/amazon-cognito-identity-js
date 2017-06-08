import {Config, CognitoIdentityCredentials} from "aws-sdk";
import {CognitoUserPool} from "amazon-cognito-identity-js";
//import appConfig from "./config";
import appConfig from "./cognito-config";

Config.region = appConfig.region;
Config.credentials = new CognitoIdentityCredentials({
  IdentityPoolId: appConfig.IdentityPoolId
});

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId
});

export {Config, appConfig, CognitoIdentityCredentials, CognitoUserPool, userPool}
