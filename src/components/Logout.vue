<template>
  <button id="btn" @click="signOut()" v-if="user">Logout</button>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";

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
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
  transition: background-color 0.3s ease, color 0.3s ease,
    box-shadow 0.3s ease-in-out;
  padding: 10px 20px;
  margin-top: 20px;
}

#btn:hover {
  border-color: rgb(255, 94, 0);
  box-shadow: 3px 3px grey;
  background-color: #ba2a2a;
}
</style>
