const getInfoIcon = () => document.querySelector("#info-icon");
const getInfoCard = () => document.querySelector("#info-card");
const getInfoCloseBtn = () => document.querySelector("#info-close-btn");
const getPlayersDiv = () => document.querySelector("#players");

const displayAccountBalance = balance => {
  const balanceContainer = document.querySelector("#balance-container");
  balanceContainer.innerText = "$" + balance;
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

const fillSpace = tilePosition => {
  const tileId = tilePosition.x * 12 + tilePosition.y;
  const tiles = document.querySelectorAll(".space");
  tiles[tileId].classList.add("placed-tile");
};

const setUpTiles = ({ tilePosition }) => {
  fetch("/game/tile", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(tilePosition),
  }).then(res => {
    if (res.status === 200) {
      fillSpace(tilePosition);
    }
  });
};

const displayTile = (tileElement, tilePosition) => {
  const { x, y } = tilePosition;
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
  tiles.forEach(({ tilePosition, isPlaced }, tileID) => {
    const tileElement = tileElements[tileID];

    displayTile(tileElement, tilePosition);
    addVisualAttribute(tileElement, isPlaced);
    attatchListener(tileElement, { tilePosition, isPlaced });
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
  incorporatedTiles.forEach(fillSpace);
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
        class: `player flex ${activeClass} ${selfClass}`
      }
    ]);
  });

  [...playersDiv.children].forEach(child => child.remove());
  playersDiv.append(...playerElements);
};

const loadAccount = () => {
  fetch("/game/status")
    .then(res => res.json())
    .then(({ players, portfolio, tiles }) => {
      renderPlayers(players);
      displayPlayerProfile(portfolio);
      displayIncorporatedTiles(tiles);
    });

  setupInfoCard();
};

const keepPlayerProfileUpdated = () => {
  const interval = 1000;
  loadAccount();
  setInterval(loadAccount, interval);
};

window.onload = keepPlayerProfileUpdated;
