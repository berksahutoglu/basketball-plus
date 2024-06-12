import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getPosts = (req, res) => {
  const user_id = req.query.user_id;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log(user_id);

    const q =
      user_id !== "undefined"
        ? `SELECT p.*, u.id AS user_id, username, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.user_id) WHERE p.user_id = ? ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS user_id, username, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.user_id)
    LEFT JOIN relationships AS r ON (p.user_id = r.followed_user_id) WHERE r.follower_user_id= ? OR p.user_id =?
    ORDER BY p.createdAt DESC`;

    const values =
      user_id !== "undefined" ? [user_id] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts (`desc`,`img`,`createdAt`,`user_id`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created");
    });
  });
};
export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE `id`=? AND `user_id` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};
