const GAME_STATUS = {
  "place-tile": "'s turn.",
  "tile-placed": " placed a tile.",
  "establish-corporation": " is establishing a corporation",
  "buy-stocks": " is buying stocks"
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

const establishCorporation = data => {
  fetch("/game/establish", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
};

const buyStocks = data => {
  fetch("/game/buy-stocks", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
};

const createMessageElements = (name, position) => {
  const columnSpecification = position.y + 1;
  const rowSpecification = String.fromCharCode(position.x + 65);
  const tile = columnSpecification + rowSpecification;

  return generateComponent(["div", `${name}: ${tile}`, { class: "messgae" }]);
};

const renderMessagePairHolder = messageElements => {
  const messagePairHolder = document.createElement("div");
  messagePairHolder.append(...messageElements);
  messagePairHolder.classList.add("message-pair-holder");
  getDisplayPanel().append(messagePairHolder);
};

const displayInitialMessages = setupTiles => {
  if (!setupTiles) return;

  const messages = setupTiles.map(([name, { position }]) => {
    const columnSpecification = position.y + 1;
    const rowSpecification = String.fromCharCode(position.x + 65);
    const tile = columnSpecification + rowSpecification;

    const tileSetupMessageElement = document.createElement("div");
    tileSetupMessageElement.innerText = `${tile} placed for ${name}.`;
    return tileSetupMessageElement;
  });

  getDisplayPanel().append(...messages);
};

const renderCorporations = corporations => {
  Object.entries(corporations).forEach(([name, stats]) => {
    const corporation = getCorporation(name);

    corporation.querySelector(".price").innerText = `$${stats.price}`;
    corporation.querySelector(".size").innerText = stats.size;
    corporation.querySelector(".stocks").innerText = stats.stocks;
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
    stocks.classList.add(corporation);
    const [quantityElement] = [...stocks.children];
    quantityElement.innerText = quantity;
  });
};

const fillSpace = (position, corpClass) => {
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

const displayPlayerProfile = ({ balance, stocks, tiles, newTile }, players) => {
  displayAccountBalance(balance);
  displayAccountStocks(stocks);
  displayAndSetupAccountTiles(newTile, tiles, players);
};

const renderBoard = placedTiles => {
  placedTiles.forEach(({ position, belongsTo }) =>
    fillSpace(position, belongsTo)
  );
};

const renderPlayers = players => {
  const playersDiv = getPlayersDiv();
  const playerElements = players.map(({ isTakingTurn, username, you }) => {
    const activeClass = isTakingTurn ? " active" : "";
    const selfClass = you ? " self" : "";

    return generateComponent([
      "div",
      [
        [
          "img",
          "",
          {
            class: "profile-pic",
            src: `https://source.boringavatars.com/beam/120/${username}`,
          },
        ],
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

const generateRefillTileBtn = () => {
  const refillTileMessageElement = generateComponent(["p", "Refill your tile"]);
  const endButton = generateComponent([
    "button",
    "Refill",
    { type: "button", onclick: "refillTile()" },
  ]);

  return [refillTileMessageElement, endButton];
};

const renderTilePlacedMessage = () => {
  const refillTilePrompt = document.createElement("div");
  refillTilePrompt.classList.add("refill-tile-prompt");
  refillTilePrompt.append(...generateRefillTileBtn());
  getDisplayPanel().append(refillTilePrompt);
};

const displayMessage = state => {
  const displayPanel = getDisplayPanel();
  const renderMessage = {
    "place-tile": () => {
      displayPanel.innerText = "Place a tile...";
    },

    "tile-placed": () => {
      displayPanel.innerHTML = "";
      renderTilePlacedMessage();
    },

    "establish-corporation": () => {
      displayPanel.innerText = "Select a corporation to establish...";
    },

    "buy-stocks": () => {
      displayPanel.innerText = "Buying stocks...";
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

const setupCorporationSelection = (players, corporations, state) => {
  const self = players.find(({ you }) => you);
  const currentPlayer = players.find(({ isTakingTurn }) => isTakingTurn);
  const isInCorrectState = state === "establish-corporation";

  if (!(isSamePlayer(self, currentPlayer) && isInCorrectState)) {
    [...document.querySelectorAll(".corporation")].forEach(corp =>
      corp.classList.add("non-selectable")
    );
    return;
  }

  Object.entries(corporations)
    .filter(([, corp]) => !corp.isActive)
    .map(([name]) => {
      const corp = getCorporation(name);

      corp.onclick = () => establishCorporation({ name });
      return corp;
    })
    .forEach(corp => corp.classList.remove("non-selectable"));
};

// eslint-disable-next-line complexity
const setupBuyStocks = (players, corporations, portfolio, state) => {
  const self = players.find(({ you }) => you);
  const isInCorrectState = "buy-stocks" === state;
  const currentPlayer = players.find(({ isTakingTurn }) => isTakingTurn);

  if (!(isSamePlayer(self, currentPlayer) && isInCorrectState)) return;

  const activeCorporations = Object.entries(corporations)
    .filter(([, corp]) => corp.isActive && corp.stocks > 0);

  if (activeCorporations.length === 0) return renderTilePlacedMessage();

  activeCorporations
    .map(([name, { price }]) => {
      const corp = getCorporation(name);
      corp.onclick = () => buyStocks({ name, quantity: 3, price: price * 3 });
      return corp;
    })
    .forEach(corp => corp.classList.remove("non-selectable"));
};

const setupGame = () => {
  fetch("/game/status")
    .then(res => res.json())
    .then(({ players, portfolio, placedTiles, setupTiles, corporations }) => {
      renderPlayers(players);
      displayPlayerProfile(portfolio);
      renderBoard(placedTiles);
      displayInitialMessages(setupTiles);
      renderCorporations(corporations);
    });

  setupInfoCard();
};

const renderGame = () => {
  fetch("/game/status")
    .then(res => res.json())
    .then(({ players, portfolio, state, placedTiles, corporations }) => {
      renderPlayers(players);
      displayPlayerProfile(portfolio, players);
      renderBoard(placedTiles);
      renderActivityMessage(state, players);
      setUpPlayerTilePlacing(players, state);
      setupCorporationSelection(players, corporations, state);
      setupBuyStocks(players, corporations, portfolio, state);
      renderCorporations(corporations);
    });

  setupInfoCard();
};

const keepPlayerProfileUpdated = () => {
  const interval = 1000;
  setupGame();
  setTimeout(() => {
    setInterval(renderGame, interval);
  }, interval * 1);
};

window.onload = keepPlayerProfileUpdated;
