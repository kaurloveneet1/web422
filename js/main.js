/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Loveneet Kaur
*  Student ID: 150002210
*  Date: January 31,2023
*
********************************************************************************/ 


var page=1;
var perPage=10;
var url='https://lively-bonnet-duck.cyclic.app/';

function loadMovieData(title=null){
    if(title){
        fetch(url+`api/movies?page=${page}&perPage=${perPage}&title=${title}`).then((res)=>{
            return res.json()
        }).then((data)=>{
            var pag = document.querySelector('.pagination');
            pag.classList.add("d-none");
            createMovieTable(data);
            setPageCount();
            createClickEventForRow();
            getPreviousPage();
            getNextPage();
            formSearchBtn();
            formClearBtn();
        })
    }else{
        fetch(url + `api/movies?page=${page}&perPage=${perPage}`).then((res) => {
            return res.json();
        }).then((data)=>{
            createMovieTable(data);
            setPageCount();
            createClickEventForRow();
            getPreviousPage();
            getNextPage();
            formSearchBtn();
            formClearBtn();
        })
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadMovieData();
});

function createTrElement(movieData) {
    let trElem = `${
        movieData.map(movie => (`
        <tr movie-id=${movie._id}>
            <td>${movie.year}</td>
            <td>${movie.title}</td>
            <td>${movie.plot ? movie.plot : 'N/A'}</td>
            <td>${movie.rated ? movie.rated : 'N/A'}</td>
            <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
        </tr>
        `)).join('')
    }`

    return trElem;
}

function createMovieTable(movieData) {
    let trElem = createTrElement(movieData);
    let tbody = document.querySelector('#moviesTable tbody');
    tbody.innerHTML = trElem;
}

function setPageCount() {
    document.querySelector('#current-page').innerHTML = page;
}

function createClickEventForRow() {
    let movieRows = document.querySelectorAll('tbody tr');
    movieRows.forEach(row => {
        row.addEventListener("click", () => {
            let movieID = row.getAttribute('movie-id');
            fetch(url + `/api/movies/${movieID}`).then((res) => {
                return res.json();
            }).then((movie) => {
                document.querySelector('.modal-title').innerHTML = movie.title;
                if (movie.poster) {
                    document.querySelector('.modal-body').innerHTML = `
                        <img class="img-fluid w-100" src= ${movie.poster}><br><br>
                        <strong>Directed By:</strong> ${movie.directors.join(', ')}<br><br>
                        <p>${movie.plot ? movie.plot : 'N/A'}</p>
                        <strong>Cast:</strong> ${movie.cast ? movie.cast.join(', ') : 'N/A'}<br><br>
                        <strong>Awards:</strong> ${movie.awards.text}<br>
                        <strong>IMDB Rating:</strong> ${movie.imdb.rating}
                        (${movie.imdb.votes} votes)`
                } 
                else {
                    document.querySelector('.modal-body').innerHTML = `
                        <strong>Directed By:</strong> ${movie.directors.join(', ')}<br><br>
                        <p>${movie.plot ? movie.plot : 'N/A'}</p>
                        <strong>Cast:</strong> ${movie.cast ? movie.cast.join(', ') : 'N/A'}<br><br>
                        <strong>Awards:</strong> ${movie.awards.text}<br>
                        <strong>IMDB Rating:</strong> ${movie.imdb.rating}
                        (${movie.imdb.votes} votes)`
                }

                let movieModal = new bootstrap.Modal(document.querySelector('#detailsModal'), {
                    backdrop: 'static',
                    keyboard: false
                });
                movieModal.show();
            })
        })
    })
}

function getPreviousPage() {
    let prev = document.querySelector('#previous-page');
    prev.addEventListener('click', () => {
        if (page > 1) {
            page -= 1;
            loadMovieData();
        }
    })
}

function getNextPage() {
    let next = document.querySelector('#next-page');
    next.addEventListener('click', () => {
        page += 1;
        loadMovieData();
    })
}

function formSearchBtn() {
    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        event.preventDefault();
        loadMovieData(document.querySelector('#title').value);
    });
}

function formClearBtn() {
    document.querySelector('#clearForm').addEventListener("click", () => {
        document.querySelector('#title').value = '';
        loadMovieData();
    })
}