import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  GetMessageGQL,
  UpdateMessageGQL,
  AllMessagesGQL
} from "../qraphql/MessagesQuery";

import { BehaviorSubject } from "rxjs";
import { first, pluck } from "../../../node_modules/rxjs/operators";

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
    public getMessageQuery: GetMessageGQL,
    public updateMessageQuery: UpdateMessageGQL,
    public msgQuery: AllMessagesGQL
  ) {
    this.currentId = this.route.snapshot.paramMap.get("id") + "";
  }

  ngOnInit() {
    this.currentItem = this.getMessage(this.currentId);
  }

  getMessage(msgId) {
    return this.getMessageQuery.watch({ id: msgId }).valueChanges;
  }

  updateMessage = async () => {
    try {
      // get the current message, using promises to reduce
      // the indentation...
      let { data } = await this.getMessage(this.currentId)
        .pipe(first())
        .toPromise();

      let oldMsg = (data as any).getMessage;
      console.log("got data: updated", oldMsg);

      // do update mutation
      let updated = await this.updateMessageQuery
        .mutate(
          {
            id: oldMsg.id,
            msgInput: {
              content: oldMsg.content,
              author: oldMsg.author
            }
          },
          {
            update: (proxy, { data: { updateMessage } }) => {
              // Read the data from our cache for this query.
              let data: any = proxy.readQuery({
                query: this.msgQuery.document
              });

              // update message in local data.
              let updatedData = data.getAllMessages.map(item => {
                if (item.id !== this.currentId) {
                  return item;
                }
                return {
                  ...item,
                  ...updateMessage
                };
              });

              // Write our data back to the cache.
              proxy.writeQuery({
                query: this.msgQuery.document,
                data: { getAllMessages: updatedData }
              });
            }
          }
        )
        .pipe(first())
        .pipe(pluck("data", "updateMessage"))
        .toPromise();

      console.log("updated content", updated);
    } catch (ee) {
      alert(" Updating Message - ERROR" + ee);
    }
  };
}
