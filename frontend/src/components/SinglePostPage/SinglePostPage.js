import React, { useState, useEffect } from "react";
import { setPosts, updatePost, deletePost } from "../../reducers/post/index";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import {
  BsThreeDotsVertical,
  BsFillHeartFill,
  BsChatDotsFill,
  BsPlusCircleFill,BsPen
} from "react-icons/bs";


import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import noAvatar from "../../images/noAvatar.png";
import { format, render, cancel, register } from "timeago.js";
import "../SinglePostPage/SinglePostPage.css";

const SinglePostPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const state = useSelector((state) => {
    return {
      token: state.loginReducer.token,
      posts: state.postsReducer.posts,
      user_id: state.loginReducer.user_id,

    };
  });
  const [post, setPost] = useState([]);
  const [modal, setModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [description, setDescription] = useState("");
  const imgUser = localStorage.getItem("img");
  const toggleModal = () => {
    setModal(!modal);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/posts/${id}`)
      .then((result) => {
        dispatch(deletePost(id));
        getPostByID();
      })
      .catch((err) => {
        throw err;
      });
  };
  /************************************************************************************************************* */
  const handleUpdate = async (id) => {
    try {
      const newPost = {
        description,
      };
      const res = await axios.put(
        `http://localhost:5000/posts/${id}/post`,
        newPost,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      if (res.data.success) {
        dispatch(updatePost(newPost));
        getPostByID();
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* ****************************************************** */

  const getCommentsByUserID = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/all/${id}/comments`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      if (res.data.success) {
        setComments(res.data.results);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data.message);
      }
    }
  };
  /* ****************************************************** */

  const getLikesByUserID = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/like/${id}`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      if (res.data.success) {
        setLikeCount(res.data.results.length);
        setLikes(res.data.results);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data.message);
      }
    }
  };
 
  /* ****************************************************** */
  const getPostByID = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/posts/${id}/post`);
      if (res.data.success) {
        setPost(res.data.results[0]);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data.message);
      }
    }
  };
  /* ****************************************************** */

  const putNewLike = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/like/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      if (res.data.success) {
        console.log("done");
        getPostByID();
        getLikesByUserID();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
      }
    }
  };
  /* ****************************************************** */
  const createNewComment = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/posts/${id}/comments`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      if (res.data.success) {
        setComment(res.data.results);
        setComment("");
        getPostByID();
        getCommentsByUserID();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
      }
    }
  };
  /* ****************************************************** */

  useEffect(() => {
    getPostByID();
    getCommentsByUserID();
    getLikesByUserID();
  }, []);

  return (
    <div>
      {post.is_deleted == 0 ? (
        <div className="Single_post">
          <div className="post">
            <div className="postWrapper">
              <div className="postTop">
                <div className="postTopLeft">
                  <Link to={`/profile/${post.user_id}`}>
                    <img
                      className="postProfileImg"
                      width="100%"
                      src={
                        post.profileimage !== "undefined"
                          ? post.profileimage
                          : noAvatar
                      }
                    />
                  </Link>
                  <span className="postUsername">{post.userName}</span>
                  <span className="postDate">{format(post.created_at)}</span>
                </div>
                <div className="postTopRight">
                  <BsThreeDotsVertical
                    className="icon_popup"
                    onClick={() => toggleModal(post.id)}
                  />
                  <div>
                    {" "}
                    {modal && (
                           <div className="modal_Edit">
                           <div
                             onClick={toggleModal}
                             className="overlay_Edit"
                           ></div>
                           <div className="modal-content_Edit">









                             <div className="Edit_post_pagePost">
             <div className="pen_publish_pagePost">
               <BsPen className="icon_pen_pagePost" />
               <div className="publish_pagePost">Edit Post</div>
             </div>

             <div className="border_bottom_create_pagePost"></div>
             <div className="content_create_post_pagePost">
               <img
                 className="img_user_creat_post_pagePost"
                 src={imgUser !== "undefined" ? imgUser : noAvatar}
               />

               <textarea
                 id="publish_pagePost"
                 className="textarea_pagePost"
                 defaultValue={post.description}
                 rows="3"
               
                 spellCheck="false"
                 onChange={(e) => {
                   setDescription(e.target.value);
                 }}
               ></textarea>


             </div>
             <div className="upload_media_post_pagePost">
              
               <button
                 className="Delete_button"
                 onClick={(e) => {
                   handleDelete(id)
                
                   toggleModal();
                 
                  
                 }}
               >
                 <MdDeleteForever className="rubbish"/>
                 Delete
               </button>

               <button
                 className="button_Save"
                 onClick={(e) => {
                    handleUpdate(id)
                    toggleModal();
                 }}
               >
                 Save
               </button>
             </div>
           </div>









                           </div>
                         </div>
                      // <div className="modal_post">
                      //   <div
                      //     onClick={toggleModal}
                      //     className="overlay_post"
                      //   ></div>
                      //   <div className="modal-content_post">
                      //     <h2>Edit Post</h2>
                      //     <button
                      //       className="button_delete"
                      //       onClick={() => {
                      //         navigation("/home");
                      //         handleDelete(id);
                      //       }}
                      //     >
                      //       delete
                      //     </button>
                      //     <input
                      //       type="text"
                      //       placeholder="updated description"
                      //       onChange={(e) => {
                      //         setDescription(e.target.value);
                      //       }}
                      //     />
                      //     <button onClick={() => handleUpdate(id)}>
                      //       Update
                      //     </button>
                      //     <button
                      //       className="close-modal_post"
                      //       onClick={() => toggleModal("")}
                      //     >
                      //       CLOSE
                      //     </button>
                      //   </div>
                      // </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="postCenter">
                <p className="postText">{post.description}</p>
                <img className="postImg" src={post.media} alt="" />
              </div>

              <div className="postBottom">
                <div className="postBottomLeft">
                {checkLikes() ? (
                        <BsFillHeartFill
                          className="likeIcon_heart"
                          style={{ transition: "all 0.5s", color: "#e60023" }}
                        />
                      ) : (
                        <BsFillHeartFill
                          className="likeIcon_heart"
                          onClick={(e) => {
                            putNewLike(id);
                            e.target.style.color = "#e60023";
                            e.target.style.transition = "all 0.5s";
                          }}
                        />
                      )}

                  <span className="postLikeCounter">
                    {likes.length} People Like It
                  </span>
                </div>

                <div className="postBottomRight">
                   
                      <BsChatDotsFill
                        className="postCommentText"
                      
                      />
                         comments: {comments.length}
                    </div>
                {/* <span>Comments: {comments.length}</span> */}
              </div>
            </div>
            <div className="all_comments">
            
              {comments.length ? (
                comments.map((element, index) => {
                  return (
                    <div key={index} className="comment_style">
                      <div className="comment_flex_row">
                        <img
                          className="img_profile_single"
                          src={
                            element.profileimage !== "undefined"
                              ? element.profileimage
                              : noAvatar
                          }
                        />

                        <div className="one_comment">
                          <div className="comment_flex_column">
                            <div className="uesr_commenter_name">
                              {element.userName}
                            </div>

                            <div className="comment_font">
                              {element.comment}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>

            <div className="add_comment_syle">
              <input
                className="Add_comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                type="text"
                placeholder="write comment here..."
              />{" "}
              <BsPlusCircleFill className="apple" onClick={createNewComment} />
            </div>
          </div>
        </div>
      ) : (
        <>No Posts</>
      )}
    </div>
  );
};

export default SinglePostPage;
