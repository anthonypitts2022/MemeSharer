import gql from "graphql-tag";


const CreatePost = gql`
  mutation createPost($input: createPostInput){
    Post: createPost(input: $input){
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
        userEmail
        userName
      }
    }
  }
`;

export default CreatePost;
