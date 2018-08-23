# ionic4-angular6-gql
updated ionic graphql project - still work in progress, this will be based off of this older Ionic GraphQL project [ionic2-graphql-apollo-client](https://github.com/aaronksaunders/ionic2-graphql-apollo-client)


## Using the latest version of Ionic framework


## Using Apollo Client's New Query & Mutation Classes

> See the Official Documentation [Query, Mutation, Subscription services
Additional API to use GraphQL in Angular](https://www.apollographql.com/docs/angular/basics/services.html)

This is a query class to query all of the messages, its good because we have the power of typescript that allows for type checking when structuring the query; the should look something like this `MessagesQuery.ts`

```javascript
import { Injectable } from "@angular/core";
import { Query, Mutation } from "apollo-angular";
import gql from "graphql-tag";

@Injectable({
  providedIn: "root"
})
export class AllMessagesGQL extends Query<AllMessagesQuery, {}> {
  document = gql`
    query getAllMessages {
      getAllMessages {
        id
        content
        author
        created
      }
    }
  `;
}
```
The `document` variable holds the specific query that you have associated with the Query Object. We can specify what the query results should look like by specifying a type for the results. In this example it is represented by the type `AllMessagesQuery` which holds an array of `Message`

```javascript
export type AllMessagesQuery = {
  messages: Message[];
};

export type Message = {
  id: string;
  content: string;
  author: string;
  created: string;
};
```
Next we need to actually use the query we have just created; Import the specific files into `home.page.ts`
```javascript
import { AllMessagesGQL } from "../qraphql/MessagesQuery";
```

Then to use the Query Object, we do the following... set it up in the constructor of the `home.page.ts` file using angular dependency injection

```javascript
constructor( public msgQuery: AllMessagesGQL ) {}
```

Next we use the object to make the call to the query inside the `home.page.ts` file

```javascript
ngOnInit() {
  this.messages = this.msgQuery
    .watch()
    .valueChanges.pipe(pluck("data", "getAllMessages"));
}
```
Since the result of the query from the graphql server looks like this...

```json
{
  "data": {
    "getAllMessages": [
      {
        "id": "10",
        "content": "default message here",
        "created": "Wed Aug 22 2018 01:51:43 GMT+0000 (UTC)",
        "author": "Aaron Saunders"
      }
    ]
  }
}
```

In order to get the specific array of messages to display we can use the `rxjs` `pluck` operator to get the data to render in the `home.page.html` file

```html
<ion-list padding>
  <ion-item *ngFor="let m of (messages | async)">
    {{m | json}}
  </ion-item>
</ion-list>
```


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
  	updateMessage: (root, {id,input}, context) => {
      
      let oldMsg = data.get(id)

      data.set(id,{
        id, 
        ...oldMsg, 
        ...input, 
        updated : new Date() 
      })

      return  {...data.get(id)};
  	},    
  }  
};
```
