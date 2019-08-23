import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PostBox from '../components/postBox.jsx';


const Posts = () => (
  <Query
    query={gql`
      {
        getAllPosts{
          errors{
            msg
          }
          fileId
          fileType
          userId
          id
          caption
          likeCount
          dislikeCount
          comments{
            text
            userId
          }
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      return(
        <div>
          {data.getAllPosts.map(postInfo => (
            <div key={postInfo.id}>
              <PostBox postInfo={postInfo}/>
              <p></p>
            </div>
          ))}
        </div>
      );
    }}
  </Query>
);
export default Posts;
