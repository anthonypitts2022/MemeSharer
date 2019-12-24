import gql from "graphql-tag";


const CreatePost = gql`
  mutation createPost($input: createPostInput){
    Post: createPost(input: $input){
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
        userId
      }
    }
  }
`;

export default CreatePost;
