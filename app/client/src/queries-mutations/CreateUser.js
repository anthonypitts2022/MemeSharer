import gql from "graphql-tag";


const CreateUser = gql`
  mutation createUser($input: CreateUserInput){
    User: createUser(input: $input){
      errors{
        msg
      }
      id
      name
      email
      password
    }
  }
`;

export default CreateUser;
