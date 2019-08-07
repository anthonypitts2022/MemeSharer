import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PostBox from './components/postBox.jsx';


const Posts = () => (
  <Query
    query={gql`
      {
        getAllPosts{
          caption
          id
          userId
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      return(
        <p>
          {data.getAllPosts.map(postInfo => (
            <div>
              <PostBox key={postInfo.id} postInfo={postInfo}/>
              <p key={postInfo.id +"p"}></p>
            </div>
          ))}
        </p>
      );
    }}
  </Query>
);
export default Posts;
