const express = require("express");
const fs = require("fs");
const { verificationMiddleware, verifyData } = require("./verification");

const PORT = 3000;
const app = express();
app.use(express.static("./static"));
app.use(express.json());
app.listen(PORT, () => {
  console.log("server at" + PORT);
});

//parse  => string to javascript
//stringify   => javascriot to string

app.get("/users", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    if (err) return res.status(500).send("server error");
    let users = JSON.parse(data);
    res.status(200).json(users);
  });
});

app.post("/users", verificationMiddleware, (req, res) => {
  let { CNE, username, subscription } = req.body;
  fs.readFile("./data.json", (err, data) => {
    if (err) return res.status(500).send("server error");
    let users = JSON.parse(data);

    let newUser = {
      CNE: CNE,
      username: username,
      subscription: subscription,
    };
    users.push(newUser);

    fs.writeFile("./data.json", JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).send("server error ");
      res.status(201).json(newUser);
    });
  });
});

app.delete("/users/:CNE", (req, res) => {
  let userCNE = req.params.CNE;
  fs.readFile("./data.json", (err, data) => {
    if (err) return res.status(500).send("server error");
    let users = JSON.parse(data);

    foundUser = users.find((ele) => ele.CNE == userCNE);
    if (foundUser) {
      users = users.filter((ele) => ele.CNE !== userCNE);
      res.status(200).send(userCNE + " is delete from the db ");
    } else res.status(400).send("user not found");

    fs.writeFile("./data.json", JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).send("server error ");
      res.status(200);
    });
  });
});

app.put("/users/:CNE", (req, res) => {
  let userCNE = req.params.CNE;
  let subsType = req.body.subscription;

  fs.readFile("./data.json", (err, data) => {
    if (err) return res.status(500).send("server error");
    let users = JSON.parse(data);

    foundUser = users.find((ele) => ele.CNE == userCNE);

    if (foundUser) {
      users.map((user) => {
        if (user.CNE == userCNE) {
          user.subscription = subsType;
          res.status(200);
        }
      });
    } else {
      return res.status(400).send("not found ");
    }

    fs.writeFile("./data.json", JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).send("server error ");
      res.status(200).json(foundUser);
    });
  });
});
