<template>
  <div style="text-align: center">
    <h1 id="mainHead">Welcome to BudgetBuddy</h1>
    <div id="firebaseui-auth-container"></div>
    <div id="pagecontent">
      BudgetBuddy is an app to track your budgets and expenditures. <br />
      Feel free to explore our application!
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
</style>
