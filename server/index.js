require('dotenv').config();
const massive = require('massive');
const express = require('express');
const session = require('express-session');
const {
   register,
   login,
   getUser,
   logout,
} = require('./controllers/user');
// const postCtrl = require('./controllers/posts')

const { CONNECTION_STRING, SERVER_PORT, SESSION_SECRET } = process.env;

const app = express();

app.use(express.json());
app.use(
   session({
      resave: true,
      saveUninitialized: false,
      secret: SESSION_SECRET,
      cookie: {
         maxAge: 2592000000
      },
   })
);

massive({
   connectionString: CONNECTION_STRING,
   ssl: { rejectUnauthorized: false }
})
.then(dbInstance => {
   app.set('db', dbInstance);
   console.log('Database connection successful!');
})
.catch(err => console.log(err));

// //Auth Endpoints
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', getUser);
app.post('/api/auth/logout', logout);

//Post Endpoints
// app.get('/api/posts', postCtrl.readPosts);
// app.post('/api/post', postCtrl.createPost);
// app.get('/api/post/:id', postCtrl.readPost);
// app.delete('/api/post/:id', postCtrl.deletePost)

app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`));