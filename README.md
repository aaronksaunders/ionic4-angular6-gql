# ionic4-angular6-gql
updated ionic graphql project - still work in progress, this will be based off of this older Ionic GraphQL project [ionic2-graphql-apollo-client](https://github.com/aaronksaunders/ionic2-graphql-apollo-client)


## Using the latest version of ionic framework

## Apollo LaunchPad

The server for this project is located here

- https://launchpad.graphql.com/r9x8jkr0qn

> Launchpad is an in-browser GraphQL server playground. You can write a GraphQL schema example in JavaScript, and instantly create a serverless, publicly-accessible GraphQL endpoint. We call these code snippets that live on Launchpad “pads”.

### Server-side, add the corresponding schema and resolver:

```javascript
// SCHEMA
const typeDefs = `

  type Query {
    hello: String
    getMessage(id: ID!): Message
		getAllMessages : [Message]
  }

  input MessageInput {
    content: String
    author: String
		created : String
  }

  type Message {
    id: ID!
    content: String
    author: String
		created : String
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    deleteMessage(id: ID!): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`;
```
Our data is stored in a simple javascript `Map` that is reset every time the application is run. It is initialized with some sample data to get us started

```javascript
const data =  new Map()

data.set("10",{
  "content": "default message here",
  "author": "Aaron Saunders",
  "created" : new Date().toString()
})
```

```javascript
const resolvers = {

  // QUERIES - Get your data state from your apollo server.
  Query: {
    getMessage:  (root, {id}, context) => {
    	if (!data.get(id)) {
      	throw new Error('no message exists with id ' + id);
    	}
    	return {id, ...data.get(id)};
  	},

    getAllMessages:  (root, args, context) => {
      let r = []
      console.log("data",data)
      data.forEach ((v,k) => {
        r.push({id:k,...v})
      })
    	return r;
  	},
  },
  
  // MUTATIONS - Queries that change your data state on your apollo server.
  Mutation : {
    deleteMessage:  (root, {id}, context) => {
    	if (!data.get(id)) {
      	throw new Error('no message exists with id ' + id);
    	}
      data.delete(id)
    	return {id };
  	},    
  	createMessage: (root, {input}, context) => {
    	// Create a random id for our "database".
    	var id = new Date().getTime() + "";
      
      data.set(id,{id, ...input, created : new Date() })
      
      console.log(input)
    
    	return  {...data.get(id)};
  	},
  }  
};
```
