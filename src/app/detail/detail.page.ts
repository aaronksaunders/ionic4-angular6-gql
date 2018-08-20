import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import gql from "graphql-tag";
import { Apollo } from "apollo-angular";
import { HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "../../../node_modules/apollo-cache-inmemory";

//
// set up query to specific message by id
//
let GET_MESSAGE_BY_ID = gql`
  query getMessage($msgId: ID!) {
    getMessage(id: $msgId) {
      id
      content
      author
      created
    }
  }
`;

@Component({
  selector: "app-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"]
})
export class DetailPage implements OnInit {
  currentId;
  currentItem

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public apollo: Apollo,
    httpLink: HttpLink
  ) {
    let c = 

    this.currentId = this.route.snapshot.paramMap.get("id") + "";

  }

  ngOnInit() {
    this.currentItem = this.getMessage(this.currentId);
  }

  getMessage(msgId) {
    return this.apollo
      .watchQuery({
        query: GET_MESSAGE_BY_ID,
        variables: {
          msgId
        }
      }).valueChanges
  }
}
