<script setup>
import axios from "axios";
let users = ref({
    email: null,
    password: null,
})
let token = null;
let isLoggedIn = ref(null);
async function whenClicked() {
    const data = await axios.post('http://localhost:3001/login', {
        email: users.value.email,
        password: users.value.password
    })
    if (data.data.token != null) {
        isLoggedIn.value = true;
        token = data.data.token;
        localStorage.setItem("token", token)
        await navigateTo("http://localhost:3000/movies", { external: true })
    } else {
        isLoggedIn.value = false;
    }
}
</script>

<template>
    <div class="center">
        <div>
            Email:<br>
            <input type="text" name="email" placeholder="Enter Email" v-model="users.email"><br><br>
            Password:<br>
            <input type="password" name="password" placeholder="Enter Password" v-model="users.password"><br><br>
            <input type="submit" value="submit" @click="whenClicked()">
            <p v-show="isLoggedIn">
                Login Succesful
            </p>
            <p v-show="isLoggedIn == false">
                Failed to login
            </p>
        </div>
    </div>
</template>

<style scoped>
.center {
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    height: 100vb;
}
</style>