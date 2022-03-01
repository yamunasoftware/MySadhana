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

  /* Event Listeners */

  //Search Event Listener:
  document.getElementById('search').addEventListener("input", function (e) {
    //Search:
    search(e);
  });

  //Log In Enter Event Listener:
  document.getElementById('log-in-input').addEventListener("keydown", function (e) {
    //Checks the Case:
    if (e.key == "Enter") {
      //Logs In:
      logIn();
    }
  });

  //Text Area Input Event Listener:
  document.getElementById('text-area').addEventListener("input", function (e) {
    //Checks the Case:
    if (saveIndex != null) {
      //Shows Bar:
      showNotesBar();

      //Checks the Case:
      if (document.getElementById('text-area').innerHTML.includes("\"")) {
        //Resets the Value:
        document.getElementById('text-area').innerHTML = document.getElementById('text-area').innerHTML.replace(/["]+/g, '');
      }
    }
  });

  //Exit Notes Event Listener:
  window.addEventListener("keydown", function (e) {
    //Checks the Case:
    if (e.key == "Escape" && saveIndex != null) {
      //Exits the Note:
      exitNote();
    }
  });
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
      }, 100);
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

//Show Notes Function:
function showNotes(index) {
  //Adds Event Listener:
  window.addEventListener("keydown", function (e) {
    //Checks the Case:
    if (e.key != "Shift") {
      //Shows Notes Display:
      showNotesDisplay(index);
    }

    else {
      //Pins the Note:
      pinNote(index);
    }
  });
}

//Show Notes Display Function:
function showNotesDisplay(index) {
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

      //Shows the Notes Bar:
      showNotesBar();
      document.getElementById('text-area').innerHTML = data[index];
      closeNavigation();

      //Idle Interval:
      mainInterval = setInterval(function () {
        //Checks the Case:
        if (document.getElementById('text-area') != document.activeElement
          && saveIndex != null) {
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
      }, 100);
    }
  }
}

//Show Notes Bar Function:
function showNotesBar() {
  //Checks the Case:
  if (getCacheData(dataID, false) != null && saveIndex != null) {
    //Gets the Data:
    data = getCacheData(dataID, true);

    //Sets the Notes Bar:
    var notesBar =
      "<div class='mobile-button' onclick='exitNote();'> <</div>" +
      "<button onclick='showConfirm();'> Delete </button>";

    //Adds the Notes Bar:
    document.getElementById('notes-bar').innerHTML = notesBar;
    document.getElementById('past-dates').innerHTML = stringifyDates(checkPast(dates(data[saveIndex])));
    document.getElementById('current-dates').innerHTML = stringifyDates(checkNow(dates(data[saveIndex])));
    document.getElementById('future-dates').innerHTML = stringifyDates(checkFuture(dates(data[saveIndex])));
  }
}

//Show Confirm Function:
function showConfirm() {
  //Opens the Confirmation:
  document.getElementById('confirmation').style.display = "block";
}

//Close Confirm Function:
function closeConfirm() {
  //Closes the Confirmation:
  document.getElementById('confirmation').style.display = "none";
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