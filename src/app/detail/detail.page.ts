import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GetMessageGQL } from "../qraphql/MessagesQuery";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"]
})
export class DetailPage implements OnInit {
  currentId;
  currentItem;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public getMessageQuery: GetMessageGQL
  ) {
    this.currentId = this.route.snapshot.paramMap.get("id") + "";
  }

  ngOnInit() {
    this.currentItem = this.getMessage(this.currentId);
  }

  getMessage(msgId) {
    return this.getMessageQuery.watch({ id: msgId }).valueChanges;
  }
}
