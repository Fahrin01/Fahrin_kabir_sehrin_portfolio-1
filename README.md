# Portfolio with REST API

My profile page. The data comes from a MySQL database through a REST API,
and the page is made with DOM.

Pages:
- portfolio.html - my profile page (shows projects, skills, certifications)
- login.html - admin login
- admin.html - add, edit and delete data (need login)

## How to run

1. Run server/database.sql in MySQL Workbench or phpMyAdmin.
2. Put your MySQL password in server/connection.js.
3. Open terminal in the server folder and run:

```
npm install
node server.js
```

4. Open http://localhost:5000/portfolio.html
5. For admin open http://localhost:5000/login.html
   (username: admin, password: admin123)

## API

- GET /api/projects
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id

Same for /api/skills and /api/certifications.

Login: POST /api/login, Logout: POST /api/logout
