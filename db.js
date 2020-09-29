require("dotenv").config();
const firebase = require("firebase");

var firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_DATABASEURL,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENTID,
};

firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const database = firebase.database();

const data = {
  registerWin: async function (victory) {
    const initialRegister = {
      total: 1,
      theskeld: 0,
      mirahq: 0,
      polus: 0,
    };
    initialRegister[victory.map] = initialRegister[victory.map] + 1;
    const reference = database.ref(
      `servers/${victory.serverID}/${victory.mode}/${victory.impostorsKey}`
    );
    await database
      .ref(reference)
      .once("value")
      .then(async function (db) {
        if (db.val() == null) {
          database.ref(reference).set(initialRegister);
        } else {
          database.ref(reference).update({
            [victory.map]: db.val()[victory.map] + 1,
            total: db.val().total + 1,
          });
        }
      });
    // getImpostors(victory, msg);
  },
  rankImpostors: async function (impostorsKey, serverID, mode) {
    console.log("Rank de impostores", impostorsKey, "- servidor: ", serverID);
    const reference = database.ref(
      `servers/${serverID}/${mode}/${impostorsKey}`
    );
    const snapshot = await database.ref(reference).once("value");
    var vit = {
      total: 0,
    };
    snapshot.forEach(data => {
      if (data.key === "total") return;
      vit[data.key] = data.val();
      console.log(data.key, data.val());
      vit.total += data.val();
    });
    return vit;
  },
  rankMode: async function (serverID, mode) {
    console.log("Rank de modo: ", mode, "- servidor: ", serverID);
    var top = [];
    const reference = database.ref(`servers/${serverID}/${mode}`);

    const snapshot = await database
      .ref(reference)
      .orderByChild("total")
      .limitToLast(3)
      .once("value");

    snapshot.forEach(i => {
      top.push([i.key, i.val().total]);
    });
    return top;
  },
};

module.exports = data;
