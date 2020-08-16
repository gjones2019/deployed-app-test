const { Router } = require('express');
const router = Router();
const {
    Playlist,
    PlaylistSong,
    User,
    Song,
  } = require('../db/database.js');

//Login
  // Look up user by email
  // If no user, then create one
  // Look up (findOne) playlist id with user id (user.id)
  // Look up (findAll) songIDs with playlistID
  // Look up (findAll) songs with songID
  // Send the user back to the client
router.post('/login', async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } })

  if (user === null) {
    await User.create(req.body)
      .then((dbResponse) => {
        res.send({ user: dbResponse });
      })
  } else {
    const playlist = await Playlist.findOne({ where: { userId: user.id } })
    if (playlist) {
      const playlistSongs = await PlaylistSong.findAll({ where: { playlistId: playlist.id }, raw: true })
      if (playlistSongs) {
        // Look up (findAll) songs with songID
        const songs = playlistSongs.map(song => {
          return Song.findByPk(song.songId, { raw: true });
        })

        await Promise.all(songs).then(mapped => res.send({ user, songs: mapped }));
        return;
      }
    }
    res.send({ user });
  }
});

// Update votes
  // Look up song by title and playlist by songId
  // Update the votes of the playlist song
  // Update playlist song vote count
  router.put('/vote', async (req, res) => {
    console.log(req.body)
    const song = await Song.findOne({ where: { title: req.body.title } })
    const playlist_song = await PlaylistSong.findOne({ where: { songId: song.id } })
    PlaylistSong.update({ vote: playlist_song.vote + 1 },
      { where: { songId: song.id }
    })
    .then(async () => {
      const updated_playlist_song = await PlaylistSong.findOne({ where: { songId: song.id } })
      const all_playlist_songs = await PlaylistSong.findAll({}, {raw: true})
      const highest = await all_playlist_songs.reduce((acc, val) => {
        if (val.vote > acc.vote) return val
        return acc
      }, {vote: 0})
      const highestVote = await Song.findOne({ where: { id: highest.id } })
      res.send({ newVoteCount: updated_playlist_song.vote, highestVote })
    })
});

// Create host
  // Update the user
router.post('/host', async (req, res) => {
  User.update({host: req.body.host}, {
      where: {
      firstName: req.body.firstName
    }
  });
});

// Playlist creation
  // Look for song in the db
  // Create entry if its not there
  // Save the song the db generated
  // Look for existing playlist for current user
  // Create playlist if user doesn't have one
  // Save the playlist ID generated by the db
  // Tell client if song was already in the database
router.post('/playlist/:user', async (req, res) => {
  const userId = req.params.user;

  let song = await Song.findOne({ where: { url: req.body.url } })
  let alreadyExists = false;

  if (song === null) {
    await Song.create(req.body)
      .then(({ dataValues }) => {
        song = dataValues;
      })
  } else {
    alreadyExists = true;
  }

  let playlist = await Playlist.findOne({ where: { userId } })
  
  if (playlist === null) {
    await Playlist.create({ userId })
      .then(({ dataValues }) => {
        playlist = dataValues;
      })
  };

  let playlist_song = await PlaylistSong.findOne({ where: { playlistId: playlist.id, songId: song.id } });

  if (playlist_song === null) {
    PlaylistSong.create({ playlistId: playlist.id, songId: song.id });
  };


  res.send(alreadyExists);

  console.log('playlistId', playlist.id)
  console.log('songId', song.id)
});

module.exports = {
	router,
};
