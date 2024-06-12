import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const addJoinRequest = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Check if the join request already exists
    const checkQuery =
      "SELECT * FROM join_requests WHERE user_id = ? AND event_id = ?";
    const checkValues = [userInfo.id, req.body.event_id];

    db.query(checkQuery, checkValues, (checkErr, checkData) => {
      if (checkErr) return res.status(500).json(checkErr);

      if (checkData.length > 0) {
        return res.status(400).json("You've already sent a request.");
      } else {
        // If no existing request, proceed to insert the new join request
        const insertQuery =
          "INSERT INTO join_requests (user_id, event_id, status, created_at) VALUES (?)";
        const insertValues = [
          userInfo.id,
          req.body.event_id,
          "pending",
          moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        ];

        db.query(insertQuery, [insertValues], (insertErr, insertData) => {
          if (insertErr) return res.status(500).json(insertErr);
          return res.status(200).json("Join request has been sent.");
        });
      }
    });
  });
};

export const getAllJoinRequests = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT jr.*, u.username
FROM join_requests jr
JOIN users u ON jr.user_id = u.id
JOIN events e ON jr.event_id = e.id
JOIN users e_owner ON e.user_id = e_owner.id
WHERE e_owner.id = ?`;
    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length > 0) {
        const joinRequests = data.map((request) => ({
          id: request.id,
          message: `${request.username} etkinliğinize katılmak istiyor.`,
          status: request.status,
        }));
        return res.status(200).json(joinRequests);
      } else {
        return res.status(200).json([]);
      }
    });
  });
};

export const getApprovedRequests = (req, res) => {
  const eventId = req.params.eventId;
  const q = `
    SELECT users.username,users.profilePic,users.id 
    FROM join_requests 
    JOIN users ON join_requests.user_id = users.id 
    WHERE join_requests.status = 'approved' AND join_requests.event_id = ?
  `;

  db.query(q, [eventId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (data.length > 0) {
      const joinRequests = data.map((request) => ({
        id: request.id, // Eğer join_requests tablosunda bir id alanı varsa
        username: `${request.username} `,
        profilePic: request.profilePic,
      }));
      return res.status(200).json(joinRequests);
    } else {
      return res.status(200).json([]);
    }
  });
};

export const respondToJoinRequest = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { id, response } = req.body; // 'approved' veya 'rejected'

    if (!["approved", "rejected"].includes(response)) {
      return res.status(400).json("Invalid response");
    }

    const q = "UPDATE join_requests SET status = ? WHERE id = ?";

    db.query(q, [response, id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) {
        return res.status(200).json(`Join request has been ${response}.`);
      } else {
        return res.status(404).json("Join request not found.");
      }
    });
  });
};
