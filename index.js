const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = 3000;

//CMIv9ACvHmNRv9K5
//clean.db

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USERPASS}@cluster0.h2rvvtm.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("Clean_db");
    const issusCollection = db.collection("issus");
    const contributionCollection = db.collection("contribution");
    const userCollection = db.collection("user");

    app.get("/user", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/user", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await userCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });

    app.get("/issus", async (req, res) => {
      const result = await issusCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/issus/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const result = await issusCollection.findOne({ _id: new ObjectId(id) });
      res.send({
        success: true,
        result,
      });
    });

    app.post("/issus", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await issusCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });

    app.get("/issus-single/latest", async (req, res) => {
      const result = await issusCollection
        .find({})
        .sort({
          title: -1,
        })
        .limit(6)
        .toArray();

      console.log("Latest issues:", result);
      res.send(result);
    });

    app.post("/contributions", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await contributionCollection.insertOne(data);
      res.send(result);
    });

    app.get("/contributions", async (req, res) => {
      const issueId = req.query.issueId;
      const query = {};
      if (issueId) query.issueId = issueId;

      const result = await contributionCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    app.put("/issues/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      const result = await issusCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });

    app.delete("/issues/:id", async (req, res) => {
      const id = req.params.id;

      const result = await issusCollection.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Issue not found" });
      }

      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
