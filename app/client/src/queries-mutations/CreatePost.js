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
        userId
        user{
          id
          name
          email
          profileUrl
        }
      }
    }
  }
`;

export default CreatePost;
