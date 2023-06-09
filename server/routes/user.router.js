const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/user', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  const user = {
    id: req.user.id, 
    username: req.user.username, 
    current_score: req.user.current_score,
    current_streak: req.user.current_streak
  }
  
  res.send(user);
});

router.get('/score', rejectUnauthenticated, async (req, res) => {
  const userID = req.user.id
  try {
    const dbRes = await pool.query(`SELECT current_score AS score, current_streak AS streak FROM "users" WHERE id = $1;`, [userID])

    res.send(dbRes.rows[0])
  } catch (error) {
    console.log("Error retrieving score in /score, user.router", error);
  }

})
// router to get the user's last ten listened to songs
router.get('/history', rejectUnauthenticated, (req, res) => {
  const userID = req.user.id;

  let sqlText = `
  SELECT songs.id AS song_id, history.id AS id, song_name, artist, album, cover_art, year_released, correctly_guessed, history.timestamp AS ts FROM "history"
      JOIN "songs"
        ON history.song_id = songs.id
      JOIN "users"
        ON history.user_id = users.id
      WHERE users.id = $1
      ORDER BY history.id DESC
      LIMIT 10;
  `;

  pool.query(sqlText, [userID])
      .then(dbRes => {
        res.send(dbRes.rows);
      }).catch(dbErr => {
        console.log("Error connecting to the DB:", dbErr);
      })
})

// this is the delete route for deleting an item from the user's history
router.delete('/delete/:id', rejectUnauthenticated, (req,res) => {

  pool.query(`DELETE FROM "history" WHERE id = $1;`, [req.params.id])
      .then(dbRes => {
        res.sendStatus(200)
      }).catch(dbErr => {
        console.log("Error deleting item from DB", dbErr);
      })
})

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = `INSERT INTO "users" (username, password)
    VALUES ($1, $2) RETURNING id`;
  pool
    .query(queryText, [username, password])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
