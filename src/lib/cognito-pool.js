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

Config.addLogins = () => {
  new CognitoIdentityCredentials({
    IdentityPoolId : appConfig.IdentityPoolId,
    Logins : {
      'cognito-idp.eu-west-1.amazonaws.com/eu-west-1:09cfb9bc-86cf-4aa2-8c0b-dc69614e9527': result.getIdToken().getJwtToken()
    }
  });
}

export {Config, appConfig, CognitoIdentityCredentials, CognitoUserPool, userPool}
