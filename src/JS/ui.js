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
      //Checks the Case:
      if (document.getElementById('text-area').innerHTML.includes("\"")) {
        //Resets the Value:
        document.getElementById('text-area').innerHTML = document.getElementById('text-area').innerHTML.replace(/["]+/g, '');
      }

      //Shows Dates:
      showDates();
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

      //Shows the Data:
      document.getElementById('text-area').innerHTML = data[index];
      showDates();

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

//Show Dates Function:
function showDates() {
  //Sets the Dates:
  document.getElementById('past-dates').innerHTML = stringifyDates(checkPast(dates(document.getElementById('text-area').innerHTML)));
  document.getElementById('current-dates').innerHTML = stringifyDates(checkNow(dates(document.getElementById('text-area').innerHTML)));
  document.getElementById('future-dates').innerHTML = stringifyDates(checkFuture(dates(document.getElementById('text-area').innerHTML)));
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