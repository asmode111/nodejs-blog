const express = require('express');
const router = express.Router();
const Post = require('../model/Post');
const User = require('../model/User');

const adminLayout = '../views/layouts/admin';

router.get('/admin', async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple blog created with Nodejs"
    };

    res.render('admin/index', {
      locals,
      layout: adminLayout
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/admin', async (req, res) => {
  try {

    const { username, password } = req.body;

    res.redirect('/admin');
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;