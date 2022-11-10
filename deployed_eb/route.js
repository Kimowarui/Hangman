const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-northeast-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'hangman-players';

router.get('/players/:id', async (req, res) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'id': req.params.id
    }
  }
  await dynamodb.get(params).promise().then(response => {
    res.json(response.Item);
  }, error => {
    res.status(500).send(error);
  })
})

router.get('/players', async (req, res) => {
  const params = {
    TableName: dynamodbTableName
  }
  try {
    const allPlayers = await scanDynamoRecords(params, []);
    const body = {
      players: allPlayers
    }
    res.json(body);
  } catch(error) {
    res.status(500).send(error);
  }
})

router.post('/players', async (req, res) => {
  const username = req.body.name;
  const userid = AWS.util.uuid.v4();
  if (!username) {
    body = { 
      status: "error",
      message:  "Name cannot be NULL"
    };
    res.json(body);
  } else {
    const params = {
      TableName: dynamodbTableName,
      Item: {
        id: userid,
        phone: req.body.phone,
        name: username,
        email: req.body.email,
        gender: req.body.gender
      }
    };
    await dynamodb.put(params).promise().then(() => {
      const body = {
        Operation: 'SAVE',
        Message: 'SUCCESS',
        Item: req.body
      }
      res.json(body);
    }, error => {
      res.status(500).send(error);
    })
  }
})

router.put('/players/:id', async (req, res) => {
  const player = await dynamo
  .get({
    TableName: "hangman-players",
    Key: {
      id: req.params.id
    }
  })
  .promise();
if (!player.Item) {
  body = {
    status: "error",
    message:`Player with id ${req.params.id} does not exist.` 
  };
  res.json(body);
}
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'id': req.params.id
    },
    Item: {
      id: req.params.id,
      phone: req.body.phone ? req.body.phone : player.Item.phone,
      name: req.body.name ? req.body.name : player.Item.name,
      email: req.body.email ? req.body.email : player.Item.email,
      gender: req.body.gender ? req.body.gender : player.Item.gender
    }
  }
  await dynamodb.update(params).promise().then(response => {
    const body = {
      Operation: 'UPDATE',
      Message: 'SUCCESS',
      UpdatedAttributes: response
    }
    res.json(body);
  }, error => {
    res.status(500).send(error);
  })
})

router.delete('/players/:id', async (req, res) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'id': req.params.id
    },
    ReturnValues: 'ALL_OLD'
  }
  await dynamodb.delete(params).promise().then(response => {
    const body = {
      Operation: 'DELETE',
      Message: 'SUCCESS',
      Item: response
    }
    res.json(body);
  }, error => {
    res.status(500).send(error);
  })
})

async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch(error) {
    throw new Error(error);
  }
}

async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch(error) {
    throw new Error(error);
  }
}


module.exports = router;