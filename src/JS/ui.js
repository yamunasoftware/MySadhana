/* SERVICE WORKER REGISTRATION */

//Registers the Service Worker:
navigator.serviceWorker.register('/service-worker.js', {
  scope: 'https://mysadhana.netlify.app'
});

/* WINDOW FUNCTIONS */

//Onload Function:
window.onload = function () {
  /* Function Calls */

  //Init Functions:
  showSplash();
  getData();

  /* Event Listeners */

  //Search Event Listener:
  document.getElementById('search').addEventListener("input", function (e) {
    //Searches:
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
  document.getElementById('text-area').addEventListener("input", function () {
    //Checks the Case:
    if (saveIndex != null) {
      //Saves the Note:
      saveNote();
      showNotesBar();
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

  //Window Resize Event:
  window.addEventListener('resize', function () {
    //Reloads the Page:
    window.location.reload();
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
  }
}

//Show Dashboard Function:
function showDashboard() {
  //Shows the Dashboard:
  document.getElementById('splash-screen').style.display = "none";
  document.getElementById('dashboard').style.display = "block";
  document.getElementById('notes').style.display = "none";
  document.getElementById('search').value = "";
}

//Show Notes Function:
function showNotes(index) {
  //Checks the Case:
  if (getCacheData(dataID, false) != null && saveIndex == null) {
    //Gets the Data:
    data = getCacheData(dataID, true);
    saveIndex = index;

    //Shows the Note:
    document.getElementById('splash-screen').style.display = "none";
    document.getElementById('dashboard').style.display = "none";
    document.getElementById('notes').style.display = "block";

    //Shows the Notes Bar:
    showNotesBar();
    document.getElementById('text-area').innerHTML = data[index];
    closeNavigation();
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
      "<button style='margin-left: 0px;' onclick='exitNote();'> Back </button>" +
      "<button onclick='deleteNote();'> Delete </button>";

    //Checks the Case:
    if (saveIndex != 0) {
      //Sets Notes Bar:
      notesBar += "<button onclick='pinNote();'> Pin </button>";
    }

    //Adds the Alerts System:
    var alerts = checkDates(dates(data[saveIndex]));
    notesBar +=
      "<div class='margin note-alert disappear'>" + alerts[1] + "</div>"
      + "<div style='background-color: #147efb;' class='margin note-alert disappear'>" + alerts[0] + "</div>"
      + "<div style='background-color: #53d769;' class='margin note-alert disappear'>" + alerts[2] + "</div>";

    //Adds the Alerts System:
    document.getElementById('notes-bar').innerHTML = notesBar;
    document.getElementById('past-dates').innerHTML = stringifyDates(checkPast(dates(data[saveIndex])));
    document.getElementById('current-dates').innerHTML = stringifyDates(checkNow(dates(data[saveIndex])));
    document.getElementById('future-dates').innerHTML = stringifyDates(checkFuture(dates(data[saveIndex])));
  }
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

//Show Navigation Function:
function showNavigation() {
  //Displays the Element:
  document.getElementById('navigation').style.visibility = "visible";
  document.getElementById('navigation').classList.remove('ease-out');
  void document.getElementById('navigation').offsetWidth;
  document.getElementById('navigation').classList.add('ease-in');
}

//Close Navigation Function:
function closeNavigation() {
  //Closes the Element:
  document.getElementById('navigation').style.visibility = "hidden";
  document.getElementById('navigation').classList.remove('ease-in');
  void document.getElementById('navigation').offsetWidth;
  document.getElementById('navigation').classList.add('ease-out');
}