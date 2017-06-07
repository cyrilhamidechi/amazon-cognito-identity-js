# Babel webpack example

To run the example first setup your AWS configuration.

```js
// src/config.js
export default {
  region: '',
  IdentityPoolId: '',
  UserPoolId: '',
  ClientId: '',
}
```

Now, you are ready to build this example.

```
npm install
npm run build
```

Open browser to try this example.

```
open index.html
```

## Demo

The usage examples below use the unqualified names for types in the Amazon Cognito Identity SDK for JavaScript. Remember to import or qualify access to any of these types:

```javascript
    // When using loose Javascript files:
    var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

    // Under the original name:
    var CognitoUserPool = AWSCognito.CognitoIndentityServiceProvider.CognitoUserPool;

    // Modules, e.g. Webpack:
    var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
    var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

    // ES Modules, e.g. transpiling with Babel
    import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
```

**Use case 1.** Registering a user with the application. One needs to create a CognitoUserPool object by providing a UserPoolId and a ClientId and signing up by using a username, password, attribute list, and validation data.

```javascript

    var poolData = {
        UserPoolId : '...', // Your user pool id here
        ClientId : '...' // Your client id here
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    var attributeList = [];

    var dataEmail = {
        Name : 'email',
        Value : 'email@mydomain.com'
    };

    var dataPhoneNumber = {
        Name : 'phone_number',
        Value : '+15555555555'
    };
    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
    var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);

    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);

    userPool.signUp('username', 'password', attributeList, null, function(err, result){
        if (err) {
            alert(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });
```

**Use case 2.** Confirming a registered, unauthenticated user using a confirmation code received via SMS.

```javascript
    var poolData = {
        UserPoolId : '...', // Your user pool id here
        ClientId : '...' // Your client id here
    };

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
        Username : 'username',
        Pool : userPool
    };

    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.confirmRegistration('123456', true, function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        console.log('call result: ' + result);
    });
```

**Use case 3.** Resending a confirmation code via SMS for confirming registration for a unauthenticated user.

```javascript
    cognitoUser.resendConfirmationCode(function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        console.log('call result: ' + result);
    });
```

**Use case 4.** Authenticating a user and establishing a user session with the Amazon Cognito Identity service.

```javascript
    var authenticationData = {
        Username : 'username',
        Password : 'password',
    };
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    var poolData = {
        UserPoolId : '...', // Your user pool id here
        ClientId : '...' // Your client id here
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
        Username : 'username',
        Pool : userPool
    };
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());

            //POTENTIAL: Region needs to be set if not already set previously elsewhere.
            AWS.config.region = '<region>';

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : '...', // your identity pool id here
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>' : result.getIdToken().getJwtToken()
                }
            });

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();

        },

        onFailure: function(err) {
            alert(err);
        },

    });
```

Note that if device tracking is enabled for the user pool with a setting that user opt-in is required, you need to implement an onSuccess(result, userConfirmationNecessary) callback, collect user input and call either setDeviceStatusRemembered to remember the device or setDeviceStatusNotRemembered to not remember the device.

Note also that if CognitoUser.authenticateUser throws ReferenceError: navigator is not defined when running on Node.js, follow the instructions on the following [Stack Overflow post](http://stackoverflow.com/questions/40219518/aws-cognito-unauthenticated-login-error-window-is-not-defined-js).

**Use case 5.** Retrieve user attributes for an authenticated user.

```javascript
    cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        for (i = 0; i < result.length; i++) {
            console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        }
    });
```

**Use case 6.** Verify user attribute for an authenticated user.

Note that the inputVerificationCode method needs to be defined but does not need to actually do anything. If you would like the user to input the verification code on another page, you can set inputVerificationCode to null. If inputVerificationCode is null, onSuccess will be called immediately (assuming there is no error).

```javascript
    cognitoUser.getAttributeVerificationCode('email', {
        onSuccess: function (result) {
            console.log('call result: ' + result);
        },
        onFailure: function(err) {
            alert(err);
        },
        inputVerificationCode: function() {
            var verificationCode = prompt('Please input verification code: ' ,'');
            cognitoUser.verifyAttribute('email', verificationCode, this);
        }
    });
```

**Use case 7.** Delete user attribute for an authenticated user.

```javascript
    var attributeList = [];
    attributeList.push('nickname');

    cognitoUser.deleteAttributes(attributeList, function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        console.log('call result: ' + result);
    });
```

**Use case 8.** Update user attributes for an authenticated user.

```javascript
    var attributeList = [];
    var attribute = {
        Name : 'nickname',
        Value : 'joe'
    };
    var attribute = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(attribute);
    attributeList.push(attribute);

    cognitoUser.updateAttributes(attributeList, function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        console.log('call result: ' + result);
    });
```

**Use case 9.** Enabling MFA for a user on a pool that has an optional MFA setting for an authenticated user.

```javascript
    cognitoUser.enableMFA(function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        console.log('call result: ' + result);
    });
```

**Use case 10.** Disabling MFA for a user on a pool that has an optional MFA setting for an authenticated user.

```javascript
    cognitoUser.disableMFA(function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        console.log('call result: ' + result);
    });
```

**Use case 11.** Changing the current password for an authenticated user.

```javascript
    cognitoUser.changePassword('oldPassword', 'newPassword', function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        console.log('call result: ' + result);
    });
```

**Use case 12.** Starting and completing a forgot password flow for an unauthenticated user.

```javascript
    cognitoUser.forgotPassword({
        onSuccess: function () {
            // successfully initiated reset password request
        },
        onFailure: function(err) {
            alert(err);
        },
        //Optional automatic callback
        inputVerificationCode: function(data) {
            console.log('Code sent to: ' + data);
            var verificationCode = prompt('Please input verification code ' ,'');
            var newPassword = prompt('Enter new password ' ,'');
            cognitoUser.confirmPassword(verificationCode, newPassword, this);
        }
    });
```



**Use case 13.** Deleting an authenticated user.

```javascript
    cognitoUser.deleteUser(function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        console.log('call result: ' + result);
    });
```

**Use case 14.** Signing out from the application.

```javascript
    cognitoUser.signOut();
```

**Use case 15.** Global signout for an authenticated user(invalidates all issued tokens).

```javascript
    cognitoUser.globalSignOut(callback);
```

**Use case 16.** Retrieving the current user from local storage.

```javascript
    var poolData = {
        UserPoolId : '...', // Your user pool id here
        ClientId : '...' // Your client id here
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err);
                return;
            }
            console.log('session validity: ' + session.isValid());

            // NOTE: getSession must be called to authenticate user before calling getUserAttributes
            cognitoUser.getUserAttributes(function(err, attributes) {
                if (err) {
                    // Handle error
                } else {
                    // Do something with attributes
                }
            });

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : '...', // your identity pool id here
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>' : session.getIdToken().getJwtToken()
                }
            });

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();

        });
    }
```

**Use case 17.** Integrating User Pools with Cognito Identity.

```javascript
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, result) {
            if (result) {
                console.log('You are now logged in.');

                // Add the User's Id Token to the Cognito credentials login map.
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'YOUR_IDENTITY_POOL_ID',
                    Logins: {
                        'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': result.getIdToken().getJwtToken()
                    }
                });
            }
        });
    }
    //call refresh method in order to authenticate user and get new temp credentials
    AWS.config.credentials.refresh((error) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Successfully logged!');
        }
    });
```
*note that you can not replace the login key with a variable because it will be interpreted literally. if you want to use a variable, the resolution to [issue 17](https://github.com/aws/amazon-cognito-identity-js/issues/162) has a working example*

**Use case 18.** List all remembered devices for an authenticated user. In this case, we need to pass a limit on the number of devices retrieved at a time and a pagination token is returned to make subsequent calls. The pagination token can be subsequently passed. When making the first call, the pagination token should be null.

```javascript

    cognitoUser.listDevices(limit, paginationToken, {
        onSuccess: function (result) {
            console.log('call result: ' + result);
        },
        onFailure: function(err) {
            alert(err);
        }
    });

```

**Use case 19.** List information about the current device.

```javascript

    cognitoUser.getDevice({
        onSuccess: function (result) {
            console.log('call result: ' + result);
        },
        onFailure: function(err) {
            alert(err);
        }
    });
```


**Use case 20.** Remember a device.

```javascript

    cognitoUser.setDeviceStatusRemembered({
        onSuccess: function (result) {
            console.log('call result: ' + result);
        },
        onFailure: function(err) {
            alert(err);
        }
    });
```

**Use case 21.** Do not remember a device.

```javascript

    cognitoUser.setDeviceStatusNotRemembered({
        onSuccess: function (result) {
            console.log('call result: ' + result);
        },
        onFailure: function(err) {
            alert(err);
        }
    });
```


**Use case 22.** Forget the current device.

```javascript

    cognitoUser.forgetDevice({
        onSuccess: function (result) {
            console.log('call result: ' + result);
        },
        onFailure: function(err) {
            alert(err);
        }
    });
```

**Use case 23.** Authenticate a user and set new password for a user that was created using AdminCreateUser API

```javascript

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            // User authentication was successful
        },

        onFailure: function(err) {
            // User authentication was not successful
        },

        mfaRequired: function(codeDeliveryDetails) {
            // MFA is required to complete user authentication.
            // Get the code from user and call
            cognitoUser.sendMFACode(mfaCode, this)
        },

        newPasswordRequired: function(userAttributes, requiredAttributes) {
            // User was signed up by an admin and must provide new
            // password and required attributes, if any, to complete
            // authentication.

            // the api doesn't accept this field back
            delete userAttributes.email_verified;

            // Get these details and call
            cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
        }
    });
```
**Use case 24.** Retrieve the MFA Options for the user in case MFA is optional

```javascript
    cognitoUser.getMFAOptions(function(err, mfaOptions) {
        if (err) {
            alert(err);
            return;
        }
        console.log('MFA options for user ' + mfaOptions);
    });
```

