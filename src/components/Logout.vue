<template>
  <button id="btn" @click="signOut()" v-if="user">Logout</button>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default {
  name: "Logout",
  props: ["user"],
  methods: {
    signOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Logout Error:", error);
        });
    },
  },
};
</script>

<style scoped>
#btn {
  background-color: #f44336; /* Red */
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  margin-top: 20px;
}

#btn:hover {
  border-color: rgb(255, 94, 0);
  box-shadow: 3px 3px grey;
  background-color: #d32f2f;
}
</style>
