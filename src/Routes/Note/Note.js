import React from "react"
import { Link } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import styled from "styled-components";
import MarkdownRenderer from "react-markdown-renderer";
import { GET_NOTE } from "../../queries";
import gql from "graphql-tag";


export const DELETE_NOTE = gql`
    mutation deleteNote($id: Int!) {
        deleteNote(id: $id) @client {
            id
        }
    }
`;

const TitleComponent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
`;

const Title = styled.h1`
  font-size: 50px;
  margin: 0;
  padding: 0;
`;

const Buttons = styled.div``;
const Button = styled.button`
  margin-left: 10px;
`;

export default class Note extends React.Component{
    render() {
        const {
            match: {
              params: { id }
            }
          } = this.props;
        return (
        <Query query={GET_NOTE} variables={{ id }}>
            {({ data }) => data?.note ? (
              <>
                <TitleComponent>
                  <Title>{data.note && data.note.title}</Title>
                  <Buttons>
                    <Link to={`/edit/${data.note.id}`}>
                      <Button>Edit</Button>
                    </Link>
                    <Mutation mutation={DELETE_NOTE}>
                      {deleteNote => {
                        this.deleteNote = deleteNote;
                        return (
                          <Button onClick={this._onDelete}>Del</Button>
                        );
                      }}
                    </Mutation>
                  </Buttons>
                </TitleComponent>
                <MarkdownRenderer markdown={data.note.content} />
              </>

            ) : null
            }
        </Query>
        );
    }
    _onDelete = () =>{
      const {history: {push}, match:{params:{id}}} = this.props;
      if(id){
        this.deleteNote({variables: {id}});
        push("/");
      }
    }

}