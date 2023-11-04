//declarações e constantes
const apiKey = "3541f977a93e71f2211018809a1d592c"
const imgApi = "https://image.tmdb.org/t/p/w1280"
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`
const form = document.querySelector('#search-form')
const query =  document.querySelector('#search-input')
const result = document.querySelector('#result')

let page = 1
let isSearching = false

//fetch JSON data from url
async function fetchData(url) {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error("Não houve resposta")
        }
        return await response.json()
    } catch(error) {
        return null
    }
}

//fetch and show results
async function fetchAndShowResult(url) {
    const data = await fetchData(url)
    if (data && data.results) {
        showResults(data.results)
    }
}

//create movie card
function createMovieCard(movie) {
    const {poster_path, original_title, release_date, overview} = movie
    const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg"
    const truncatedTitle = original_title.length > 15 ? original_title.slice(0, 15) + "..." : original_title
    const formattedDate = release_date || "No release date"
    const cardTemplate = `
        <div class="column">
            <div class="card">
                <a class="card-media" href="./img-01.jpeg">
                    <img src="${imagePath}" alt="${original_title}" width="100%" />
                </a>
                <div class="card-content">
                    <div class="card-header">
                        <div class="left-content">
                            <h3 style="font-weight="600"> ${truncatedTitle} </h3>
                            <span style="color: #12efec"> ${formattedDate} </span>
                        </div>
                        <div class="right-content">
                            <a href="${imagePath}" target="_blank" class="card-btn">Painel</a>
                        </div>
                    </div>
                    <div class="info">
                        ${overview || "Sem descrição ainda..."}
                    </div>
                </div>
            </div>
        </div>
    `
    return cardTemplate
}

//clear result element for search
function clearResults() {
    result.innerHTML = ""
}

//Show results in page
function showResults(item) {
    const newContent = item.map(createMovieCard).join("")
    console.log(item)
    result.innerHTML += newContent || "<p>Nenhum resultado encontrado</p>"
}

//load more results
async function loadMoreResults() {
    if(isSearching) {
        return
    }
    page++
    const searchTerm = query.value
    const url = searchTerm ? `${searchUrl}${searchTerm}&page=${page}&language=pt` : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}&language=pt`
    await fetchAndShowResult(url)
}

//detect end of page and load more results
function detectEnd() {
    const {scrollTop, clientHeight, scrollHeight} = document.documentElement
    if(scrollTop + clientHeight >= scrollHeight - 20) {
        loadMoreResults()
    }
}

//handle search
async function handleSearch(e) {
    e.preventDefault()
    const searchTerm = query.value.trim()
    if(searchTerm) {
        isSearching = true
        clearResults()
        const newUrl = `${searchUrl}${searchTerm}&page=${page}&language=pt`
        await fetchAndShowResult(newUrl)
        query.value = ""
    }
}

//event listeners
form.addEventListener('submit', handleSearch)
window.addEventListener('scroll', detectEnd)
window.addEventListener('resize', detectEnd)

//initialize the page
async function init(){
    clearResults()
    const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}&language=pt`
    isSearching = false
    await fetchAndShowResult(url)
}

init()
