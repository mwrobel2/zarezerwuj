const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const checkAuth = require('../middleware/check-auth');

// SAVING A PROJECT
router.post('', checkAuth, (req, res, next) => {
  const projectBody = req.body;
  projectBody.addBy = {};
  projectBody.modBy = {};
  projectBody.addDate = new Date();
  projectBody.modDate = projectBody.addDate;
  projectBody.addBy.login = req.decoded.login;
  projectBody.addBy.name = req.decoded.name;
  projectBody.addBy.surname = req.decoded.surname;
  projectBody.addBy.email = req.decoded.email;
  projectBody.modBy.login = req.decoded.login;
  projectBody.modBy.name = req.decoded.name;
  projectBody.modBy.surname = req.decoded.surname;
  projectBody.modBy.email = req.decoded.email;
  if(typeof projectBody.items[0].name === 'undefined') {
    projectBody.items = [];
  }

  // we can instantiate an object from model
  // because model method from project.js gives us an constructor
  const project = new Project(projectBody);
  // zapis do bazy danych
  // nazwa kolekcji brana z modelu - (changed to lowercase and added 's') czyli projects
  project.save().then(createdProject => {
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'Project added successfully.',
      projectId: createdProject._id
    });
  });
});

// UPDATE AN OFFER
// I can use put or patch
router.put('/:id', checkAuth, (req, res, next) => {
  // I'm creating a new project object to store it in database
  const project = new Project(req.body);
  // because with new Project a new _id is crated I have to
  // set _id to the old value in other case update will fail
  project.modDate = new Date();
  project.modBy.login = req.decoded.login;
  project.modBy.name = req.decoded.name;
  project.modBy.surname = req.decoded.surname;
  project.modBy.email = req.decoded.email;
  project._id = req.params.id;
  Project.updateOne({ _id: req.params.id }, project).then(result => {
    res.status(200).json({ message: 'Project updated.' });
  });
});

// READING ALL PROJECTS
// we are adding middleware
// before (req,res,next) we can add as many filters as we want
// req is empty in get requests
router.get('', checkAuth, (req, res, next) => {
  // zwracam napis
  // res.send('Hello from express');

  projectsQuery = Project.find().sort({ "modDate": -1 });

  // I'm getting data from the database
  projectsQuery.then(documents => {
    // console.log(documents);
    //zwracam json data
    res.status(200).json({
      message: 'Projects fetched successfully',
      projects: documents
    });
  });
});

// GET SINGLE PROJECT
router.get('/:id', checkAuth, (req, res, next) => {
  Project.findById(req.params.id).then(project => {
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: 'Project not found.' });
    }
  });
});

// DELETEING AN PROJECT
router.delete('/:id', checkAuth, (req, res, next) => {
  // console.log(req.params.id);
  Project.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Project deleted' });
  });
});

module.exports = router;
