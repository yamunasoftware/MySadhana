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
  //Checks the Case:
  if (getCacheData(dataID, false) != null && saveIndex == null) {
    //Gets the Data:
    getData();
    
    //Checks the Case:
    if (getCacheData(waitID, false) != null) {
      //Gets the Data:
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
    }

    else {
      //Sets the Timeout:
      showLoading();
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

    //Checks the Case:
    if (saveIndex != 0) {
      //Sets Notes Bar:
      notesBar += "<button onclick='pinNote();'> Pin </button>";
    }

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

//Show Navigation Function:
function showNavigation() {
  //Checks the Case:
  if (screen.width <= 990) {
    //Displays the Element:
    document.getElementById('navigation').style.display = "block";
    document.getElementById('open-navigation').style.display = "none";
  }
}

//Close Navigation Function:
function closeNavigation() {
  //Checks the Case:
  if (screen.width <= 990) {
    //Closes the Element:
    document.getElementById('navigation').style.display = "none";
    document.getElementById('open-navigation').style.display = "block";
  }
}