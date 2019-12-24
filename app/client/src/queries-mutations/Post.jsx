import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PostBox from '../components/postBox.jsx';


const Post = () => (
  <Query
    query={gql`
      query getAPost($id: String!){
        Post: getAPost(id: $id){
          errors{
            msg
          }
          fileId
          fileType
          userEmail
          id
          caption
          likeCount
          dislikeCount
          comments{
            text
            userEmail
            id
            userName
          }
        }
      }
    `}
    variables={{id: this.props.match.params.postId}}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      return(
        <div>
          {data.getAPost.map(postInfo => (
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
export default Post;
