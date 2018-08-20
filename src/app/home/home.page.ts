import { Component, OnInit } from "@angular/core";

import gql from "graphql-tag";
import { Apollo } from "apollo-angular";
import { HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

//
// see https://launchpad.graphql.com/r9x8jkr0qn for more
// information on the GraphQL Server
//

let GET_ALL_MESSAGES = gql`
  query getAllMessages {
    getAllMessages {
      id
      content
      author
      created
    }
  }
`;

let ADD_MESSAGE = gql`
  mutation add($msgInput: MessageInput!) {
    createMessage(input: $msgInput) {
      id
      content
      author
      created
    }
  }
`;

const DELETE_MESSAGE = gql`
  mutation deleteMessage($id: ID!) {
    deleteMessage(id: $id) {
      id
    }
  }
`;

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  messages;
  input: any = {
    content: "test",
    author: "Aaron Saunders"
  };

  constructor(public apollo: Apollo, httpLink: HttpLink) {}

  ngOnInit() {
    this.messages = this.apollo.watchQuery({
      query: GET_ALL_MESSAGES
    }).valueChanges;
  }

  deleteMessage(_id) {
    console.log(_id);

    this.apollo
      .mutate({
        mutation: DELETE_MESSAGE,
        variables: { id: _id },

        update: (proxy, { data: { deleteMessage } }) => {
          debugger;
          // Read the data from our cache for this query.
          let data: any = proxy.readQuery({ query: GET_ALL_MESSAGES });

          let updatedData = data.getAllMessages.filter(u => {
            return u.id !== deleteMessage.id;
          });

          // Write our data back to the cache.
          proxy.writeQuery({
            query: GET_ALL_MESSAGES,
            data: { getAllMessages: updatedData }
          });
        }
      })
      .subscribe(
        ({ data }) => {
          console.log("got data: deleted user", data);
        },
        error => {
          console.log("there was an error sending the query", error);
        }
      );
  }

  add() {
    this.apollo
      .mutate({
        mutation: ADD_MESSAGE,
        variables: {
          msgInput: { ...this.input, created: new Date() }
        },
        update: (proxy, { data: { createMessage } }) => {
          debugger;
          // Read the data from our cache for this query.
          let data: any = proxy.readQuery({ query: GET_ALL_MESSAGES });

          // Add our message from the mutation to the end.
          data.getAllMessages.push(createMessage);

          // Write our data back to the cache.
          proxy.writeQuery({ query: GET_ALL_MESSAGES, data });
        }
      })
      .subscribe(
        ({ data }) => {
          console.log("got data", data);
          this.input = {};
        },
        error => {
          alert("there was an error sending the query " + error);
        }
      );
  }
}
