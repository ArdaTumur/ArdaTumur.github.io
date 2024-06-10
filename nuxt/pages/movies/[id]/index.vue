<script setup>
import { onMounted } from "vue";
import { fetchApi } from "~/utils/fetchApi"


let movies = ref({
    name: null,
    year: null,
    imdb: null,
    director: null
})
let id = null
onMounted(async () => {
    id = window.location.pathname.split("/")[2]
    let boncuk = await fetchApi("/boncuk/" + id, "get", id);
    movies.value = boncuk.data;
})
async function updateButtonClicked() {

    await fetchApi("/boncuk/" + id, "patch", {
        ...movies.value
    })
    await navigateTo("http://localhost:3000/movies", { external: true })
}
</script>

<template>
    <div class="modalUpdate">
        <div>
            Name:<br>
            <input type="text" name="name" placeholder="Enter Name" v-model="movies.name"><br><br>
            Year:<br>
            <input type="text" name="year" placeholder="Enter Year" v-model="movies.year"><br><br>
            IMDb:<br>
            <input type="text" name="imdb" placeholder="Enter imdb" v-model="movies.imdb"><br><br>
            Director:<br>
            <input type="text" name="director" placeholder="Enter Director" v-model="movies.director"><br><br>
            <input type="button" value="update" @click="updateButtonClicked()">
        </div>
    </div>

</template>

<style>
.modalUpdate {
    color: black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    height: 100vh;
    font-size: large;
}
</style>