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
//import firebase from 'firebase/app'
import "firebase/compat/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "loginPage",

  mounted() {
    var ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    console.log("runs");
    var uiConfig = {
      signInSuccessUrl: "/dashboardPage",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
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
.word-container {
  position: relative;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
  z-index: 2;
}
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
  position: absolute;
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
