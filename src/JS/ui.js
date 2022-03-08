/* SERVICE WORKER REGISTRATION */

//Registers the Service Worker:
navigator.serviceWorker.register('/service-worker.js', {
  scope: 'https://mysadhana.netlify.app'
});

/* WINDOW FUNCTIONS */

//Onload Function:
window.onload = function () {
  /* Function Calls */

  //Startup:
  showSplash();
  showStartup();

  //Shows Notification:
  showNotification();

  /* Intervals */

  //Sets the Notification Interval:
  setInterval(function () {
    //Shows Notification:
    showNotification();
  }, notificationTimeout);

  //Sets the Notes Interval:
  setInterval(function () {
    //Checks the Case:
    if (getCacheData(codeID, false) != null &&
      saveIndex == null) {
      //Displays the Dash Dates:
      displayDashDates();
    }
  }, datesTimeout);

  /* Input Event Listeners */

  //Search Event Listener:
  document.getElementById('search').addEventListener("input", function (e) {
    //Replaces the Value:
    document.getElementById('search').value = document.getElementById('search').value.replace(/["]+/g, '');
  });

  //Text Area Input Event Listener:
  document.getElementById('content-area').addEventListener("input", function (e) {
    //Checks the Case:
    if (saveIndex != null) {
      //Checks the Case:
      if (document.getElementById('content-area').innerHTML.includes("\"")) {
        //Resets the Value:
        document.getElementById('content-area').value = document.getElementById('content-area').value.replace(/["]+/g, '');
      }

      //Shows the Areas:
      showAreas();
    }
  });
}

//Notification Request Function:
function requestNotify() {
  //Checks the Case:
  if ("Notification" in window) {
    //Requests the Notification:
    Notification.requestPermission();
  }
}

/* UI FUNCTIONS */

//Show Splash Function:
function showSplash() {
  //Checks the Case:
  if (getCacheData(codeID, false) == null) {
    //Shows the Splash:
    document.getElementById('splash-screen').style.display = "block";
    document.getElementById('dashboard').style.display = "none";
    document.getElementById('notes').style.display = "none";
    document.getElementById('loading').style.display = "none";
  }
}

//Show Startup Function:
function showStartup() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Checks the Case:
    if (wait) {
      //Shows the Dashboard:
      wait = false;
      showDashboard();
      displayNotes();
    }

    else {
      //Gets the Data:
      getData();
      showLoading();

      //Sets the Timeout:
      setTimeout(function () {
        //Recurses:
        showStartup();
      }, notesTimeout);
    }
  }
}

//Show Dashboard Function:
function showDashboard() {
  //Shows the Dashboard:
  document.getElementById('splash-screen').style.display = "none";
  document.getElementById('dashboard').style.display = "block";
  document.getElementById('notes').style.display = "none";
  document.getElementById('loading').style.display = "none";
  document.getElementById('search').value = "";
}

//Show Loading Function:
function showLoading() {
  //Shows the Loading Page:
  document.getElementById('splash-screen').style.display = "none";
  document.getElementById('dashboard').style.display = "none";
  document.getElementById('notes').style.display = "none";
  document.getElementById('loading').style.display = "block";
}

//Show Notification Function:
function showNotification() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Gets the Data:
    data = getCacheData(dataID, true);

    //Loop Variables:
    var past = 0;
    var now = 0;
    var future = 0;
    var turns = 0;

    //Loops through Array:
    mainLoop: while (turns < data.length) {
      //Gets the Alerts:
      var alerts = checkDates(dates(data[turns]));

      //Checks the Case:
      if (alerts[0] != "") {
        //Sets the Past:
        past += alerts[0];
      }

      //Checks the Case:
      if (alerts[1] != "") {
        //Sets the Now:
        now += alerts[1];
      }

      //Checks the Case:
      if (alerts[2] != "") {
        //Sets the Future:
        future += alerts[2];
      }

      turns++;
    }

    //Runs the Notification:
    if ("Notification" in window
      && Notification.permission === "granted") {
      //Creates Notification:
      new Notification(past + " Past Dates and " + now + " Current Dates and " + 
        future + " Future Dates");
    }
  }
}

//Show Notes Function:
function showNotes(index) {
  //Checks the Case:
  if (getCacheData(codeID, false) != null && getCacheData(dataID, false) != null
    && saveIndex == null) {
    //Checks the Case:
    if (wait) {
      //Gets the Data:
      wait = false;
      data = getCacheData(dataID, true);
      saveIndex = index;

      //Shows the Note:
      document.getElementById('splash-screen').style.display = "none";
      document.getElementById('dashboard').style.display = "none";
      document.getElementById('notes').style.display = "block";
      document.getElementById('loading').style.display = "none";
      document.getElementById('content-area').value = data[index];


      //Idle Interval:
      mainInterval = setInterval(function () {
        //Checks the Case:
        if (saveIndex != null
          && document.activeElement != document.getElementById('text-area')) {
          //Exits the Note:
          exitNote();
        }
      }, timeout);
    }

    else {
      //Gets the Data:
      getData();
      showLoading();

      //Sets the Timeout:
      setTimeout(function () {
        //Recurses:
        showNotes(index);
      }, notesTimeout);
    }
  }
}

//Show Areas Function:
function showAreas() {
  //Sets the Text Area:
  document.getElementById('text-area').innerHTML = document.getElementById('content-area').value
    .replace(new RegExp("\n", "g"), "<br>");
  highlightDates(dates(document.getElementById('text-area').innerHTML));
}

//Show Confirm Function:
function showConfirm(index) {
  //Opens the Confirmation:
  document.getElementById('confirmation').innerHTML =
    "<div class='padding'> Are You Sure? </div>"
    + "<button onclick='deleteNote(" + index + ");'> Yes </button>"
    + "<button onclick='closeConfirm();'> No </button>";
}

//Close Confirm Function:
function closeConfirm() {
  //Closes the Confirmation:
  document.getElementById('confirmation').innerHTML = "";
}

//Show Login Function:
function showLogIn() {
  //Sets the Element:
  document.getElementById('log-in').style.display = "block";
}

//Show Error Function:
function showError(error) {
  //Sets the Error:
  document.getElementById('error').innerHTML = error;
}

//Show Dash Error Function:
function showDashError(error) {
  //Sets the Error:
  document.getElementById('dash-error').innerHTML = error;
}