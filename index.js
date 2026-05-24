const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(
  cors({
    origin: [
      "https://clean-city-10.netlify.app",
      "http://localhost:5173",
      "https://clean-city-10.vercel.app",
      "https://clean-city-server-10-git-main-project-milestone-10.vercel.app",
      "https://clean-city-10-server.vercel.app"
    ].filter(Boolean),
  })
);
app.use(express.json());

// MongoDB URI
// const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USERPASS}@cluster0.h2rvvtm.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USERPASS}@cluster0.ekpzegp.mongodb.net/?appName=Cluster0`;


// Mongo Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // ✅ connect DB
    await client.connect();
    console.log("✅ MongoDB Connected Successfully");

    const db = client.db("Clean-city_db");
    const issuesCollection = db.collection("issues");
    const contributionCollection = db.collection("contribution");
    const userCollection = db.collection("user");

    // ================= USER =================
    app.get("/user", async (req, res) => {
      try {
        const result = await userCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    app.post("/user", async (req, res) => {
      try {
        const data = req.body;
        const result = await userCollection.insertOne(data);
        res.send({ success: true, result });
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // ================= ISSUES =================
    app.get("/issues", async (req, res) => {
      try {
        const result = await issuesCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    app.get("/issues/:id", async (req, res) => {
      try {
        const { id } = req.params;

        // invalid id handle
        if (!ObjectId.isValid(id)) {
          return res.status(400).send("Invalid ID");
        }

        const result = await issuesCollection.findOne({
          _id: new ObjectId(id),
        });

        res.send({ success: true, result });
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    app.post("/issues", async (req, res) => {
      try {
        const data = req.body;
        const result = await issuesCollection.insertOne(data);
        res.send({ success: true, result });
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    app.get("/issues-single/latest", async (req, res) => {
      try {
        const result = await issuesCollection
          .find({})
          .sort({ _id: -1 })
          .limit(6)
          .toArray();

        res.send(result);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    app.put("/issues/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send("Invalid ID");
        }

        const updatedData = req.body;

        const result = await issuesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );

        res.send(result);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    app.delete("/issues/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send("Invalid ID");
        }

        const result = await issuesCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Issue not found" });
        }

        res.send(result);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // ================= CONTRIBUTION =================
    app.post("/contributions", async (req, res) => {
      try {
        const data = req.body;
        const result = await contributionCollection.insertOne(data);
        res.send(result);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    app.get("/contributions", async (req, res) => {
      try {
        const issueId = req.query.issueId;
        const query = {};
        if (issueId) query.issueId = issueId;

        const result = await contributionCollection.find(query).toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // ================= ROOT =================
    app.get("/", (req, res) => {
      res.send("✅ Server is running");
    });

  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
  }
}

run();

// server start - only for local development, Vercel handles this
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

/**
 * Vercel Serverless Function Handler
 * Required for serverless deployment on Vercel
 */
module.exports = app;