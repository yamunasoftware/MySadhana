/* CLOUD VARIABLES */

//Configuration:
const firebaseConfig = {
  apiKey: "AIzaSyDTw4G4mOxZbIYYEPkBUDo2sycRM2XuN94",
  authDomain: "mysadhana-75be1.firebaseapp.com",
  projectId: "mysadhana-75be1",
  storageBucket: "mysadhana-75be1.appspot.com",
  messagingSenderId: "30818005011",
  appId: "1:30818005011:web:4eef8ffc3bbfc3dd468fe6"
};

//Database Variables:
firebase.initializeApp(firebaseConfig);
var database = firebase.firestore();
var collectionName = "users";

//ID Variables:
var codeID = "code";
var dataID = "data";

//Data Variables:
var code = "";
var data = [];
var saveIndex = null;

/* CLOUD AUTH FUNCTIONS */

//Sign Up Function:
function signUp() {
  //Gets the Code, Sets the Cloud Data:
  var code = generateCode();
  database.collection(collectionName).doc(code).set({
    data: JSON.stringify(data)
  })
    .then(() => {
      //Sets the Cache Data:
      setCacheData(codeID, code, false);
      setCacheData(dataID, data, true);

      //Shows the Dashboard:
      showDashboard();
      displayNotes();
    })
    .catch(() => {
      //Displays Error:
      showError("Error");
    });
}

//Log In Function:
function logIn() {
  //Gets the Code:
  var code = document.getElementById('log-in-input').value;

  //Checks the Case:
  if (code != "") {
    //Gets the Cloud Data:
    database.collection(collectionName).doc(code).get().then((doc) => {
      //Checks the Case:
      if (doc.exists) {
        //Sets the Data:
        data = JSON.parse(formatData(JSON.stringify(doc.data().data)));

        //Sets the Cache Data:
        setCacheData(codeID, code, false);
        setCacheData(dataID, data, true);

        //Shows the Dashboard:
        showDashboard();
        displayNotes();
      }

      else {
        //Displays Error:
        showError("Invalid ID");
      }
    })

  }

  else {
    //Displays Error:
    showError("Invalid ID");
  }
}

//Generate Code Function:
function generateCode() {
  //Loop Variables:
  var turns = 0;
  var code = "";

  //Loops through Array:
  mainLoop: while (turns < 20) {
    //Gets the Digit:
    var digit = Math.floor((Math.random() * 9) + 1);
    code += digit;

    turns++;
  }

  //Returns the Code:
  return code;
}

/* CLOUD REQUEST FUNCTIONS */

//Send Data Function:
function sendData() {
  if (getCacheData(codeID, false) != null) {
    //Gets the Code:
    code = getCacheData(codeID, false);

    //Sets the Cloud Data:
    database.collection(collectionName).doc(code).update({
      data: JSON.stringify(data)
    })
      .catch(() => {
        //Displays Error:
        showError("Error");
      });
  }
}

//Get Data Function:
function getData() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Gets the Code:
    code = getCacheData(codeID, false);

    //Gets the Cloud Data:
    database.collection(collectionName).doc(code).get().then((doc) => {
      //Checks the Case:
      if (doc.exists) {
        //Sets the Data:
        data = JSON.parse(formatData(JSON.stringify(doc.data().data)));
        setCacheData(dataID, data, true);

        //Shows the Dashboard:
        showDashboard();
        displayNotes();
      }

      else {
        //Displays Error:
        showError("Invalid ID");
      }
    })
      .catch(() => {
        //Displays Error:
        showError("Invalid ID");
      });
  }
}

/* DATA FUNCTIONS */

//Copy Code Function:
function copyCode() {
  //Sends the Code to Clipboard:
  code = getCacheData(codeID, false);
  navigator.clipboard.writeText(code);
}

//Save Note Function:
function saveNote() {
  //Checks the Case:
  if (getCacheData(dataID, false) != null) {
    //Sets the Data:
    data = getCacheData(dataID, true);
    data[saveIndex] = document.getElementById('text-area').value;

    //Saves the Data:
    data[saveIndex] = data[saveIndex].split("\n").join("$n");
    setCacheData(dataID, data, true);
    sendData();
  }
}

//Exit Notes Function:
function exitNote() {
  //Shows the Dashboard:
  saveIndex = null;
  showDashboard();
  displayNotes();
}

//Display Notes Function:
function displayNotes() {
  //Checks the Case:
  if (getCacheData(dataID, false) != null) {
    //Loop Variables:
    data = getCacheData(dataID, true);
    var notesList = "";
    var turns = 0;

    //Loops through Array:
    mainLoop: while (turns < data.length) {
      //Sets the Notes List:
      notesList +=
        "<div class='margin padding card center' style='cursor: pointer;' onclick='showNotes(" + turns + ");'>" 
        + title(data[turns]) + "</div>" + 
        "<div class='padding dash-alert'>" + checkDates(dates(data[turns])) + "</div>";

      turns++;
    }

    //Sets the HTML:
    document.getElementById('notes-list').innerHTML = notesList;
  }
}

//Search Function:
function search(e) {
  //Loop Variables:
  data = getCacheData(dataID, true);
  var turns = 0;
  var notesList = "";

  //Loops through Array:
  mainLoop: while (turns < data.length) {
    //Checks the Case:
    if (data[turns].toLowerCase().includes(e.target.value.toLowerCase())) {
      //Sets the Notes List:
      notesList +=
        "<div class='margin padding card center' style='cursor: pointer;' onclick='showNotes(" + turns + ");'>" 
        + title(data[turns]) + "</div>" + 
        "<div class='padding dash-alert'>" + checkDates(dates(data[turns])) + "</div>";
    }

    turns++;
  }

  //Sets the HTML:
  document.getElementById('notes-list').innerHTML = notesList;
}

//Add Note Function:
function addNote() {
  //Checks the Case:
  if (getCacheData(dataID, false) != null) {
    //Gets the Data:
    data = getCacheData(dataID, true);
    data.push("");

    //Sends the Data
    setCacheData(dataID, data, true);
    sendData();
    displayNotes();
  }
}

//Delete Note Function:
function deleteNote(index) {
  //Checks the Case:
  if (getCacheData(dataID, false) != null) {
    //Gets the Data:
    data = getCacheData(dataID, true);
    data.splice(index, 1);

    //Sends the Data:
    setCacheData(dataID, data, true);
    sendData();
    
    //Shows the Dashboard:
    showDashboard();
    displayNotes();
  }
}

//Title Function:
function title(string) {
  //Loops Variables:
  var noteTitle = "";
  var turns = 0;

  //Loops through Array:
  mainLoop: while (turns < string.length) {
    //Checks the Case:
    if (string[turns] != "$") {
      //Adds to the Title:
      noteTitle += string[turns];
    }

    else {
      //Exits the Loop:
      break mainLoop;
    }

    turns++;
  }

  //Returns the Title:
  return noteTitle;
}

/* DATES FUNCTIONS */

//Dates Function:
function dates(string) {
  //Loop Variables:
  var dates = [];
  var turns = 0;

  //Loops through Array:
  mainLoop: while (turns < string.length) {
    //Checks the Case:
    if (string[turns] == "/" && turns != 0 
      && turns <= string.length-4) {
      //Checks the Case:
      if (!isNaN(string[turns-1]) && !isNaN(string[turns+1])
        && string[turns+2] == "/" && !isNaN(string[turns+3])) {
        //Sets the Dates:
        var date = 
          JSON.parse(string[turns-1]) + "-" + 
          JSON.parse(string[turns+1]) + "-" + 
          JSON.parse(string[turns+2]);
        dates.push(date);
      }
    }
    
    turns++;
  }

  //Returns the Dates:
  return dates;
}

//Check Dates Function:
function checkDates(dates) {
  //Gets the Current Date:
  var date = new Date();
  var month = date.getUTCMonth() + 1;
  var day = date.getUTCDay();
  var year = date.getUTCFullYear();
  var currentDate = month + "-" + day + "-" + year;

  //Loop Variables:
  var turns = 0;
  var alerts = 0;

  //Loops through Array:
  mainLoop: while (turns < dates.length) {
    //Checks the Case:
    if (dates[turns] == currentDate) {
      //Adds to the Dues:
      alerts++;
    }
    
    turns++;
  }

  //Returns the Alerts:
  return alerts;
}

/* CACHE DATA FUNCTIONS */

//Cache Data Get Function:
function getCacheData(id, read) {
  //Checks the Case:
  if (read) {
    //Returns the Data:
    return JSON.parse(localStorage.getItem(id));
  }

  else {
    //Returns the Data:
    return localStorage.getItem(id);
  }
}

//Cache Data Set Function:
function setCacheData(id, value, string) {
  //Checks the Case:
  if (string) {
    //Sets the Data:
    localStorage.setItem(id, JSON.stringify(value));
  }

  else {
    //Sets the Data:
    localStorage.setItem(id, value);
  }
}

//Clear Cache Data:
function clearCacheData() {
  //Clears Cache:
  localStorage.clear();
}

//Firebase Server Formatting Function:
function formatData(rawData) {
  //Replaces Info:
  var string = rawData.replace(/\\/g, "");
  var side = string.replace(/^./, "");
  var main = side.slice(0, -1);

  //Returns the String:
  return main;
}