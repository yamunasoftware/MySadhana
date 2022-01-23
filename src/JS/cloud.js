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
var darkID = "dark";

//Data Variables:
var code = "";
var data = [[], []];
var dark = false;

/* CLOUD AUTH FUNCTIONS */

//Sign Up Function:
function signUp() {
  //Gets the Code, Sets the Cloud Data:
  var code = generateCode();
  database.collection(collectionName).doc(code).set({
    data: JSON.stringify(data),
    dark: JSON.stringify(dark)
  })
    .then(() => {
      //Sets the Cache Data:
      setCacheData(codeID, code, false);
      setCacheData(dataID, data, true);
      setCacheData(darkID, dark, true);

      //Shows the Dashboard:
      showDashboard();
      displayNotes();
      showLoginCode();
      showDark();
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
        data = JSON.parse(JSON.stringify(doc.data().data));
        dark = JSON.parse(JSON.stringify(doc.data().dark));

        //Sets the Cache Data:
        setCacheData(codeID, code, false);
        setCacheData(dataID, data, true);
        setCacheData(darkID, dark, true);

        //Shows the Dashboard:
        showDashboard();
        displayNotes();
        showLoginCode();
        showDark();
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
    var digit = Math.floor(Math.random() * 10);
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
      data: JSON.stringify(data),
      dark: JSON.stringify(dark)
    })
      .then(() => {
        //Sets the Cache Data:
        setCacheData(codeID, code, false);
        setCacheData(dataID, data, true);
        setCacheData(darkID, dark, true);

        //Sets the Dashboard:
        showDashboard();
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
        data = JSON.parse(JSON.stringify(doc.data().data));
        dark = JSON.parse(JSON.stringify(doc.data().dark));

        //Sets the Cache:
        setCacheData(dataID, data, true);
        setCacheData(darkID, dark, true);

        //Shows the Dashboard:
        showDashboard();
        displayNotes();
        showLoginCode();
        showDark();
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

//Display Notes Function:
function displayNotes() {
  //Checks the Case:
  if (getCacheData(dataID, false) != null) {
    //Loop Variables:
    data = getCacheData(dataID, true);
    var notesList = "";
    var turns = 0;

    //Loops through Array:
    mainLoop: while (turns < data[0].length) {
      //Sets the Notes List:
      notesList +=
        "<div class='padding'>" + data[0][turns] +
        "&nbsp; <button onclick='showNotes(" + turns + ");'> Open </button>" +
        "&nbsp; <button onclick='deleteNote(" + turns + ");'> Delete </button> </div>";

      turns++;
    }

    //Sets the HTML:
    document.getElementById('notes-list').innerHTML = notesList;
  }
}

//Add Note Function:
function addNote(name) {
  //Checks the Case:
  if (getCacheData(dataID, false) != null && name != "") {
    //Gets the Data:
    data = getCacheData(dataID, true);

    //Adds the Note:
    data[0].push(name);
    data[1].push("");

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

    //Deletes the Note:
    data[0].splice(index, 1);
    data[1].splice(index, 1);

    //Sends the Data:
    setCacheData(dataID, data, true);
    sendData();
    displayNotes();
  }
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

//Remove Cache Data Function:
function removeCacheData(id) {
  //Removes Data:
  localStorage.removeItem(id);
}

//Clear Cache Data:
function clearCacheData() {
  //Clears Cache:
  localStorage.clear();
}