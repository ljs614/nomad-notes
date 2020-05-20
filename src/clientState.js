import { NOTE_FRAGMENT } from "./fragments";
import { GET_NOTES } from "./queries";

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
        editNote(id: Int!, title: String, content:String): Note
    }
    type Note {
        id: Int!
        title: String!
        content: String!
    }
    `
];
export const resolvers = {
    Mutation: {
        createNote: (_, variables, { cache }) => {
            const { notes } = cache.readQuery({ query: GET_NOTES});
            const { title, content } = variables
            const newNote = {
                __typename: "Note",
                title,
                content,
                id: notes.length + 1
            }
            cache.writeData({
                data: {
                    notes: [newNote, ...notes]
                }
            });
            return newNote;
        },
        editNote: (_, {id, title, content}, { cache }) => {
            const noteId = cache.config.dataIdFromObject({
                __typename: "Note", 
                id
            });
            const note = cache.readFragment({fragment: NOTE_FRAGMENT, id: noteId});
            const updateNote = {
                ...note,
                title,
                content
            };
            cache.writeFragment({
                id: noteId,
                fragment: NOTE_FRAGMENT,
                data: updateNote         
            });
            return 

        }
    },
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