<template>
  <div style="text-align: center;">
      <h1 id="mainHead">CRYPTO PAPER PORTFOLIO</h1>
      <div id="firebaseui-auth-container"></div>
      <div id="pagecontent">
          Crypto Paper Portfolio (CPP) is an app to track your crypto portfolio. <br>
          Enter coin details and get real time Profit and Loss update of your Portfolio.
      </div>
      <h5>copyright@cpp-2024</h5>
  </div>
</template>

<script>
import firebase from '@/uifire.js'
import 'firebase/compat/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export default {
  name: "Login",

  mounted() {
      var ui = firebaseui.auth.AuthUI.getInstance();
      if (!ui) {
          ui = new firebaseui.auth.AuthUI(firebase.auth());
      }

      var uiConfig = {
          signInSuccessUrl: '/home',
          signInOptions: [
              firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              firebase.auth.EmailAuthProvider.PROVIDER_ID,
          ]
      };

      ui.start('#firebaseui-auth-container', uiConfig)
  }
}
</script>