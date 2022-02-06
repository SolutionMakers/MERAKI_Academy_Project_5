import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";


const ProfilePage = () => {
  const { user_id } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [uploadedImage,setUploadedImage]=useState('')
  const [profileimage,setProfileimage]=useState('');
  const [userInfo, setUserInfo] = useState([]);
  const state = useSelector((state) => {
    return {
      token: state.loginReducer.token,
    };
  });
  /************************************* */
  const uploadimage = async () =>{
    console.log(uploadedImage)
    const formData = new FormData();
    formData.append("file", uploadedImage);
    formData.append("upload_preset", "wyggi4ze");

    await axios
      .post("https://api.cloudinary.com/v1_1/dvg9eijgb/image/upload", formData)
      .then((response) => {
        console.log(response)
        setProfileimage(response.data.secure_url);
      })
      .catch((err) => {
        throw err;
      });
  }

  /****************************************** */
  const getPostsByUserId = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/posts/${user_id}`);
      if (res.data.success) {
        setUserPosts(res.data.results);
        console.log(`All the posts for this user_id ${user_id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };
  /***************************************** */
  const getUserInfo= async ()=>{
    
    try {
      const res = await axios.get(`http://localhost:5000/users/${user_id}/info`);
      if (res.data.success) {
        console.log(res.data.Info)
        setUserInfo(res.data.Info[0]);
        console.log(`All the posts for this user_id ${user_id}`);
      }
    } catch (err) {
      console.log(err);
    }
  }
  /****************************************** */

  const putNewLike = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/like/${id}`,{},
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      if (res.data.success) {
        console.log("done");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
      }
    }
  };
  /***************************************** */

  useEffect(() => {
    getPostsByUserId();
    getUserInfo();
  }, []);
  return (
    <>
      <div>Profile Page</div>
      <div>userInfo
      <p>{userInfo.userName}</p>
        <img src={userInfo.profileimage}/>
        <p>{userInfo.email}</p>
                <p>{userInfo.dob}</p>
                <p>{userInfo.country}</p>
                <p>{userInfo.gender}</p>
        <input
        type='file'
          onChange={(e) => {
            setUploadedImage(e.target.files[0]);
          }}
        />
        <button onClick={uploadimage}>upload</button>

      </div>
      {userPosts.length
        ? userPosts.map((element, index) => {
            return (
              <div key={index}>
                <h1>User Posts:</h1>
                <h1>{element.media}</h1>
                <h1>{element.description}</h1>
                <h1>user Info</h1>
                <h1>{element.userName}</h1>
                <h1>{element.email}</h1>
                <h1>{element.dob}</h1>
                <h1>{element.country}</h1>
                <h1>{element.profileimage}</h1>
                <h1>{element.gender}</h1>
                <button onClick={()=>putNewLike(element.id)}>Like</button>
              </div>
            );
          })
        : "No Posts for this user"}
    </>
  );
};

export default ProfilePage;
