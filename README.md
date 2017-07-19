## Basic roadmap

Status: pure chaotic R&D

(noted for myself)
- [ ] Cognito Sync to access to an API Gateway > Lambda (fake)
- [ ] Cognito Sync to access to an API Gateway > Lambda > AuroraDB
- [x] make each demo script point to a usable form (mainly blind dev)
- [.] make forms work and dynamic (if static data)
- [ ] refactoring forms (repetitive fields handling, ...) and adding better practices
- [x] show / hide forms depending on the login status
- [ ] full responsive design it (signup, signin, forgot pwd, resend conf, logged area, user details, AWS features)
- [ ] custom emails (sender, text, ...)
- [ ] demo SMS confirmation
- [ ] demo MFA
- [ ] demo Cognito / Lambda interactions (creating a S3 folder for incoming registration)
- [x] demo Cognito Sync
- [ ] demo advanced Cognito Sync (push, streams and events)
- [ ] make signup form dynamic based on AWS Cognito form prefs (if possible, else make frontend flexible and config-driven)
- [x] use Cognito to access to S3
 - [x] load S3 bucket
 - [x] play with bucket
 - [x] ensure role delegation is used (http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html)
 - [x] ensure enhanced authentication flow is used (http://docs.aws.amazon.com/cognito/latest/developerguide/authentication-flow.html)
 - [x] allow one S3 root dir per Cognito user (https://aws.amazon.com/blogs/mobile/understanding-amazon-cognito-authentication-part-3-roles-and-policies/)
 - [-] demo feature request payers (http://docs.aws.amazon.com/AmazonS3/latest/dev/RequesterPaysBuckets.html)
- [.] use various Authentication Providers (http://docs.aws.amazon.com/cognito/latest/developerguide/external-identity-providers.html)
 - [.] Facebook (WIP)
 - [.] Google+ (WIP)
 - [x] Twitter (later, once market will be stabilized, https://firebase.googleblog.com/2017/01/FabricJoinsGoogle17.html, http://get.digits.com/blog/introducing-firebase-phone-authentication)
 - [ ] OpenID
- [ ] use Cognito to access to various AWS services (http://docs.aws.amazon.com/cognito/latest/developerguide/iam-roles.html)
 - [ ] Aurora
 - [ ] DynamoDB
 - [ ] ElasticSearch
 - [ ] Lambda
 - [ ] SES
 - [ ] SNS
 - [ ] SQS
 - [ ] Lex
 - [ ] Machine Learning
 - [ ] Polly
 - [ ] Rekognition
 - [ ] Kinesis Firehose
 - [ ] Kinesis Streams
 - [ ] IoT
