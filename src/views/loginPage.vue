<template>
  <div class="login-container" style="text-align: center">
    <div class="word-container">
      <h1 id="mainHead">Welcome to BudgetBuddy</h1>
      <div id="firebaseui-auth-container"></div>
      <div id="pagecontent">
        BudgetBuddy is an app to track your budgets and expenditures. <br />
        Feel free to explore our application!
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "@/uifire.js";
import "firebase/compat/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import "firebase/compat/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default {
  name: "loginPage",

  mounted() {
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());
    const db = getFirestore();

    const uiConfig = {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: async (authResult) => {
          console.log("Auth result:", authResult);
          const userDocRef = doc(db, "users", authResult.user.uid);
          console.log("Document Reference:", userDocRef);

          const docSnap = await getDoc(userDocRef);
          console.log("Document Snapshot Exists:", docSnap.exists());
          console.log("Document Data:", docSnap.data());

          if (authResult.additionalUserInfo.isNewUser || !docSnap.exists()) {
            console.log("Setting new user data...");
            setDoc(
              userDocRef,
              {
                email: authResult.user.email,
                createdAt: new Date(),
              },
              { merge: true }
            )
              .then(() => {
                console.log("New user data set successfully.");
                this.$router.push("/dashboardPage");
              })
              .catch((error) => {
                console.error("Error initializing user data:", error);
              });
          } else {
            console.log("User already exists, checking for missing email...");
            if (!docSnap.data().email) {
              console.log("Updating email...");
              updateDoc(userDocRef, {
                email: authResult.user.email,
              })
                .then(() => {
                  console.log("Email updated successfully.");
                  this.$router.push("/dashboardPage");
                })
                .catch((error) => {
                  console.error(
                    "Error updating user data for new features:",
                    error
                  );
                });
            } else {
              console.log("Redirecting to dashboard...");
              this.$router.push("/dashboardPage");
            }
          }
          return false;
        },
      },
    };

    ui.start("#firebaseui-auth-container", uiConfig);
  },
};
</script>

<style scoped>
#firebaseui-auth-container {
  margin-top: 50px;
  margin-bottom: 50px;
}

#pagecontent {
  height: 100px;
  font-size: larger;
  font-weight: bolder;
  text-align: center;
  padding: 10px;
}

#mainHead {
  text-align: center;
  text-shadow: 2px 2px grey;
}

#bg {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}



h5 {
  text-align: center;
  background-color: rgb(194, 202, 188);
}
.word-container {
  position: relative;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
  z-index: 2;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%; /* This ensures they take the full height of the viewport */
  width: 100%; /* This ensures they take the full width of the viewport */
  overflow: hidden; /* Prevents scrollbars from affecting the layout */
}

/* Ensure that the .login-container covers the entire screen */
.login-container {
  background-image: url(../assets/background.jpeg);
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; /* Changed from 'absolute' to 'fixed' to ensure it's relative to the viewport */
  top: 0; /* Aligns the container to the top edge of the viewport */
  left: 0; /* Aligns the container to the left edge of the viewport */
}
.login-container::before {
  content: ''; /* Required for pseudo-elements */
  position: absolute; /* Position the pseudo-element */
  top: 0;
  left: 0;
  width: 100%; /* Cover the entire container */
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Grey color with opacity */
  z-index: 1; /* Ensure the overlay is behind other content */
}
</style>
