import GameService from "/scripts/game-service.js";
import GameGateway from "/scripts/game-gateway.js";
import Balance from "/scripts/components/balance.js";
import Stocks from "/scripts/components/stocks.js";

let previousState;

const CORPORATIONS = [
  "phoenix",
  "quantum",
  "hydra",
  "fusion",
  "america",
  "sackson",
  "zeta",
  "incorporated",
];

const MESSAGE_GENERATORS = {
  "place-tile": player => player + "'s turn.",
  "tile-placed": player => player + " placed a tile.",
  "establish-corporation": player => player + " is establishing a corporation",
  "buy-stocks": player => player + " is taking turn",
  "game-end": player => player + " calculating earning",
  "merge": (_, { acquirer, defunct }) => `${acquirer} acquired ${defunct}`,
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

const stockIDs = {
  "phoenix": "phoenix-stock",
  "quantum": "quantum-stock",
  "hydra": "hydra-stock",
  "fusion": "fusion-stock",
  "america": "america-stock",
  "sackson": "sackson-stock",
  "zeta": "zeta-stock",
};

const getStockElements = () => {
  const stockContainerEntries = Object.entries(stockIDs).map(([corp, id]) => {
    const corpElement = document.getElementById(id);

    return [
      corp,
      {
        card: corpElement,
        quantity: corpElement.querySelector(".quantity"),
      },
    ];
  });

  return Object.fromEntries(stockContainerEntries);
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
const getBalanceContainer = () => document.querySelector("#balance-container");

const getCorporations = () => document.querySelector("#corporations");

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
  // .then(highlightTile());
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

const sellBackStocks = (corporations, stocks) => {
  return corporations.reduce((earning, { name, price }) => {
    return earning + stocks[name] * price;
  }, 0);
};

const rankPlayers = ({ players, corporations }) => {
  const { name: corpName, price } = corporations;

  return players
    .map(({ stocks, balance, name }) => {
      const sellBackEarning = sellBackStocks(corporations, stocks);
      const finalBalance = balance + sellBackEarning;
      return { name, balance: finalBalance };
    })
    .toSorted((a, b) => b.balance - a.balance);
};

const generateRankTable = playerRanks => {
  const rankTable = generateComponent(["div", "Ranks", { class: "ranks" }]);

  const rankElements = playerRanks.map(({ name, balance }) =>
    generateComponent([
      "p",
      [
        ["span", `${name} :`],
        ["span", `$${balance}`],
      ],
      { class: "flex" },
    ])
  );

  rankTable.append(...rankElements);
  return rankTable;
};

const getGameResult = () => {
  fetch("/game/end-result")
    .then(res => res.json())
    .then(result => {
      const playerRanks = rankPlayers(result);
      const displayPanel = getDisplayPanel();
      displayPanel.innerHTML = "";
      displayPanel.append(generateRankTable(playerRanks));
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

const endMerge = () => {
  fetch("/game/end-merge", { method: "POST" });
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

const displayInitialMessages = ({ setupTiles }) => {
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

const renderCorporations = ({ corporations }) => {
  Object.entries(corporations).forEach(([name, stats]) => {
    const corporation = getCorporation(name);

    if (stats.isSafe) corporation.classList.add("safe");

    corporation.querySelector(".price").innerText = `$${stats.price}`;
    corporation.querySelector(".size").innerText = stats.size;
    corporation.querySelector(".stocks").innerText = stats.stocks;
  });
};

const displayAccountStocks = stocks => {
  Object.entries(stocks).forEach(([corporation, quantity]) => {
    const stocks = document.getElementById(stockIDs[corporation]);
    stocks.classList.add(corporation);
    const [quantityElement] = [...stocks.children];
    quantityElement.innerText = quantity;
  });
};

const fillSpace = (position, corpClass) => {
  const board = getBoard();
  const tileId = position.x * 12 + position.y;
  const tile = board[tileId];
  CORPORATIONS.forEach(corp => tile.classList.remove(corp));
  tile.classList.add(corpClass);
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

const animateElement = (element, transactionType, delay = 1000) => {
  element.classList.add(transactionType);
  setTimeout(() => element.classList.remove(transactionType), delay);
};

// eslint-disable-next-line complexity
const highlightTile = (tile, tileElement, previousState, gameStatus) => {
  const tileToHighlight = gameStatus.portfolio.newTile || { position: {} };
  const { state, players } = gameStatus;

  const self = players.find(({ you }) => you);
  const currentPlayerId = players.findIndex(({ isTakingTurn }) => isTakingTurn);
  const currentPlayer = players[currentPlayerId];
  // const previousPlayer = players[(currentPlayerId + 1) % players.length];

  const isSamePlayer = currentPlayer.username === self.username;
  const isValidState = previousState === "buy-stocks" && state === "place-tile";

  const shouldHighLight =
    isSameTile(tile, tileToHighlight) && isValidState && isSamePlayer;
  if (shouldHighLight) {
    animateElement(tileElement, "new-tile");
  }
};

const displayAndSetupAccountTiles = (gameStatus, previousState) => {
  const tileElements = getTileElements();
  const { tiles } = gameStatus.portfolio;

  tiles.forEach((tile, tileID) => {
    const tileElement = tileElements[tileID];
    displayTile(tileElement, tile.position);
    addVisualAttribute(tileElement, tile.isPlaced);
    attachListener(tileElement, tile);
    // highlightTile(tile, tileElement, previousState, gameStatus);
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

const displayPlayerProfile = (gameStatus, previousState) => {
  const { portfolio } = gameStatus;
  const { balance, stocks } = portfolio;

  // displayAccountBalance(balance);
  // displayAccountStocks(stocks);
  displayAndSetupAccountTiles(gameStatus, previousState);
};

const animateTile = (position, transitionType, duration = 1000) => {
  const board = getBoard();
  const tileId = position.x * 12 + position.y;
  const tile = board[tileId];

  tile.classList.add(transitionType);
  setTimeout(() => tile.classList.remove(transitionType), duration);
};

const renderBoard = ({ placedTiles, state }) => {
  placedTiles.forEach(({ position, belongsTo }) =>
    fillSpace(position, belongsTo)
  );

  const newTilePlaced = placedTiles.at(-1);
  animateTile(newTilePlaced.position, "new-tile");
};

const renderPlayers = ({ players }) => {
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

const displayMessage = gameStatus => {
  const { state, stateInfo } = gameStatus;
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
      displayPanel.innerHTML = "";
    },

    "merge": ({ acquirer, defunct }) => {
      displayPanel.innerHTML = "";
      displayPanel.append(
        generateComponent([
          "div",
          [
            ["p", MESSAGE_GENERATORS.merge("", { acquirer, defunct })],
            ["button", "OK", { onclick: "endMerge()" }],
          ],
          { class: "refill-tile-prompt" },
        ])
      );
    },
  };

  renderMessage[state](stateInfo);
};

const isSamePlayer = (self, currentPlayer) =>
  self.username === currentPlayer.username;

const determineDisplayName = (self, currentPlayer) =>
  isSamePlayer(self, currentPlayer) ? "You" : currentPlayer.username;

const customizeActivityMessage = (self, currentPlayer, gameStatus) => {
  const displayName = determineDisplayName(self, currentPlayer);

  if (isSamePlayer(self, currentPlayer)) {
    return displayMessage(gameStatus);
  }

  const message = MESSAGE_GENERATORS[gameStatus.state](
    currentPlayer.username,
    gameStatus.stateInfo
  );

  const displayPanel = getDisplayPanel();
  displayPanel.innerText = message;
};

const renderActivityMessage = gameStatus => {
  const { state, players } = gameStatus;

  if (state === MESSAGE_GENERATORS.setup) return;
  const self = players.find(({ you }) => you);
  const currentPlayer = players.find(({ isTakingTurn }) => isTakingTurn);
  customizeActivityMessage(self, currentPlayer, gameStatus);
};

const setUpPlayerTilePlacing = ({ players, state }) => {
  const self = players.find(({ you }) => you);
  const currentPlayer = players.find(({ isTakingTurn }) => isTakingTurn);

  const tileContainer = getTileContainer();

  if (isSamePlayer(self, currentPlayer) && state === "place-tile") {
    return tileContainer.classList.remove("disable-click");
  }

  tileContainer.classList.add("disable-click");
};

const setupCorporationSelection = ({ players, corporations, state }) => {
  const self = players.find(({ you }) => you);
  const currentPlayer = players.find(({ isTakingTurn }) => isTakingTurn);
  const isInCorrectState = state === "establish-corporation";
  const corporationsContainer = getCorporations();

  if (!(isSamePlayer(self, currentPlayer) && isInCorrectState)) {
    corporationsContainer.classList.remove("selectable");
    [...document.querySelectorAll(".corporation")].forEach(corp =>
      corp.classList.add("non-selectable")
    );
    return;
  }

  corporationsContainer.classList.add("selectable");

  Object.entries(corporations)
    .filter(([, corp]) => !corp.isActive)
    .map(([name]) => {
      const corp = getCorporation(name);

      corp.onclick = () => establishCorporation({ name });
      return corp;
    })
    .forEach(corp => corp.classList.remove("non-selectable"));
};

const setupGame = () => {
  fetch("/game/status")
    .then(res => res.json())
    .then(gameStatus => {
      renderPlayers(gameStatus);
      displayPlayerProfile(gameStatus);
      renderBoard(gameStatus);
      displayInitialMessages(gameStatus);
      renderCorporations(gameStatus);
    });

  setupInfoCard();
};

const notifyGameEnd = () => {
  const displayPanel = getDisplayPanel();
  const gameEndElement = generateComponent([
    "div",
    [
      ["p", "Game Over"],
      ["button", "Stats", { onclick: "getGameResult()" }],
    ],
    { class: "game-over flex" },
  ]);

  displayPanel.innerHTML = "";
  displayPanel.append(gameEndElement);
};

const renderGame = () => {
  fetch("/game/status")
    .then(res => res.json())
    .then(gameStatus => {
      if (previousState === gameStatus.state) return;

      if (gameStatus.state === "game-end") {
        notifyGameEnd();
        displayPlayerProfile(gameStatus);
        previousState = gameStatus.state;
        return;
      }

      renderPlayers(gameStatus);
      displayPlayerProfile(gameStatus, previousState);
      renderBoard(gameStatus);
      renderActivityMessage(gameStatus);
      setUpPlayerTilePlacing(gameStatus);
      setupCorporationSelection(gameStatus);
      startPurchase(gameStatus, getDisplayPanel());
      renderCorporations(gameStatus);
      previousState = gameStatus.state;
    });

  setupInfoCard();
};

const flash = (element, time = 500) => {
  element.classList.add("flash");
  console.log(element);
  setTimeout(() => {
    element.classList.remove("flash");
  }, time);
};

const createComponents = () => {
  const balanceContainer = getBalanceContainer();
  const amountElement = balanceContainer.querySelector(".amount");
  const stockElements = getStockElements();
  const flashBalance = () => flash(balanceContainer);
  const flashStock = corp => flash(stockElements[corp].card);

  return {
    balance: new Balance(amountElement, flashBalance),
    stocks: new Stocks(stockElements, flashStock),
  };
};

const keepPlayerProfileUpdated = () => {
  const interval = 1000;

  const gameGateway = new GameGateway("/game");
  const components = createComponents();
  const gameService = new GameService(gameGateway, components);

  setupGame();
  setTimeout(() => {
    setInterval(() => {
      renderGame();
      gameService.render();
    }, interval);
  }, interval * 1);
};

window.onload = keepPlayerProfileUpdated;
