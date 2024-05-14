let players = [];
//TODO: to get data players from local storage
function getDataFromStorage() {
  if (localStorage.length > 0) {
    players = JSON.parse(localStorage.getItem("players"));
    setDataInTable();
    statisticsChart();
  }
}
getDataFromStorage();

//TODO: to set info players in tables (after get from local storage)
function setDataInTable() {
  let tbody = document.querySelector(".table-players table tbody");
  players?.forEach((e) => {
    let tr = document.createElement("tr");
    for (let data in e) {
      let td = document.createElement("td");
      td.innerText = e[data];
      (data == "numberFailures" || data == "numberSuccesses") &&
        td.classList.add("displayed-mobile");
      if (data == "time") {
        let time = new Date(e[data]);
        td.innerHTML = `${time.getFullYear()} - ${
          time.getMonth() + 1
        } - ${time.getDate()} / ${time.getHours()}:${time.getMinutes()} ${
          time.getHours() > 12 ? "PM" : "AM"
        }`;
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
}
//TODO: This function graphs the number of players who are more than three free to win
function statisticsChart() {
  let playersSummary = {};
  players.forEach((player) => {
    if (!playersSummary[player.namePlayer]) {
      playersSummary[player.namePlayer] = 0;
    }
    playersSummary[player.namePlayer] += player.totalSuccess;
  });
  let summaryArray = Object.keys(playersSummary).map((namePlayer) => ({
    namePlayer: namePlayer,
    totalSuccess: playersSummary[namePlayer],
  }));
  summaryArray.sort((a, b) => b.totalSuccess - a.totalSuccess);
  let topPlayers = summaryArray.slice(0, 3);
  let labels = topPlayers.map((player) => player.namePlayer);
  let data = topPlayers.map((player) => player.totalSuccess);
  let canvas = document.getElementById("myChart").getContext("2d");
  summaryArray.length > 0 &&
    document.getElementById("myChart").classList.add("hasData");
  let myChart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Number of overall wins",
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
