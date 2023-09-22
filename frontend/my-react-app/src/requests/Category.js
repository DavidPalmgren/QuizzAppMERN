
async function logMovies() {
    const response = await fetch("https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/categories");
    const categories = await response.json();
    console.log(categories);
}

export default logMovies()