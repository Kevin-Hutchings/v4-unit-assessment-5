const bcrypt = require('bcryptjs');

const register = async (req, res) => {
   const { username, password } = req.body;
   const profile_pic = `https://robohash.org/${username}.png`;
   const db = req.app.get('db');
   const result = await db.find_user_by_username([username]);
   const existingUser = result[0];

   if(existingUser) {
      res.status(409).json('Username taken')
   } else {
      const hash = bcrypt.hashSync(password);
      const registeredUser = await db.create_user([username, hash, profile_pic]);
      const user = registeredUser[0];
      req.session.user = {
         username: user.username,
         profile_pic: user.profile_pic,
         id: user.id
      }
      res.status(201).json(req.session.user);
   }
};

const login = async (req, res) => {
   const { username, password } = req.body;
   const db = req.app.get('db');
   const foundUser = await db.find_user_by_username([username]);
   const user = foundUser[0];

   if(!user) {
      res.status(401).json('User not found')
   } else {
      const isAuthenticated = bcrypt.compareSync(password, user.hash);
      if(!isAuthenticated) {
         res.status(403).json('Incorrect password');
      } else {
         req.session.user = {
            username: user.username,
            id: user.id,
         }
         res.status(200).json(req.session.user);
      }
   }
};

const logout = (req, res) => {
   req.session.destory();
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