import express from "express";
import { MongoClient } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

app.use(express.static(path.join(__dirname, "client")));

app.get("/api", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("dbforlab");
    const collection = db.collection("computers");

    const type = req.query.type;
    const value = req.query.value;
    let results = [];

    if (type === "cpu" && value) {
      results = await collection
        .find({ cpu: value }, { projection: { _id: 0 } })
        .toArray();
    }
    // 2. Пошук за ПЗ
    else if (type === "software" && value) {
      results = await collection
        .find({ software: value }, { projection: { _id: 0 } })
        .toArray();
    }
    // 3. Гарантія вичерпана
    else if (type === "warranty") {
      const currentYear = new Date().getFullYear();
      results = await collection
        .find(
          {
            $expr: {
              $lt: [{ $add: ["$buy_year", "$warranty"] }, currentYear],
            },
          },
          { projection: { _id: 0 } },
        )
        .toArray();
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка сервера: " + error.message });
  }
});

app.listen(port, () => {
  console.log(
    `Сервер запущено! Відкрийте http://localhost:${port} у браузері.`,
  );
});
