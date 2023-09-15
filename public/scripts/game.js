const GAME_STATUS = {
  "setup": "setup",
  "place-tile": "'s turn.",
  "tile-placed": " placed a tile.",
};

const CORPORATIONS_IDS = {
  "phoenix": "phoenix",
  "quantum": "quantum",
  "hydra": "hydra",
  "fusion": "fusion",
  "america": "america",
  "sackson": "sackson",
  "zeta": "zeta",
};

const getCorporation = id => document.getElementById(id);
const getBoard = () => document.querySelectorAll(".space");
const getInfoIcon = () => document.querySelector("#info-icon");
const getInfoCard = () => document.querySelector("#info-card");
const getInfoCloseBtn = () => document.querySelector("#info-close-btn");
const getPlayersDiv = () => document.querySelector("#players");
const getDisplayPanel = () => document.querySelector("#display-panel");
const getTileContainer = () => document.querySelector("#tile-container");
const getTileElements = () => {
  const tileContainer = getTileContainer();
  return Array.from(tileContainer.children);
};

const displayAccountBalance = balance => {
  const balanceContainer = document.querySelector("#balance-container");
  balanceContainer.innerText = "$" + balance;
};

const placeNewTile = tileElements => {
  tileElements.forEach(tileElement => {
    tileElement.classList.remove("used-tile");
  });
};

const removeHighlight = tileElements => {
  tileElements.forEach(tileElement =>
    tileElement.classList.remove("highlight")
  );
};

const refillTile = () => {
  const transitionDelay = 1000;
  fetch("/game/end-turn", { method: "POST" }).then(() => {
    const tileElements = getTileElements();
    placeNewTile(tileElements);
    setTimeout(() => removeHighlight(tileElements), transitionDelay);
  });
};

const displayInitialMessages = setupTiles => {
  if (!setupTiles) return;

  const messages = setupTiles
    .map(([name, { position }]) => {
      const columnSpecification = position.y + 1;
      const rowSpecification = String.fromCharCode(position.x + 65);
      const tile = columnSpecification + rowSpecification;

      return `${tile} was placed for ${name}.`;
    })
    .join("\n");

  getDisplayPanel().innerText = messages;
};

const renderCorporations = corporations => {
  Object.entries(corporations).forEach(([name, stats]) => {
    const corporation = getCorporation(name);

    corporation.querySelector(".price").innerText = `$${stats.price}`;
    corporation.querySelector(".size").innerText = stats.tiles.length;
    corporation.querySelector(".stocks").innerText = stats.stocks;
    stats.tiles.forEach(({ position }) => fillSpace(position, name));
  });
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

const fillSpace = (position, corpClass = "placed-tile") => {
  const board = getBoard();
  const tileId = position.x * 12 + position.y;
  board[tileId].classList.add(corpClass);
};

const displayResponse = ({ message }) => {
  const displayPanel = getDisplayPanel();
  displayPanel.innerText = message;
};

const disablePlayerTiles = () => {
  const tileContainer = getTileContainer();
  tileContainer.classList.add("disable-click");
};

const setUpTiles = ({ position }) => {
  fetch("/game/tile", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(position),
  })
    .then(res => {
      if (res.status === 200) {
        fillSpace(position);
      }
    })
    .then(disablePlayerTiles);
};

const displayTile = (tileElement, position) => {
  const { x, y } = position;
  const columnSpecification = y + 1;
  const rowSpecification = String.fromCharCode(x + 65);
  tileElement.innerText = columnSpecification + rowSpecification;
};

const attachListener = (tileElement, tile) => {
  tileElement.onclick = () => {
    tileElement.classList.add("used-tile");
    setUpTiles(tile);
  };
};

const addVisualAttribute = (tileElement, isPlaced) => {
  if (isPlaced) tileElement.classList.add("used-tile");
};

const isSameTile = (tile1, tile2) =>
  tile1.position.x === tile2.position.x &&
  tile1.position.y === tile2.position.y;

const highlightTile = (tile, tileToHighlight, tileElement) => {
  if (isSameTile(tile, tileToHighlight)) {
    tileElement.classList.add("highlight");
  }
};

const displayAndSetupAccountTiles = (newTile, tiles, players) => {
  const tileToHighlight = newTile || { position: {} };
  const tileElements = getTileElements();

  tiles.forEach((tile, tileID) => {
    const tileElement = tileElements[tileID];
    displayTile(tileElement, tile.position);
    addVisualAttribute(tileElement, tile.isPlaced);
    attachListener(tileElement, tile);
    highlightTile(tile, tileToHighlight, tileElement);
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

const displayPlayerProfile = ({ balance, stocks, tiles, newTile }, players) => {
  displayAccountBalance(balance);
  displayAccountStocks(stocks);
  displayAndSetupAccountTiles(newTile, tiles, players);
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

const generaterefillTileBtn = () => {
  const refillTileMessageElement = generateComponent(["p", "Refill you tile"]);
  const endButton = generateComponent([
    "button",
    "Refill",
    { type: "button", onclick: "refillTile()" },
  ]);
  return [refillTileMessageElement, endButton];
};

const displayMessage = state => {
  const displayPanel = getDisplayPanel();
  const renderMessage = {
    "place-tile": () => {
      displayPanel.innerText = "Place a tile...";
    },

    "tile-placed": () => {
      displayPanel.innerHTML = "";
      displayPanel.append(...generaterefillTileBtn());
    },
  };

  renderMessage[state]();
};

const isSamePlayer = (self, currentPlayer) =>
  self.username === currentPlayer.username;

const determineDisplayName = (self, currentPlayer) =>
  isSamePlayer(self, currentPlayer) ? "You" : currentPlayer.username;

const customizeActivityMessage = (self, currentPlayer, state) => {
  const displayName = determineDisplayName(self, currentPlayer);

  if (isSamePlayer(self, currentPlayer)) {
    return displayMessage(state);
  }

  const message = `${displayName}${GAME_STATUS[state]}`;
  const displayPanel = getDisplayPanel();
  displayPanel.innerText = message;
};

const renderActivityMessage = (state, players) => {
  if (state === GAME_STATUS.setup) return;
  const self = players.find(({ you }) => you);
  const currentPlayer = players.find(({ isTakingTurn }) => isTakingTurn);
  customizeActivityMessage(self, currentPlayer, state);
};

const setUpPlayerTilePlacing = (players, state) => {
  const self = players.find(({ you }) => you);
  const currentPlayer = players.find(({ isTakingTurn }) => isTakingTurn);

  const tileContainer = getTileContainer();

  if (isSamePlayer(self, currentPlayer) && state === "place-tile") {
    return tileContainer.classList.remove("disable-click");
  }

  tileContainer.classList.add("disable-click");
};

const setupGame = () => {
  fetch("/game/status")
    .then(res => res.json())
    .then(({ players, portfolio, tiles, setupTiles, corporations }) => {
      renderPlayers(players);
      displayPlayerProfile(portfolio);
      displayIncorporatedTiles(tiles);
      displayInitialMessages(setupTiles);
      renderCorporations(corporations);
    });

  setupInfoCard();
};

const loadAccount = () => {
  fetch("/game/status")
    .then(res => res.json())
    .then(({ players, portfolio, tiles, state, corporations }) => {
      renderPlayers(players);
      displayPlayerProfile(portfolio, players);
      displayIncorporatedTiles(tiles);
      renderActivityMessage(state, players);
      setUpPlayerTilePlacing(players, state);
      renderCorporations(corporations);
    });

  setupInfoCard();
};

const keepPlayerProfileUpdated = () => {
  const interval = 1000;
  setupGame();
  setTimeout(() => {
    setInterval(loadAccount, interval);
  }, interval * 0);
};

window.onload = keepPlayerProfileUpdated;
