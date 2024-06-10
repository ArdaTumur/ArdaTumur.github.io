<script setup>
import axios from "axios";

let users = ref({
    name: null,
    surname: null,
    email: null,
    phone: null,
    password: null,
    rePassword: null
})

async function whenClicked() {
    await axios.post('http://localhost:3001/register', {
        name: users.value.name,
        surname: users.value.surname,
        email: users.value.email,
        phoneNum: users.value.phone,
        password: users.value.password,
        rePassword: users.value.rePassword
    })
}

</script>

<template>
    <div class="center">
        <div>
            Name:<br>
            <input type="text" name="name" placeholder="Enter Name" v-model="users.name"><br><br>
            Surname:<br>
            <input type="text" name="surname" placeholder="Enter Surname" v-model="users.surname"><br><br>
            Email:<br>
            <input type="email" name="email" placeholder="Enter Email" v-model="users.email"><br><br>
            Phone Number:<br>
            <input type="text" name="phoneNum" placeholder="Enter Phone Number" v-model="users.phone"><br><br>
            Password:<br>
            <input type="password" name="password" placeholder="Enter Password" v-model="users.password"><br><br>
            Password Confirm:<br>
            <input type="password" name="password" placeholder="Enter Password" v-model="users.rePassword"><br><br>
            <input type="submit" value="submit" @click="whenClicked">
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