import React from 'react';
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import CreatePostForm from '../components/createPostForm.jsx';
import Footer from "../components/Footer.jsx"



const CreatePostPage = () => (
  <div key="createPostPage" >
    <NavBarWithoutSignIn key={"navBarWithSignIn"} />
    <div className="row-8">
      <CreatePostForm key={"CreatePost"}/>
    </div>
    <Footer/>
  </div>
);

export default CreatePostPage;
