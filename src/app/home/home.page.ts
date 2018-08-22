import { Component, OnInit } from "@angular/core";

import gql from "graphql-tag";
import { Apollo } from "apollo-angular";
import { HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import {
  AllMessagesGQL,
  DeleteMessageGQL,
  AddMessageGQL,
  GetMessageQuery,
  GetMessageGQL
} from "../qraphql/MessagesQuery";

import { pluck } from "rxjs/operators";

//
// see https://launchpad.graphql.com/r9x8jkr0qn for more
// information on the GraphQL Server
//

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  messages;
  aMessage;

  input: any = {
    content: "test",
    author: "Aaron Saunders"
  };

  constructor(
    public msgQuery: AllMessagesGQL,
    public deleteMsgQuery: DeleteMessageGQL,
    public addMessageQuery: AddMessageGQL
  ) {}

  ngOnInit() {
    this.messages = this.msgQuery
      .watch()
      .valueChanges.pipe(pluck("data", "getAllMessages"));
  }

  /**
   *
   * @param _id
   */
  deleteMessage(_id) {
    console.log(_id);

    this.deleteMsgQuery
      .mutate(
        {
          id: _id
        },
        {
          update: (proxy, { data: { deleteMessage } }) => {
            debugger;
            // Read the data from our cache for this query.
            let data: any = proxy.readQuery({ query: this.msgQuery.document });

            let updatedData = data.getAllMessages.filter(u => {
              return u.id !== deleteMessage.id;
            });

            // Write our data back to the cache.
            proxy.writeQuery({
              query: this.msgQuery.document,
              data: { getAllMessages: updatedData }
            });
          }
        }
      )
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
    this.addMessageQuery
      .mutate(
        {
          msgInput: {
            ...this.input,
            created: new Date()
          }
        },
        {
          update: (proxy, { data: { createMessage } }) => {
            debugger;
            // Read the data from our cache for this query.
            let data: any = proxy.readQuery({ query: this.msgQuery.document });

            // Add our message from the mutation to the end.
            data.getAllMessages.push(createMessage);

            // Write our data back to the cache.
            proxy.writeQuery({ query: this.msgQuery.document, data });
          }
        }
      )
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
