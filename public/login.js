if (localStorage.getItem('token') != null) {
  window.location.href = 'admin.html';
}

document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault();

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var errorText = document.getElementById('login-error');

  if (username.trim() == '' || password.trim() == '') {
    errorText.innerText = 'Please write username and password';
    return;
  }

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, password: password })
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (result) {
      if (result.error) {
        errorText.innerText = result.error;
        return;
      }
      localStorage.setItem('token', result.token);
      window.location.href = 'admin.html';
    })
    .catch(function () {
      errorText.innerText = 'Could not connect. Is the server running?';
    });
});
