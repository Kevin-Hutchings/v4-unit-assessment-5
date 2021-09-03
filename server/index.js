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
const {
   readPost,
   readPosts,
   createPost,
   deletePost
} = require('./controllers/posts');

const { CONNECTION_STRING, SERVER_PORT, SESSION_SECRET } = process.env;

const app = express();

app.use(express.json());
app.use(
   session({
      resave: true,
      saveUninitialized: false,
      secret: SESSION_SECRET,
      cookie: {
         maxAge: 1000 * 60 * 60 * 24 * 30  //cookie lasts for 1 month
      },
   })
);

massive({
   connectionString: CONNECTION_STRING,
   ssl: { rejectUnauthorized: false }
})
.then(dbInstance => {
   app.set('db', dbInstance);
   console.log(`Don't forget your towel`);
})
.catch(err => console.log(err));

// //Auth Endpoints
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', getUser);
app.post('/api/auth/logout', logout);

// Post Endpoints
app.get('/api/posts', readPosts);
app.post('/api/post', createPost);
app.get('/api/post/:id', readPost);
app.delete('/api/post/:id', deletePost)

app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`));