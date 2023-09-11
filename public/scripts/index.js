const getJoinForm = () => document.querySelector("#join-form");

const requestJoinGame = userData => {
  return fetch("/players", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: { "content-type": "application/json" },
  });
};

const joinGame = ({ redirected, url }) => {
  if (redirected) {
    window.location.assign(url);
    return;
  }

  throw new Error("Failed to join game");
};

const setupJoinForm = () => {
  const joinFrom = getJoinForm();
  joinFrom.onsubmit = event => {
    event.preventDefault();
    const userData = Object.fromEntries(new FormData(joinFrom));
    requestJoinGame(userData).then(joinGame).catch(console.error);
  };
};

const main = () => {
  setupJoinForm();
};

window.onload = main;
