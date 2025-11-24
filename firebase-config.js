// Firebase設定
const firebaseConfig = {
    apiKey: "AIzaSyDqgPcKyZQopKiAYf56fIwL4hm88NU4BTM",
    authDomain: "pokemon-unite-regi.firebaseapp.com",
    databaseURL: "https://pokemon-unite-regi-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pokemon-unite-regi",
    storageBucket: "pokemon-unite-regi.firebasestorage.app",
    messagingSenderId: "722185262352",
    appId: "1:722185262352:web:799da7f833f63d80388195"
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const regiDataRef = database.ref('regi-data');

console.log('🔥 Firebase初期化完了');
