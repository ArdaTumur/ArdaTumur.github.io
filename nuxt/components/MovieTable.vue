<script>
    export default{
    data() {[
        'name',
        'year',
        'imdb',
        'director'
    ]
}}
</script>

<template>
    <table>
        <tr>
            <th>Name</th>
            <th>Year</th>
            <th>IMDb</th>
            <th>Director</th>
        </tr>
        <tr v-for="x in data">
            <td>{{ x.name }}</td>
            <td>{{ x.year }}</td>
            <td>{{ x.imdb }}</td>
            <td>{{ x.director }}</td>
        </tr>
    </table>
</template>