import React from 'react';
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import CreatePostForm from '../components/createPostForm.jsx';


const Feed = () => (
  <li key="feed">
    <NavBarWithoutSignIn key={"navBarWithSignIn"} />
    <CreatePostForm key={"CreatePost"} />
  </li>
);

export default Feed;
