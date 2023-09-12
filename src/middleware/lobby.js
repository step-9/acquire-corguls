const authorizeLobbyMember = (req, res, next) => {
  const { players } = req.context.lobby.status();
  const { username } = req.cookies;
  const isUser = player => player.username === username;

  if (!players.find(isUser)) {
    res.status(400).end();
    return;
  }

  next();
};

module.exports = { authorizeLobbyMember };
