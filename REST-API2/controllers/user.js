import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getUser = (req, res) => {
  const user_id = req.params.user_id;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [user_id], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log(req.body);

    try {
      const q =
        "UPDATE users SET `username`=?,`profilePic`=?,`coverPic`=? WHERE id = ?";
      db.query(
        q,
        [
          req.body.username,
          req.body.profilePic,
          req.body.coverPic,
          userInfo.id,
        ],
        (err, data) => {
          if (err) {
            console.log("error:", err);
            return res.status(500).json(err);
          }
          if (data.affectedRows > 0) return res.json("Updated!");
          return res.status(403).json("You can update only your account!");
        }
      );
    } catch (err) {
      console.log(err);
    }
  });
};

export const searchUsers = (req, res) => {
  const searchQuery = req.query.query;
  const q = "SELECT id, username, profilePic FROM users WHERE username LIKE ?";

  db.query(q, [`%${searchQuery}%`], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
};

// Email ve Şifre Güncelleme
// Email ve Şifre Güncelleme
export const updateUserCredentials = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { email, password, newPassword, newPasswordRepeat } = req.body;

    // Yeni şifre ve şifre tekrarı eşleşiyor mu kontrolü
    if (newPassword !== newPasswordRepeat) {
      return res.status(400).json("New passwords do not match!");
    }

    // Mevcut şifreyi doğrulama
    const q = "SELECT password FROM users WHERE id = ?";
    db.query(q, [userInfo.id], async (err, data) => {
      if (err) return res.status(500).json(err);
      const isPasswordCorrect = await bcrypt.compare(
        password,
        data[0].password
      );
      if (!isPasswordCorrect)
        return res.status(400).json("Incorrect current password!");

      // Yeni şifreyi hashleyerek güncelleme
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const qUpdate = "UPDATE users SET email = ?, password = ? WHERE id = ?";
      db.query(
        qUpdate,
        [email, hashedNewPassword, userInfo.id],
        (err, data) => {
          if (err) return res.status(500).json(err);
          return res.json("Updated successfully!");
        }
      );
    });
  });
};
