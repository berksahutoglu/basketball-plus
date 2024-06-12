import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS user_id, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.user_id)
    WHERE c.post_id = ? ORDER BY c.createdAt DESC`;

  db.query(q, [req.query.post_id], (err, data) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ error: "Error fetching posts" });
    }
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO comments (`desc`,`createdAt`,`user_id`,`post_id`) VALUES (?)";

    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.post_id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created");
    });
  });
};
