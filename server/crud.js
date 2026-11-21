var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var db = require('./connection');

var tokens = [];

function isLoggedIn(req) {
  var token = req.headers['authorization'];
  if (token == undefined) {
    return false;
  }
  return tokens.indexOf(token) != -1;
}

function isEmpty(text) {
  if (text == undefined || String(text).trim() == '') {
    return true;
  }
  return false;
}


router.post('/api/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (isEmpty(username) || isEmpty(password)) {
    return res.status(400).json({ error: 'Please write username and password' });
  }

  var query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, password], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.length == 0) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    var token = crypto.randomBytes(16).toString('hex');
    tokens.push(token);
    console.log(username + ' logged in');
    res.json({ message: 'Login successful', token: token });
  });
});

router.post('/api/logout', function (req, res) {
  var token = req.headers['authorization'];
  var index = tokens.indexOf(token);
  if (index != -1) {
    tokens.splice(index, 1);
  }
  res.json({ message: 'Logged out' });
});


router.get('/api/projects', function (req, res) {
  var query = 'SELECT * FROM projects ORDER BY id';

  db.query(query, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(result);
  });
});

router.post('/api/projects', function (req, res) {
  if (!isLoggedIn(req)) {
    return res.status(401).json({ error: 'Please login first' });
  }

  var title = req.body.title;
  var description = req.body.description;
  var tags = req.body.tags;
  var featured = Number(req.body.featured);

  if (isEmpty(title)) {
    return res.status(400).json({ error: 'Project title is required' });
  }
  if (title.length > 100) {
    return res.status(400).json({ error: 'Project title must be 100 characters or less' });
  }
  if (description == undefined) {
    description = '';
  }
  if (tags == undefined) {
    tags = '';
  }
  if (tags.length > 255) {
    return res.status(400).json({ error: 'Tags must be 255 characters or less' });
  }
  if (featured != 1) {
    featured = 0;
  }

  var query = 'INSERT INTO projects (title, description, tags, featured) VALUES (?, ?, ?, ?)';

  db.query(query, [title, description, tags, featured], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('1 project added');
    res.json({ message: 'Project added' });
  });
});

router.put('/api/projects/:id', function (req, res) {
  if (!isLoggedIn(req)) {
    return res.status(401).json({ error: 'Please login first' });
  }

  var id = Number(req.params.id);
  var title = req.body.title;
  var description = req.body.description;
  var tags = req.body.tags;
  var featured = Number(req.body.featured);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  if (isEmpty(title)) {
    return res.status(400).json({ error: 'Project title is required' });
  }
  if (title.length > 100) {
    return res.status(400).json({ error: 'Project title must be 100 characters or less' });
  }
  if (description == undefined) {
    description = '';
  }
  if (tags == undefined) {
    tags = '';
  }
  if (tags.length > 255) {
    return res.status(400).json({ error: 'Tags must be 255 characters or less' });
  }
  if (featured != 1) {
    featured = 0;
  }

  var query = 'UPDATE projects SET title = ?, description = ?, tags = ?, featured = ? WHERE id = ?';

  db.query(query, [title, description, tags, featured, id], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('1 project updated');
    res.json({ message: 'Project updated' });
  });
});

router.delete('/api/projects/:id', function (req, res) {
  if (!isLoggedIn(req)) {
    return res.status(401).json({ error: 'Please login first' });
  }

  var id = Number(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  var query = 'DELETE FROM projects WHERE id = ?';

  db.query(query, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('1 project deleted');
    res.json({ message: 'Project deleted' });
  });
});


router.get('/api/skills', function (req, res) {
  var query = 'SELECT * FROM skills ORDER BY id';

  db.query(query, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(result);
  });
});

router.post('/api/skills', function (req, res) {
  if (!isLoggedIn(req)) {
    return res.status(401).json({ error: 'Please login first' });
  }

  var category = req.body.category;
  var name = req.body.name;

  if (isEmpty(category)) {
    return res.status(400).json({ error: 'Skill category is required' });
  }
  if (isEmpty(name)) {
    return res.status(400).json({ error: 'Skill name is required' });
  }
  if (category.length > 50 || name.length > 50) {
    return res.status(400).json({ error: 'Category and name must be 50 characters or less' });
  }

  var query = 'INSERT INTO skills (category, name) VALUES (?, ?)';

  db.query(query, [category, name], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('1 skill added');
    res.json({ message: 'Skill added' });
  });
});

router.put('/api/skills/:id', function (req, res) {
  if (!isLoggedIn(req)) {
    return res.status(401).json({ error: 'Please login first' });
  }

  var id = Number(req.params.id);
  var category = req.body.category;
  var name = req.body.name;

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  if (isEmpty(category)) {
    return res.status(400).json({ error: 'Skill category is required' });
  }
  if (isEmpty(name)) {
    return res.status(400).json({ error: 'Skill name is required' });
  }
  if (category.length > 50 || name.length > 50) {
    return res.status(400).json({ error: 'Category and name must be 50 characters or less' });
  }

  var query = 'UPDATE skills SET category = ?, name = ? WHERE id = ?';

  db.query(query, [category, name, id], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('1 skill updated');
    res.json({ message: 'Skill updated' });
  });
});

router.delete('/api/skills/:id', function (req, res) {
  if (!isLoggedIn(req)) {
    return res.status(401).json({ error: 'Please login first' });
  }

  var id = Number(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  var query = 'DELETE FROM skills WHERE id = ?';

  db.query(query, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('1 skill deleted');
    res.json({ message: 'Skill deleted' });
  });
});


router.get('/api/certifications', function (req, res) {
  var query = 'SELECT * FROM certifications ORDER BY id';

  db.query(query, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(result);
  });
});

router.post('/api/certifications', function (req, res) {
  if (!isLoggedIn(req)) {
    return res.status(401).json({ error: 'Please login first' });
  }

  var name = req.body.name;

  if (isEmpty(name)) {
    return res.status(400).json({ error: 'Certification name is required' });
  }
  if (name.length > 200) {
    return res.status(400).json({ error: 'Certification name must be 200 characters or less' });
  }

  var query = 'INSERT INTO certifications (name) VALUES (?)';

  db.query(query, [name], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('1 certification added');
    res.json({ message: 'Certification added' });
  });
});

router.put('/api/certifications/:id', function (req, res) {
  if (!isLoggedIn(req)) {
    return res.status(401).json({ error: 'Please login first' });
  }

  var id = Number(req.params.id);
  var name = req.body.name;

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  if (isEmpty(name)) {
    return res.status(400).json({ error: 'Certification name is required' });
  }
  if (name.length > 200) {
    return res.status(400).json({ error: 'Certification name must be 200 characters or less' });
  }

  var query = 'UPDATE certifications SET name = ? WHERE id = ?';

  db.query(query, [name, id], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('1 certification updated');
    res.json({ message: 'Certification updated' });
  });
});

router.delete('/api/certifications/:id', function (req, res) {
  if (!isLoggedIn(req)) {
    return res.status(401).json({ error: 'Please login first' });
  }

  var id = Number(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  var query = 'DELETE FROM certifications WHERE id = ?';

  db.query(query, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('1 certification deleted');
    res.json({ message: 'Certification deleted' });
  });
});


module.exports = router;
