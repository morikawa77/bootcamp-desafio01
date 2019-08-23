const express = require("express");

const server = express();

server.use(express.json());

// const projects = [{ id: "1", title: "Novo projeto", tasks: [] }];
const projects = [];

let n_reqs = 0;

// middleware to check params
function checkReqParams(req, res, next) {
  const { id } = req.body;
  const { title } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Project id is required" });
  } else if (!title) {
    return res.status(400).json({ error: "Project title is required" });
  } else {
    return next();
  }
}

// middleware to check if project exists
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  console.log(project);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

// global middleware to write reqs counter
server.use((req, res, next) => {
  n_reqs++;
  console.log(`Número de requisições: ${n_reqs}`);
  next();
});

// return all projects
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// insert a new project
server.post("/projects", checkReqParams, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

// edit project title
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

// delete project
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

// insert task on project
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
