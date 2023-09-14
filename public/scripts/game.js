const GAME_STATUS = {
  "setup": "setup",
  "place-tile": "'s turn.",
  "tile-placed": " placed a tile.",
};

const getInfoIcon = () => document.querySelector("#info-icon");
const getInfoCard = () => document.querySelector("#info-card");
const getInfoCloseBtn = () => document.querySelector("#info-close-btn");
const getPlayersDiv = () => document.querySelector("#players");
const getDisplayPannel = () => document.querySelector("#display-pannel");

const displayAccountBalance = balance => {
  const balanceContainer = document.querySelector("#balance-container");
  balanceContainer.innerText = "$" + balance;
};

const displayInitialMessages = (setupTiles) => {
  const messages = setupTiles.map(([name, { position }]) => {
    const columnSpecification = position.y + 1;
    const rowSpecification = String.fromCharCode(position.x + 65);
    const tile = columnSpecification + rowSpecification;

    return `${tile} was placed for ${name}.`;
  }).join("\n");

  getDisplayPannel().innerText = messages;
};

const displayAccountStocks = stocks => {
  const accountStocks = {
    "phoenix": "phoenix-stock",
    "quantum": "quantum-stock",
    "hydra": "hydra-stock",
    "fusion": "fusion-stock",
    "america": "america-stock",
    "sackson": "sackson-stock",
    "zeta": "zeta-stock",
  };

  Object.entries(stocks).forEach(([corporation, quantity]) => {
    const stocks = document.getElementById(accountStocks[corporation]);
    const [quantityElement] = [...stocks.children];
    quantityElement.innerText = quantity;
  });
};

const fillSpace = position => {
  const tileId = position.x * 12 + position.y;
  const tiles = document.querySelectorAll(".space");
  tiles[tileId].classList.add("placed-tile");
};

const displayResponse = ({ message }) => {
  const displayPannel = getDisplayPannel();
  displayPannel.innerText = message;
};

const setUpTiles = ({ position }) => {
  fetch("/game/tile", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(position),
  }).then(res => {
    if (res.status === 200) {
      fillSpace(position);
    }
  });
};

const displayTile = (tileElement, position) => {
  const { x, y } = position;
  const columnSpecification = y + 1;
  const rowSpecification = String.fromCharCode(x + 65);
  tileElement.innerText = columnSpecification + rowSpecification;
};

const attatchListener = (tileElement, tile) => {
  tileElement.onclick = () => {
    tileElement.classList.add("used-tile");
    setUpTiles(tile);
  };
};

const addVisualAttribute = (tileElement, isPlaced) => {
  if (isPlaced) tileElement.classList.add("used-tile");
};

const displayAndSetupAccountTiles = tiles => {
  const tileContainer = document.querySelector("#tile-container");
  const tileElements = Array.from(tileContainer.children);

  tileElements.forEach(tileElement => (tileElement.innerText = ""));
  tiles.forEach(({ position, isPlaced }, tileID) => {
    const tileElement = tileElements[tileID];

    displayTile(tileElement, position);
    addVisualAttribute(tileElement, isPlaced);
    attatchListener(tileElement, { position, isPlaced });
  });
};

const setupInfoCard = () => {
  const infoIcon = getInfoIcon();
  const infoCard = getInfoCard();
  const infoCloseBtn = getInfoCloseBtn();

  infoIcon.onclick = () => {
    infoCard.classList.remove("hide");
  };

  infoCloseBtn.onclick = () => {
    infoCard.classList.add("hide");
  };
};

const displayPlayerName = username => {
  const usernameContainer = document.querySelector("#username");
  usernameContainer.innerText = username.toUpperCase();
};

const displayPlayerProfile = ({ balance, stocks, tiles }) => {
  displayAccountBalance(balance);
  displayAccountStocks(stocks);
  displayAndSetupAccountTiles(tiles);
};

const displayIncorporatedTiles = ({ incorporatedTiles }) => {
  incorporatedTiles.forEach(({ position }) => fillSpace(position));
};

const renderPlayers = players => {
  const playersDiv = getPlayersDiv();
  const playerElements = players.map(({ isTakingTurn, username, you }) => {
    const activeClass = isTakingTurn ? " active" : "";
    const selfClass = you ? " self" : "";

    return generateComponent([
      "div",
      [
        ["div", "", { class: "profile-pic" }],
        ["div", username, { class: "name" }],
      ],
      {
        class: `player flex ${activeClass} ${selfClass}`,
      },
    ]);
  });

  [...playersDiv.children].forEach(child => child.remove());
  playersDiv.append(...playerElements);
};

const displayMessage = state => {
  const displayPannel = getDisplayPannel();
  const message = {
    "place-tile": "Place a tile...",
    "tile-placed": "You placed a tile.",
  };

  displayPannel.innerText = message[state];
};

const isSamePlayer = (self, currentPlayer) =>
  self.username === currentPlayer.username;

const determineDisplayName = (self, currentPlayer) => {
  if (!isSamePlayer(self, currentPlayer)) {
    return currentPlayer.username;
  }
};

const customizeActivityMessage = (self, currentPlayer, state) => {
  const displayName = determineDisplayName(self, currentPlayer);

  if (isSamePlayer(self, currentPlayer)) {
    return displayMessage(state);
  }

  const message = `${displayName}${GAME_STATUS[state]}`;
  const displayPannel = getDisplayPannel();
  displayPannel.innerText = message;
};

const renderActivityMessage = (state, players) => {
  if (state === GAME_STATUS.setup) return;
  const self = players.find(({ you }) => you);
  const currentPlayer = players.find(({ isTakingTurn }) => isTakingTurn);

  players.forEach(() => customizeActivityMessage(self, currentPlayer, state));
};

const setupGame = () => {
  fetch("/game/status")
    .then(res => res.json())
    .then(({ players, portfolio, tiles, state, setupTiles }) => {
      renderPlayers(players);
      displayPlayerProfile(portfolio);
      displayIncorporatedTiles(tiles);
      state === GAME_STATUS.setup && displayInitialMessages(setupTiles);
    });

  setupInfoCard();
};

const loadAccount = () => {
  fetch("/game/status")
    .then(res => res.json())
    .then(({ players, portfolio, tiles, state, setupTiles }) => {
      renderPlayers(players);
      displayPlayerProfile(portfolio);
      displayIncorporatedTiles(tiles);
      renderActivityMessage(state, players);
    });

  setupInfoCard();
};

const keepPlayerProfileUpdated = () => {
  const interval = 1000;
  setupGame();
  setTimeout(() => {
    setInterval(loadAccount, interval);
  }, interval * 10);
};

window.onload = keepPlayerProfileUpdated;
