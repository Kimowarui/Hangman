const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let requestJSON="";
  let player="";
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.routeKey) {
      case "DELETE /players/{id}":
        player = await dynamo
          .get({
            TableName: "hangman-players",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise(); 
        if (!player.Item) {
          body = `Player with id ${event.pathParameters.id} does not exist.`;
          break;
        }
        await dynamo
          .delete({
            TableName: "hangman-players",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        body = `Deleted player ${event.pathParameters.id}`;
        break;
      case "GET /players/{id}":
        player = await dynamo
          .get({
            TableName: "hangman-players",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        if (!player.Item) {
          body = `Player with id ${event.pathParameters.id} does not exist.`;
          break;
        }
        body = player;
        break;
      case "GET /players":
        body = await dynamo.scan({ TableName: "hangman-players" }).promise();
        break;
      case "POST /players":
        requestJSON = JSON.parse(event.body);
        const username = requestJSON.name;
        const userid = AWS.util.uuid.v4();
        if (!username) {
          body = "Name cannot be NULL";
          break;
        }
        await dynamo
          .put({
            TableName: "hangman-players",
            Item: {
              id: userid,
              phone: requestJSON.phone,
              name: username,
              email: requestJSON.email,
              gender: requestJSON.gender
            }
          })
          .promise();
        body = {
          message: `Create player ${requestJSON.name}`,
          id: userid
        };
        break;
      case "PUT /players/{id}":
        requestJSON = JSON.parse(event.body);
        player = await dynamo
          .get({
            TableName: "hangman-players",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        if (!player.Item) {
          body = `Player with id ${event.pathParameters.id} does not exist.`;
          break;
        }
        await dynamo
          .update({
            TableName: "hangman-players",
            Key: {
              id: event.pathParameters.id
            },
            Item: {
              id: event.pathParameters.id,
              phone: requestJSON.phone ? requestJSON.phone : player.Item.phone,
              name: requestJSON.name ? requestJSON.name : player.Item.name,
              email: requestJSON.email ? requestJSON.email : player.Item.email,
              gender: requestJSON.gender ? requestJSON.gender : player.Item.gender
            }
          })
          .promise();

        body = `Update player ${requestJSON.name ? requestJSON.name : player.Item.name}`;
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
