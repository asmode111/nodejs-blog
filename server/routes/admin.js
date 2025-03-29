const express = require('express');
const router = express.Router();
const Post = require('../model/Post');
const User = require('../model/User');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch(error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

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
    const user = await User.findOne( { username: username } );
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await brcypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: User.id }, jwtSecret);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

router.get('/dashboard', authMiddleware, async (req, res) => {

  try {
    const locals = {
      title: "Dashboard",
      description: "Simple blog created with Nodejs"
    };
  
    const data = await Post.find();
  
    res.render('admin/dashboard', {
      locals,
      data,
      layout: adminLayout
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/register', async (req, res) => {
  try {

    const { username, password } = req.body;
    const hashedPassword = await brcypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword
    })

    res.status(201).json({ message: "User created.", user });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ message: 'User already in use' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/add-post', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add post",
      description: "Simple blog created with Nodejs"
    };

    res.render('admin/add-post', {
      locals,
      layout: adminLayout
    })
  } catch(error) {
    console.log(error);
  }
});

router.post('/add-post', authMiddleware, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body
    });

    await Post.create(newPost);

    res.redirect('/dashboard');
  } catch(error) {
    console.log(error);
  }
});

router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit post",
      description: "Simple blog created with Nodejs"
    };

    const data = await Post.findOne({
      _id: req.params.id
    });

    if (!data) {
      res.status(404).json({ message: 'Post not found' });
    }

    res.render('admin/edit-post', {
      data,
      locals,
      layout: adminLayout
    });

  } catch(error) {
    console.log(error);
  }
});

router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {

    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    });

    res.redirect(`/edit-post/${req.params.id}`);

  } catch (error) {
    console.log(error);
  }

});

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

  try {
    await Post.deleteOne({ _id: req.params.id });

    res.redirect('/dashboard');
  } catch(error) {
    console.log(error);
  }
});

router.get('/logout', authMiddleware, (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;