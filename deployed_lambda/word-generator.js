const words = require('./word-list.json');

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}

exports.handler = async (event) => {
    let body;
    let statusCode = 200;
    const requestOrigin = (event.headers && event.headers.origin) || '';
    
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": requestOrigin,
        'Access-Control-Allow-Methods': 'GET'
    };
    
    try {
        switch (event.routeKey) {
            case 'GET /api/words':
                body = {
                    word: getWord()
                };
                break;
            
            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

  return {
    statusCode,
    body,
    headers
  };

};
