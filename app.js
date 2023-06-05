const a = require("express");
const e = a();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;
e.use(a.json());
const dbpath = path.join(__dirname, "todoApplication.db");
const init = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    e.listen(3000, () => {
      console.log("server is starting ");
    });
  } catch (error) {
    console.log("hahahah");
  }
};
init();
const pr = (a) => {
  return a.priority !== undefined;
};
const s = (a) => {
  return a.status !== undefined;
};
const ps = (a) => {
  return a.status !== undefined && a.priority !== undefined;
};
const searchh = (a) => {
  return a.search !== undefined;
};

const list = (a) => {
  return {
    id: a.id,
    todo: a.todo,
    priority: a.priority,
    status: a.status,
  };
};
e.use(a.json());
e.get("/todos/", async (request, response) => {
  let data = null;
  let p = "";
  const { search_q = "", priority, status, category } = request.query;

  switch (true) {
    case ps(request.query):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        if (
          status === "TO DO" ||
          status === "IN PROCESS" ||
          status === "DONE"
        ) {
          p = `select * from todo where priority=${priority} and status=${status}`;
          q = await db.all(p);
          response.send(q.map((e) => list(e)));
        } else {
          response.status(400);
          response.send("Invalid todo status");
        }
      } else {
        response.status(400);
        response.send("Invalid todo priority");
      }

      break;

    case pr(request.query):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        p = `select * from todo where priority =${priority} `;
        q = await db.all(p);
        response.send(q.map((e) => list(e)));
      } else {
        response.status(400);
        response.send("Invalid todo priority");
      }
      break;

    case s(request.query):
      if (
        status === "TO DO " ||
        status === "IN PROGRESS" ||
        status === "DONE"
      ) {
        p = `select * from todo where status=${status}`;
        q = await db.all(p);
        response.send(q.map((e) => list(e)));
      } else {
        response.status(400);
        response.send("Invalid todo status");
      }
      break;

    case searchh(request.query):
      p = `select * from todo where todo like '%${search_q}%'`;
      q = await db.all(p);
      response.send(q.map((e) => list(e)));
      break;

    default:
      p = `select * from todo `;
      q = await db.all(p);
      response.send(q.map((e) => list(e)));
  }
});
