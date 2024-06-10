<script setup>
import { onMounted } from "vue";
import { fetchApi } from "~/utils/fetchApi"
let movieList = ref(null);
let movies = ref({
    name: null,
    year: null,
    imdb: null,
    director: null,
})
var updateId = null;
var modalOpen = ref(false);
var modalUpdateOpen = ref(false);
function openModalUpdate(name, year, imdb, director, id) {
    movies.value.name = name;
    movies.value.year = year;
    movies.value.imdb = imdb;
    movies.value.director = director
    updateId = id
    modalUpdateOpen.value = true;
}
function closeModalUpdate() {
    movies.value.name = null;
    movies.value.year = null;
    movies.value.imdb = null;
    movies.value.director = null;
    modalUpdateOpen.value = false;
}
function openModal() {
    modalOpen.value = true
}
function closeButton() {
    updateId = null;
    modalOpen.value = false;
}
onMounted(async () => {
    document.getElementById("modalUpdateBody").addEventListener("click", function (event) {
        event.stopPropagation()
    })
    document.getElementById("boncuk").addEventListener("click", function (event) {
        event.stopPropagation()
    });
    await getMovies()
})


let response;
async function getMovies() {
    response = await fetchApi('/movies', "get", null);
    movieList.value = response.data
}
async function whenClicked() {
    let newMovie = await fetchApi('/movies', "post", {
        name: movies.value.name,
        year: movies.value.year,
        imdb: movies.value.imdb,
        director: movies.value.director
    })

    movies.value = {
        name: null,
        year: null,
        imdb: null,
        director: null
    }
    if (newMovie.error) { return }

    movieList.value.push(newMovie.data)
}

async function sortTable(sortBy, sortOrder) {
    response = await fetchApi(`/movies?sortBy=${sortBy}&sortOrder=${sortOrder}`, "get",);
    movieList.value = response.data
}

async function deleteItem(movieName) {
    await fetchApi("/movies", "delete", movieName);
    await getMovies()
}
async function updateItem(movieId) {
    await fetchApi("/boncuk/" + movieId, "patch", {
        ...movies.value
    })
    closeModalUpdate();
    getMovies();
}

</script>

<template>
    <div id="openModalRow">
        <input type="button" id="openModalButton" value="Create Movie" class="button" @click="openModal()">
    </div>
    <div class="modal" v-show="modalOpen" @click="closeButton()">
        <div class="boncuk" id="boncuk">
            <h2>Create Movie
                <input type="button" value="X" id="boncukiye" @click="closeButton()"><br>
            </h2>
            <p class="modalFirstRow">Name:</p>
            <input type="text" class="modalInputs" name="name" placeholder="Enter Name" v-model="movies.name"><br>
            <p>Year:</p>
            <input type="text" class="modalInputs" name="year" placeholder="Enter Year" v-model="movies.year"><br>
            <p>IMDb Score:</p>
            <input type="text" class="modalInputs" name="imdb" placeholder="Enter IMDB Score" v-model="movies.imdb"><br>
            <p>Director:</p>
            <input type="text" class="modalInputs" name="director" placeholder="Enter Director"
                v-model="movies.director"><br>
            <input type="submit" value="submit" id="submitModalButton" class="button" @click="whenClicked()">
        </div>
    </div>
    <div class="modalUpdate" v-show="modalUpdateOpen" @click="closeModalUpdate()">
        <div id="modalUpdateBody">
            <h2>Update Movie</h2>
            <p class="modalFirstRow">Name:</p>
            <input type="text" class="modalInputs" name="name" placeholder="Enter Name" v-model="movies.name"><br>
            <p>Year:</p>
            <input type="text" class="modalInputs" name="year" placeholder="Enter Year" v-model="movies.year"><br>
            <p>IMDb:</p>
            <input type="text" class="modalInputs" name="imdb" placeholder="Enter imdb" v-model="movies.imdb"><br>
            <p>Director:</p>
            <input type="text" class="modalInputs" name="director" placeholder="Enter Director"
                v-model="movies.director"><br>
            <input type="button" value="update" id="submitModalUpdateButton" class="button"
                @click="updateItem(updateId)">
        </div>
    </div>
    <div class="center">
        <table id="Movies">
            <tr>
                <th>Name</th>
                <th>Year</th>
                <th>IMDb</th>
                <th>Director</th>
                <th class="deleteColumn">delete</th>
                <th>update</th>
            </tr>

            <tr v-for="x in movieList">
                <td> {{ x.name }} </td>
                <td> {{ x.year }} </td>
                <td> {{ x.imdb }} </td>
                <td> {{ x.director }} </td>
                <td><input type="button" class="button" value="delete" @click="deleteItem({ name: x.name })"></td>
                <td><input type="button" class="button" value="update"
                        @click="openModalUpdate(x.name, x.year, x.imdb, x.director, x._id)"></td>
            </tr>
            <tr>
                <td class="sortButton"><input type="button" id="sortName" class="button" value="sort"
                        @click="() => sortTable('name', -1)">
                </td>
                <td class="sortButton"><input type="button" id="sortYear" class="button" value="sort"
                        @click="() => sortTable('year', -1)">
                </td>
                <td class="sortButton"><input type="button" id="sortImdb" class="button" value="sort"
                        @click="() => sortTable('imdb', -1)">
                </td>
                <td class="sortButton"><input type="button" id="sortDirector" class="button" value="sort"
                        @click="() => sortTable('director', -1)"></td>
                <td class="sortButton"></td>
                <td class="sortButton"></td>
            </tr>
        </table>
    </div>
</template>

<style>
#modalUpdateBody {
    width: 400px;
    background-color: #f2f2f2;


}

.modalFirstRow {
    border-top: 1px solid;
    padding-top: 20px;
}

p {
    text-align: left;
    padding-left: 10%;
}

#openModalRow {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

#submitModalButton {
    background-color: rgb(219, 161, 13);
    border-radius: 4px;
    margin-left: 60%;
    margin-right: 10%;
    width: 30%;
    margin-bottom: 10px;
}

#submitModalUpdateButton {
    background-color: rgb(219, 161, 13);
    border-radius: 4px;
    margin-left: 60%;
    margin-right: 10%;
    width: 30%;
    margin-bottom: 10px;
}

#openModalButton {
    background-color: rgb(242, 242, 242);
    border-radius: 10px;
}

.modalUpdate {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.4);
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.modal {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.4);
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center
}

.modalInputs {
    border-radius: 3px;
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 10%;
}

.boncuk {
    width: 400px;
    color: black;
    background-color: whitesmoke;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

h2 {
    width: 87%;
    margin-left: 10%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    text-align: start;
}

#boncukiye {
    margin-left: 52%;
    border-style: none;
    font-size: 20px;
}

.sortButton {
    border-top: solid;
    border-color: rgb(0, 175, 175);
}

body {
    height: 966px;
    background-image: url("/home/sensemore/Downloads/594600.jpg");
    background-repeat: no-repeat;
    background-attachment: fixed;
}

.button {
    border-style: none;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
}

.center {
    color: black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: large;
    height: 100vb;
    margin-top: 0;
    margin-left: 0;
    padding: 20px
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}

tr:nth-child(odd) {
    background-color: rgba(150, 150, 150, 0.4);
    color: rgb(0, 175, 175);
}

table {
    margin-left: 500px;
    margin-right: 500px;
    border: none;
    border-collapse: collapse;
    background-color: #f2f2f2;
}

th {
    background-color: rgb(0, 139, 139);
    color: #f2f2f2;
}
</style>