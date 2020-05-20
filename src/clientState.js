import { NOTE_FRAGMENT } from "./fragments";

export const defaults = {
    notes: [
        {
            __typename: "Note",
            id: 1,
            title: "First",
            content: "haha"
        }
    ]
};
export const typeDefs = [
    `
    extend schema {
        mutation: Mutation
    }
    extend type Query {
        notes: [Note]!
        note(id: Int!): Note
    }
    type Mutation {
        createNote(title: String!, content: String!): Note
        editNote(id: String!, title: String!, content:String!): Note
    }
    type Note {
        id: Int!
        title: String!
        content: String!
    }
    `
];
export const resolvers = {
    Mutation: {},
    Query: {
        note: (_, variables, { cache }) => {
            const id = cache.config.dataIdFromObject({
                __typename: "Note", 
                id: variables.id
            });
            const note = cache.readFragment({fragment: NOTE_FRAGMENT, id});
            return note;
        }
    }
};