function loadProjects() {
  fetch('/api/projects')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
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

        list.appendChild(card);
      }
    })
    .catch(function () {
      document.getElementById('project-list').innerHTML =
        '<p class="empty-text">Could not load projects. Is the server running?</p>';
    });
}

function loadSkills() {
  fetch('/api/skills')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
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
          var tag = document.createElement('span');
          tag.className = 'tag';
          tag.innerText = groups[name][k].name;
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

function loadCerts() {
  fetch('/api/certifications')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      var list = document.getElementById('cert-list');
      list.innerHTML = '';

      if (data.length == 0) {
        list.innerHTML = '<li class="empty-text">No certifications yet.</li>';
        return;
      }

      for (var i = 0; i < data.length; i++) {
        var item = document.createElement('li');
        var bold = document.createElement('b');
        bold.innerText = data[i].name;
        item.appendChild(bold);
        list.appendChild(item);
      }
    })
    .catch(function () {
      document.getElementById('cert-list').innerHTML =
        '<li class="empty-text">Could not load certifications. Is the server running?</li>';
    });
}

loadProjects();
loadSkills();
loadCerts();
