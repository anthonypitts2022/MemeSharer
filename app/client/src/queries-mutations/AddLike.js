import gql from "graphql-tag";


const AddLike = gql`
  mutation createLike($input: createLikeInput){
    Like: createLike(input: $input){
      errors{
        msg
      }
      id
      userId
      postId
      isLike
    }
  }
`
export default AddLike;
