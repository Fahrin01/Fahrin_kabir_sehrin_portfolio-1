var token = localStorage.getItem('token');
if (token == null) {
  window.location.href = 'login.html';
}

function goToLogin() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

document.getElementById('logout-btn').addEventListener('click', function () {
  fetch('/api/logout', {
    method: 'POST',
    headers: { 'Authorization': token }
  })
    .then(function () {
      goToLogin();
    })
    .catch(function () {
      goToLogin();
    });
});

var allProjects = [];

function loadProjects() {
  fetch('/api/projects')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      allProjects = data;

      var list = document.getElementById('project-list');
      list.innerHTML = '';

      if (data.length == 0) {
        list.innerHTML = '<p class="empty-text">No projects yet.</p>';
        return;
      }

      for (var i = 0; i < data.length; i++) {
        var p = data[i];

        var card = document.createElement('div');
        card.className = 'card project';
        if (p.featured == 1) {
          card.className = 'card project featured';
        }

        var title = document.createElement('h3');
        title.innerText = p.title;
        card.appendChild(title);

        var description = document.createElement('p');
        description.innerText = p.description;
        card.appendChild(description);

        var tagArray = [];
        if (p.tags != null) {
          tagArray = p.tags.split(',');
        }
        for (var j = 0; j < tagArray.length; j++) {
          var oneTag = tagArray[j].trim();
          if (oneTag != '') {
            var tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerText = oneTag;
            card.appendChild(tag);
          }
        }

        var buttons = document.createElement('div');
        buttons.className = 'card-buttons';

        var editButton = document.createElement('button');
        editButton.className = 'small-btn';
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', 'editProject(' + p.id + ')');
        buttons.appendChild(editButton);

        var deleteButton = document.createElement('button');
        deleteButton.className = 'small-btn delete-btn';
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', 'deleteProject(' + p.id + ')');
        buttons.appendChild(deleteButton);

        card.appendChild(buttons);

        list.appendChild(card);
      }
    })
    .catch(function () {
      document.getElementById('project-list').innerHTML =
        '<p class="empty-text">Could not load projects. Is the server running?</p>';
    });
}

function editProject(id) {
  for (var i = 0; i < allProjects.length; i++) {
    if (allProjects[i].id == id) {
      var p = allProjects[i];

      document.getElementById('project-id').value = p.id;
      document.getElementById('project-title').value = p.title;
      document.getElementById('project-description').value = p.description;
      if (p.tags != null) {
        document.getElementById('project-tags').value = p.tags;
      } else {
        document.getElementById('project-tags').value = '';
      }
      document.getElementById('project-featured').checked = (p.featured == 1);

      document.getElementById('project-form-title').innerText = 'Edit project';
      document.getElementById('project-save').innerText = 'Update project';
      document.getElementById('project-form').scrollIntoView();
    }
  }
}

function clearProjectForm() {
  document.getElementById('project-id').value = '';
  document.getElementById('project-title').value = '';
  document.getElementById('project-description').value = '';
  document.getElementById('project-tags').value = '';
  document.getElementById('project-featured').checked = false;

  document.getElementById('project-form-title').innerText = 'Add a project';
  document.getElementById('project-save').innerText = 'Add project';
}

document.getElementById('project-clear').addEventListener('click', clearProjectForm);

document.getElementById('project-form').addEventListener('submit', function (event) {
  event.preventDefault();

  var id = document.getElementById('project-id').value;
  var title = document.getElementById('project-title').value;
  var description = document.getElementById('project-description').value;
  var tags = document.getElementById('project-tags').value;
  var featured = 0;
  if (document.getElementById('project-featured').checked) {
    featured = 1;
  }

  if (title.trim() == '') {
    alert('Please write the project title');
    return;
  }
  if (title.length > 100) {
    alert('Project title must be 100 characters or less');
    return;
  }
  if (tags.length > 255) {
    alert('Tags must be 255 characters or less');
    return;
  }

  var data = {
    title: title,
    description: description,
    tags: tags,
    featured: featured
  };

  var url = '/api/projects';
  var method = 'POST';
  if (id != '') {
    url = '/api/projects/' + id;
    method = 'PUT';
  }

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json', 'Authorization': token },
    body: JSON.stringify(data)
  })
    .then(function (res) {
      if (res.status == 401) {
        goToLogin();
      }
      return res.json();
    })
    .then(function (result) {
      if (result.error) {
        alert(result.error);
        return;
      }
      clearProjectForm();
      loadProjects();
    });
});

function deleteProject(id) {
  var sure = confirm('Do you want to delete this project?');
  if (sure == false) {
    return;
  }

  fetch('/api/projects/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': token }
  })
    .then(function (res) {
      if (res.status == 401) {
        goToLogin();
      }
      return res.json();
    })
    .then(function (result) {
      if (result.error) {
        alert(result.error);
        return;
      }
      loadProjects();
    });
}

var allSkills = [];

function loadSkills() {
  fetch('/api/skills')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      allSkills = data;

      var list = document.getElementById('skill-list');
      list.innerHTML = '';

      if (data.length == 0) {
        list.innerHTML = '<p class="empty-text">No skills yet.</p>';
        return;
      }

      var groups = {};
      var categoryNames = [];

      for (var i = 0; i < data.length; i++) {
        var s = data[i];
        if (groups[s.category] == undefined) {
          groups[s.category] = [];
          categoryNames.push(s.category);
        }
        groups[s.category].push(s);
      }

      for (var c = 0; c < categoryNames.length; c++) {
        var name = categoryNames[c];

        var card = document.createElement('div');
        card.className = 'card';

        var title = document.createElement('h3');
        title.innerText = name;
        card.appendChild(title);

        for (var k = 0; k < groups[name].length; k++) {
          var skill = groups[name][k];

          var tag = document.createElement('span');
          tag.className = 'tag';
          tag.innerText = skill.name;

          var editButton = document.createElement('button');
          editButton.className = 'small-btn';
          editButton.innerText = 'edit';
          editButton.setAttribute('onclick', 'editSkill(' + skill.id + ')');
          tag.appendChild(editButton);

          var deleteButton = document.createElement('button');
          deleteButton.className = 'small-btn delete-btn';
          deleteButton.innerText = 'x';
          deleteButton.setAttribute('onclick', 'deleteSkill(' + skill.id + ')');
          tag.appendChild(deleteButton);

          card.appendChild(tag);
        }

        list.appendChild(card);
      }
    })
    .catch(function () {
      document.getElementById('skill-list').innerHTML =
        '<p class="empty-text">Could not load skills. Is the server running?</p>';
    });
}

function editSkill(id) {
  for (var i = 0; i < allSkills.length; i++) {
    if (allSkills[i].id == id) {
      var s = allSkills[i];

      document.getElementById('skill-id').value = s.id;
      document.getElementById('skill-category').value = s.category;
      document.getElementById('skill-name').value = s.name;

      document.getElementById('skill-form-title').innerText = 'Edit skill';
      document.getElementById('skill-save').innerText = 'Update skill';
      document.getElementById('skill-form').scrollIntoView();
    }
  }
}

function clearSkillForm() {
  document.getElementById('skill-id').value = '';
  document.getElementById('skill-category').selectedIndex = 0;
  document.getElementById('skill-name').value = '';

  document.getElementById('skill-form-title').innerText = 'Add a skill';
  document.getElementById('skill-save').innerText = 'Add skill';
}

document.getElementById('skill-clear').addEventListener('click', clearSkillForm);

document.getElementById('skill-form').addEventListener('submit', function (event) {
  event.preventDefault();

  var id = document.getElementById('skill-id').value;
  var category = document.getElementById('skill-category').value;
  var name = document.getElementById('skill-name').value;

  if (name.trim() == '') {
    alert('Please write the skill name');
    return;
  }
  if (name.length > 50) {
    alert('Skill name must be 50 characters or less');
    return;
  }

  var data = {
    category: category,
    name: name
  };

  var url = '/api/skills';
  var method = 'POST';
  if (id != '') {
    url = '/api/skills/' + id;
    method = 'PUT';
  }

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json', 'Authorization': token },
    body: JSON.stringify(data)
  })
    .then(function (res) {
      if (res.status == 401) {
        goToLogin();
      }
      return res.json();
    })
    .then(function (result) {
      if (result.error) {
        alert(result.error);
        return;
      }
      clearSkillForm();
      loadSkills();
    });
});

function deleteSkill(id) {
  var sure = confirm('Do you want to delete this skill?');
  if (sure == false) {
    return;
  }

  fetch('/api/skills/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': token }
  })
    .then(function (res) {
      if (res.status == 401) {
        goToLogin();
      }
      return res.json();
    })
    .then(function (result) {
      if (result.error) {
        alert(result.error);
        return;
      }
      loadSkills();
    });
}

var allCerts = [];
function loadCerts() {
  fetch('/api/certifications')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      allCerts = data;

      var list = document.getElementById('cert-list');
      list.innerHTML = '';

      if (data.length == 0) {
        list.innerHTML = '<li class="empty-text">No certifications yet.</li>';
        return;
      }

      for (var i = 0; i < data.length; i++) {
        var c = data[i];

        var item = document.createElement('li');

        var bold = document.createElement('b');
        bold.innerText = c.name;
        item.appendChild(bold);
        item.appendChild(document.createTextNode(' '));

        var editButton = document.createElement('button');
        editButton.className = 'small-btn';
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', 'editCert(' + c.id + ')');
        item.appendChild(editButton);

        var deleteButton = document.createElement('button');
        deleteButton.className = 'small-btn delete-btn';
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', 'deleteCert(' + c.id + ')');
        item.appendChild(deleteButton);

        list.appendChild(item);
      }
    })
    .catch(function () {
      document.getElementById('cert-list').innerHTML =
        '<li class="empty-text">Could not load certifications. Is the server running?</li>';
    });
}

function editCert(id) {
  for (var i = 0; i < allCerts.length; i++) {
    if (allCerts[i].id == id) {
      var c = allCerts[i];

      document.getElementById('cert-id').value = c.id;
      document.getElementById('cert-name').value = c.name;

      document.getElementById('cert-form-title').innerText = 'Edit certification';
      document.getElementById('cert-save').innerText = 'Update certification';
      document.getElementById('cert-form').scrollIntoView();
    }
  }
}

function clearCertForm() {
  document.getElementById('cert-id').value = '';
  document.getElementById('cert-name').value = '';

  document.getElementById('cert-form-title').innerText = 'Add a certification';
  document.getElementById('cert-save').innerText = 'Add certification';
}

document.getElementById('cert-clear').addEventListener('click', clearCertForm);

document.getElementById('cert-form').addEventListener('submit', function (event) {
  event.preventDefault();

  var id = document.getElementById('cert-id').value;
  var name = document.getElementById('cert-name').value;

  if (name.trim() == '') {
    alert('Please write the certification name');
    return;
  }
  if (name.length > 200) {
    alert('Certification name must be 200 characters or less');
    return;
  }

  var data = {
    name: name
  };

  var url = '/api/certifications';
  var method = 'POST';
  if (id != '') {
    url = '/api/certifications/' + id;
    method = 'PUT';
  }

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json', 'Authorization': token },
    body: JSON.stringify(data)
  })
    .then(function (res) {
      if (res.status == 401) {
        goToLogin();
      }
      return res.json();
    })
    .then(function (result) {
      if (result.error) {
        alert(result.error);
        return;
      }
      clearCertForm();
      loadCerts();
    });
});

function deleteCert(id) {
  var sure = confirm('Do you want to delete this certification?');
  if (sure == false) {
    return;
  }

  fetch('/api/certifications/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': token }
  })
    .then(function (res) {
      if (res.status == 401) {
        goToLogin();
      }
      return res.json();
    })
    .then(function (result) {
      if (result.error) {
        alert(result.error);
        return;
      }
      loadCerts();
    });
}

loadProjects();
loadSkills();
loadCerts();
