<script setup>
import { fetchApi } from "~/utils/fetchApi"
async function whenClicked() {
    localStorage.removeItem("token")
    await fetchApi("/logout", "delete", null);
    await navigateTo("http://localhost:3000/login", { external: true })
}
</script>

<template>
    <div class="center">
        <div>
            <input type="submit" value="submit" @click="whenClicked()">
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