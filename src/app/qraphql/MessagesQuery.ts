import { Injectable } from "@angular/core";
import { Query, Mutation } from "apollo-angular";
import gql from "graphql-tag";

export type AllMessagesQuery = {
  messages: Message[];
};

export type Message = {
  id: string;
  content: string;
  author: string;
  created: string;
};

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
        updated
      }
    }
  `;
}

export type GetMessageQuery = {
  message: Message;
};

export type GetMessageVariables = {
  id: string;
};

@Injectable({
  providedIn: "root"
})
export class GetMessageGQL extends Query<GetMessageQuery, GetMessageVariables> {
  document = gql`
    query getMessage($id: ID!) {
      getMessage(id: $id) {
        id
        content
        author
        created
        updated
      }
    }
  `;
}

export type DeleteMessageMutation = {
  message: Message;
};

export type DeleteMessageVariables = {
  id: string;
};

@Injectable({
  providedIn: "root"
})
export class DeleteMessageGQL extends Mutation<
  DeleteMessageMutation,
  DeleteMessageVariables
> {
  document = gql`
    mutation deleteMessage($id: ID!) {
      deleteMessage(id: $id) {
        id
      }
    }
  `;
}

export type AddMessageMutation = {
  newMessage: Message;
};

export type AddMessageVariables = {
  msgInput: {
    content: string;
    author: string;
    created: string;
  };
};

@Injectable({
  providedIn: "root"
})
export class AddMessageGQL extends Mutation<
  AddMessageMutation,
  AddMessageVariables
> {
  document = gql`
    mutation add($msgInput: MessageInput!) {
      createMessage(input: $msgInput) {
        id
        content
        author
        created
        updated
      }
    }
  `;
}

export type UpdateMessageMutation = {
  updatedMessage: Message;
};

export type UpdateMessageVariables = {
  id: string;
  msgInput: {
    content: string;
    author: string;
  };
};
@Injectable({
  providedIn: "root"
})
export class UpdateMessageGQL extends Mutation<
  UpdateMessageMutation,
  UpdateMessageVariables
> {
  document = gql`
    mutation update($id: ID!, $msgInput: MessageInput!) {
      updateMessage(id: $id, input: $msgInput) {
        id
        content
        author
        created
        updated
      }
    }
  `;
}
