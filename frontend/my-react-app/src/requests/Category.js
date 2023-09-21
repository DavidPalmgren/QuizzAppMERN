
async function logMovies() {
    const response = await fetch("http://localhost:4040/api/categories");
    const categories = await response.json();
    console.log(categories);
}

export default logMovies()