import moment from "moment";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getEvents = (req, res) => {
  const user_id = req.query.user_id;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log(user_id);

    let q = `SELECT e.*, u.id AS user_id, username, profilePic FROM events AS e JOIN users AS u ON (u.id = e.user_id)`;
    let values = [];

    if (user_id) {
      q += ` WHERE u.id = ?`;
      values = [user_id];
    }

    q += ` ORDER BY e.createdAt DESC`;

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addEvent = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Gelen verileri konsolda yazdır
    console.log("Gelen veriler:", req.body);

    const q =
      "INSERT INTO events (`desc`, `place`, `players`, `createdAt`, `user_id`,`date`,`time`) VALUES (?, ?, ?, ?, ?,?,?)";

    const values = [
      req.body.desc,
      req.body.place,
      req.body.players,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.date,
      req.body.time,
    ];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Event has been created");
    });
  });
};
