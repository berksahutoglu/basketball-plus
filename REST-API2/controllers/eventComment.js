import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import dotenv from "dotenv";
import axios from "axios";
import OpenAI from "openai";

dotenv.config();

export const getEventComments = (req, res) => {
  const q = `SELECT e.*, u.id AS user_id, username, profilePic FROM eventcomments AS e JOIN users AS u ON (u.id = e.user_id)
    WHERE e.event_id = ? ORDER BY e.createdAt DESC`;

  db.query(q, [req.query.event_id], (err, data) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ error: "Error fetching posts" });
    }
    return res.status(200).json(data);
  });
};

export const getPerformanceReview = (req, res) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { user_id, username } = req.body;
  console.log("User ID:", user_id);
  console.log("Username:", username);

  const commentsQuery = `
    SELECT ec.desc
    FROM eventcomments ec
    JOIN events e ON ec.event_id = e.id
    JOIN join_requests jr ON e.id = jr.event_id
    WHERE jr.user_id = ? AND jr.status = 'approved'
  `;

  db.query(commentsQuery, [user_id], async (err, comments) => {
    if (err) return res.status(500).json(err);

    const commentsText = comments.map((comment) => comment.desc).join(" ");
    console.log(commentsText);

    try {
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Aşağıda oyuncular hakkında yapılan yorumları bulacaksınız. Bu yorumlara dayanarak, ${username} isimli oyuncunun performansı hakkında genel bir değerlendirme yapabilir misiniz? Bu yorumların bir kısmı basketbol maçından, diğer kısmı ise farklı bir basketbol maçından sonra yapılmış olabilir. Bir basketbol yorumcusu gibi yorum yapmanızı ve sadece mevcut yorumlardaki bilgileri kullanarak bir cevap vermenizi rica ediyorum. İşte yorumlar: ${commentsText}`,
          },
        ],
        model: "gpt-4",
      });

      console.log("API Response:", response);

      if (response && response.choices && response.choices.length > 0) {
        res.json({ review: response.choices[0].message.content });
      } else {
        res.status(500).json({ error: "Unexpected response from OpenAI API" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "OpenAI API error" });
    }
  });
};

export const addEventComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO eventcomments (`desc`,`createdAt`,`user_id`,`event_id`) VALUES (?)";

    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.event_id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created");
    });
  });
};
