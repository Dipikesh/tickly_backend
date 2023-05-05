const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const {firebaseConfig}  = require("../config/firebase.js");


//Initialize a firebase application
initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();


exports.uploadQRCode = async (bufferData) => {
        try {
                 const dateTime = giveCurrentDateTime();
                const names = "file_01"; 
                 const storageRef = ref(
                   storage,
                   `files/${names + "       " + dateTime}`
                 );

                 // Create file metadata including the content type
                 const metadata = {
                   contentType: 'png',
                 };

                 // Upload the file in the bucket storage
                 const snapshot = await uploadBytesResumable(
                   storageRef,
                   bufferData,
                   metadata
                 );
                 //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

                 // Grab the public url
                const downloadURL = await getDownloadURL(snapshot.ref);
                console.log(downloadURL);
                return downloadURL;

        }
        catch (err) {
                console.log(err);
                throw err;
        }
}

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};