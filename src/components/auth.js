import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'us-east-1_iRcXlURhU', 
    ClientId: '4q0oh76c0lmmfoeag16i9a6b61' 
};

export default new CognitoUserPool(poolData);