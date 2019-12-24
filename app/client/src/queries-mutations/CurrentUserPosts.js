import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PostBox from '../components/postBox.jsx';


const Posts = () => (
  <Query
    query={gql`
      {
        userPosts{
          id
          caption
          imgPath
          userEmail
          likeCount
          dislikeCount
          comments{
            text
            userId
            postId
            id
            userName
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
          {data.userPosts.map(postInfo => (
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
