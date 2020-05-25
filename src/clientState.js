import { NOTE_FRAGMENT } from "./fragments";
import { GET_NOTES, GET_NOTE } from "./queries";
import { saveNotes, resotreNotes } from "./offline";

export const defaults = {
    notes: resotreNotes()
};
export const typeDefs = [
    `
      schema {
          query: Query
          mutation: Mutation
      }
      type Query {
          notes: [Note]!
          note(id: Int!): Note
      }
      type Mutation{
          createNote(title: String!, content: String!): Note
          editNote(id: Int!, title: String, content:String): Note
          deleteNote(id: Int!): Note
      }
      type Note{
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
            const { title, content } = variables;
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
            saveNotes(cache);
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
            saveNotes(cache)
            return updateNote;

        },
        deleteNote: (_, {id}, { cache }) => {
            const { notes } = cache.readQuery({ query: GET_NOTES});
            const { note } = cache.readQuery({query: GET_NOTE, variables:{id}})
            const delIndex = notes.findIndex(i => i.id === note.id);
            notes.splice(delIndex,1);
            cache.writeData({
                data: {
                    notes: [...notes]
                }
            });
            saveNotes(cache);
            return note;
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