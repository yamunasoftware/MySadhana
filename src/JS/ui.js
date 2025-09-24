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
  showNotification();

  /* Intervals */

  //Sets the Notification Interval:
  setInterval(function () {
    //Shows the Push:
    showPush();
  }, notificationTimeout);

  //Sets the Notes Interval:
  setInterval(function () {
    //Displays the Dash Dates:
    displayDashDates();
  }, datesTimeout);

  /* Input Event Listeners */

  //Search Input Event Listener:
  document.getElementById('search').addEventListener("input", function () {
    //Checks the Case:
    if (saveIndex == null) {
      //Searches:
      search();
      document.getElementById('search').value = document.getElementById('search').value.replace(/["]+/g, '');
    }
  });

  //Content Area Input Event Listener:
  document.getElementById('content-area').addEventListener("input", function () {
    //Dynamic Content Area:
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
}

/* UI FUNCTIONS */

//Notification Request Function:
function requestNotify() {
  //Checks the Case:
  if ("Notification" in window) {
    //Requests the Notification:
    Notification.requestPermission();
  }
}

//Show Splash Function:
function showSplash() {
  //Checks the Case:
  if (getCacheData(codeID, false) == null) {
    //Shows the Splash:
    document.getElementById('splash-screen').style.display = "block";
    document.getElementById('dashboard').style.display = "none";
    document.getElementById('notes').style.display = "none";
    document.getElementById('loading').style.display = "none";
    showNotification();
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
  showNotification();
}

//Show Loading Function:
function showLoading() {
  //Shows the Loading Page:
  document.getElementById('splash-screen').style.display = "none";
  document.getElementById('dashboard').style.display = "none";
  document.getElementById('notes').style.display = "none";
  document.getElementById('loading').style.display = "block";
  document.title = "Loading...";
}

/* NOTIFICATION FUNCTIONS */

//Show Notification:
function showNotification() {
  //Sets the Tab Value:
  document.title = "MySadhana";
  setTabIcon("/src/Images/small_icon.png");

  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Gets the Date Values:
    var dateValues = checkAllDates();
    var total = dateValues[0] + dateValues[1] + dateValues[2];

    //Checks the Case:
    if (total > 0) {
      //Sets the Values:
      document.title = "(" + total + ") MySadhana";
      setTabIcon("/src/Images/small_icon_notify.png");
      navigator.setAppBadge(total).catch(() => {
        //Nothing!
      });
    }
  }
}

//Show Push Function:
function showPush() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Gets the Date Values:
    var dateValues = checkAllDates();
    var total = dateValues[0] + dateValues[1] + dateValues[2];
    var notificationString = "";

    //Checks the Case:
    if (dateValues[0] > 0) {
      //Adds to the String:
      notificationString += dateValues[0] + " Past\n";
    }

    //Checks the Case:
    if (dateValues[1] > 0) {
      //Adds to the String:
      notificationString += dateValues[1] + " Today\n";
    }

    //Checks the Case:
    if (dateValues[2] > 0) {
      //Adds to the String:
      notificationString += dateValues[2] + " Upcoming\n";
    }

    //Checks the Case:
    if (total > 0) {
      //Runs the Notification:
      if ("Notification" in window
        && Notification.permission === "granted") {
        //Creates Notification:
        new Notification(notificationString);
      }
    }
  }
}

//Set Tab Icon Function:
function setTabIcon(src) {
  //Sets the Tab Icon:
  var headTitle = document.querySelector('head');
  var setFavicon = document.createElement('link');
  setFavicon.setAttribute('rel', 'shortcut icon');
  setFavicon.setAttribute('href', src);
  headTitle.appendChild(setFavicon);
}

/* NOTES FUNCTIONS */

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
      document.getElementById('content-area').innerHTML = data[index];
      showNotification();

      //Dynamic Content Area:
      document.getElementById('content-area').style.height = 'auto';
      document.getElementById('content-area').style.height = document.getElementById('content-area').scrollHeight + 'px';

      //Idle Interval:
      mainInterval = setInterval(function () {
        //Checks the Case:
        if (saveIndex != null
          && document.activeElement != document.getElementById('content-area')) {
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
        colorDates();
      }, notesTimeout);
    }
  }
}

//Color Dates Function:
function colorDates() {
  const contentArea = document.getElementById('content-area');
  const text = contentArea.innerHTML;
  var dateList = dates(text);
  var localDates = extractDate(dateList[i]);

  for (let i = 0; i < dateList.length; i++) {
    const check = checkDate(localDates[i]);
    const replaceDate = dateList[i].replace("-", "/");

    if (check == -1) {
      const dateFormat = `<span class="date-past">${replaceDate}</span>`;
      text.replace(replaceDate, dateFormat);
    }

    else if (check == 0) {
      const dateFormat = `<span class="date-today">${replaceDate}</span>`;
      text.replace(replaceDate, dateFormat);
    }

    else if (check == 1) {
      const dateFormat = `<span class="date-future">${replaceDate}</span>`;
      text.replace(replaceDate, dateFormat);
    }
  }
  contentArea.innerHTML = text;
}

/* CONFIRMATION FUNCTIONS */

//Close Confirm Function:
function closeConfirm() {
  //Closes the Confirmation:
  document.getElementById('conformation').innerHTML = "";
}

//Show Confirm Function:
function showConfirm(index) {
  //Opens the Confirmation:
  document.getElementById('conformation').innerHTML =
    "<div class='padding'> Delete Note? </div>"
    + "<button onclick='deleteNote(" + index + ");'> Yes </button>"
    + "<button onclick='closeConfirm();'> No </button>";
}

//Show Remove Confirm Function:
function showRemoveConfirm() {
  //Opens the Confirmation:
  document.getElementById('conformation').innerHTML =
    "<div class='padding'> Close Account? </div>"
    + "<button onclick='removeUser();'> Yes </button>"
    + "<button onclick='closeConfirm();'> No </button>";
}

//Show Exit Confirm Function:
function showExitConfirm() {
  //Opens the Confirmation:
  document.getElementById('conformation').innerHTML =
    "<div class='padding'> Exit Out? </div>"
    + "<button onclick='logOut();'> Yes </button>"
    + "<button onclick='closeConfirm();'> No </button>";
}

/* MESSAGE FUNCTIONS */

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

//Show Copy Message:
function showCopyMessage() {
  //Sets the Copy Message:
  document.getElementById('copy-message').innerHTML = "Copied";
}