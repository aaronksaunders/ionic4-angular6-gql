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
    }
  }
`;


let ADD_MESSAGE = gql`
  mutation add($msgInput: MessageInput!) {
    createMessage(input: $msgInput) {
      id
      content
      author
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

  constructor(public apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      // By default, this client will send queries to the
      // `/graphql` endpoint on the same host
      link: httpLink.create({ uri: "https://r9x8jkr0qn.lp.gql.zone/graphql" }),
      cache: new InMemoryCache()
    });
  }

  ngOnInit() {
    this.messages = this.apollo.watchQuery({
      query: GET_ALL_MESSAGES
    }).valueChanges;
  }

  add() {
    this.apollo
      .mutate({
        mutation: ADD_MESSAGE,
        variables: {
          msgInput: this.input
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
