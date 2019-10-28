
const express = require("express");
const cors = require("cors");
const db = require("./data/db");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/users", getUsers);
app.get("/api/users/:id", getUserById);
app.post("/api/users", addUser);
app.delete("/api/users/:id", deleteUser);
app.put("/api/users/:id", editUser);

function getUsers(req, res) {
  db.find()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "could not retrieve" });
    });
}

function addUser(req, res) {
  const { name, bio } = req.body;
  if (!name || !bio) {
    res.status(400).json({ errorMessage: "Both name and bio required" });
  } else {
    db.insert(req.body)
      .then(data => {
        res.status(201).json({
          id: data.id,
          name: req.body.name,
          bio: req.body.bio
        });
      })
      .catch(() => {
        res.status(500).json({ errorMessage: "Error while saving" });
      });
  }
}

function getUserById(req, res) {
  const { id } = req.params;
  db.findById(id)
    .then(data => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: "User does not exist." });
      }
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "could not be retrieved" });
    });
}

function deleteUser(req, res) {
  const { id } = req.params;
  db.remove(id)
    .then(data => {
      if (data) {
        res.json({ message: "User deleted" });
      } else {
        res.status(500).json({ errorMessage: "Does not exist" });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The user could not be removed" });
    });
}

function editUser(req, res) {
  const { id } = req.params;
  const { name, bio } = req.body;
  db.update(id, req.body)
    .then(data => {
      if (!data) {
        res.status(404).json({ errorMessage: "Does not exist" });
      } else if (!name || !bio) {
        res.status(400).json({ errorMessage: "Both name and bio required" });
      } else {
        res.status(200).json(req.body)
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The user could not be modified" });
    });
}

app.listen(process.env.PORT || 3300, () => {
  console.log("listening on " + (process.env.PORT || 3300));
});
