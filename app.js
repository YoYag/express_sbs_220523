import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const pool = mysql.createPool({
  host: "localhost",
  user: "sbsst",
  password: "sbs123414",
  database: "a9",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "https://cdpn.io",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const port = 3000;

// 생성POST
app.post("/todos", async (req, res) => {
  const { perform_date, is_completed, content } = req.body;

  if (!perform_date) {
    res.status(400).json({
      msg: "perform_date required",
    });
    return;
  }

  if (!is_completed) {
    res.status(400).json({
      msg: "is_completed required",
    });
    return;
  }

  if (!content) {
    res.status(400).json({
      msg: "content required",
    });
    return;
  }

  const [rows] = await pool.query(
    `
    INSERT INTO todo
    SET reg_date = NOW(),
    perform_date = ?,
    is_completed = ?,
    content = ?;
    `,
    [perform_date, is_completed, content]
  );

  res.json({
    msg: `할 일이 생성되었습니다.`,
  });
});

// 조회GET
app.get("/todos", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM todo ORDER BY id DESC");

  res.json(rows);
});

// 단건조회GET
app.get("/todos/:id", async (req, res) => {
  // const id = req.params.id;
  const { id } = req.params;

  const [rows] = await pool.query(
    `
    SELECT * 
    FROM todo 
    WHERE id = ?
    `,
    [id]
  ); // `쿼리문` 엔터 사용가능

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }

  res.json(rows[0]);
});

// 수정PATCH
app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    `
    SELECT * 
    FROM todo 
    WHERE id = ?
    `,
    [id]
  );

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }

  const { perform_date, is_completed, content } = req.body;

  if (!perform_date) {
    res.status(400).json({
      msg: "perform_date required",
    });
    return;
  }

  if (!is_completed) {
    res.status(400).json({
      msg: "is_completed required",
    });
    return;
  }

  if (!content) {
    res.status(400).json({
      msg: "content required",
    });
    return;
  }

  const [rs] = await pool.query(
    `
    UPDATE todo
    SET reg_date = NOW(),
    perform_date = ?,
    is_completed = ?,
    content = ?
    WHERE id = ?
    `,
    [perform_date, is_completed, content, id]
  );

  res.json({
    msg: `${id}번 할 일이 수정되었습니다.`,
  });
});

// 삭제DELETE
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    `
    DELETE FROM todo 
    WHERE id = ?
    `,
    [id]
  );

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
