import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'us-east-1_qP5VZzd7F', 
    ClientId: '5c934nbm51rmg1fs48d3h46bjc' 
};

export default new CognitoUserPool(poolData);