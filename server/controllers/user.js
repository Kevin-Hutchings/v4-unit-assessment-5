const bcrypt = require('bcryptjs');

const register = async (req, res) => {
   const { username, password } = req.body;
   const profilePic = `https://robohash.org/${username}.png`;
   const db = req.app.get('db');
   const result = await db.user.find_user_by_username([username]);
   const existingUser = result[0];

   if(existingUser) {
      res.status(409).json('Username taken')
   } else {
      const hash = bcrypt.hashSync(password);
      const registeredUser = await db.user.create_user([username, hash, profilePic]);
      const user = registeredUser[0];
      req.session.user = {
         username: user.username,
         profilePic: user.profile_pic,
         id: user.id
      }
      res.status(201).json(req.session.user);
   }
};

const login = async (req, res) => {
   const { username, password } = req.body;
   const db = req.app.get('db');
   const foundUser = await db.user.find_user_by_username(username);
   const user = foundUser[0];

   if(!user) {
      res.status(401).json('User not found')
   } else {
      const isAuthenticated = bcrypt.compareSync(password, user.password);
      if(!isAuthenticated) {
         res.status(403).json('Incorrect password');
      } else {
         req.session.user = {
            username: user.username,
            profilePic: user.profile_pic,
            id: user.id,
         }
         res.send(req.session.user);
      }
   }
};

const logout = (req, res) => {
   req.session.destroy();
   res.sendStatus(200);
};

const getUser = (req, res) => {
   var user = req.session.user;

   if(user) {
      res.status(200).json(user)
   } else {
      res.sendStatus(404)
   }
}

module.exports = {
   register,
   login,
   logout,
   getUser
};