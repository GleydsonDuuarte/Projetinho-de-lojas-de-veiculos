// sheets-proxy.js - Netlify Function
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Function funcionando' })
    };
};
