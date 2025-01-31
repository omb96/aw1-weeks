'use strict';

const starEmpty = '<svg class="empty-star" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16"> <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/></svg> ';
const starFilled = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg> ';
const deleteIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>'


function Film(id, title, isFavorite = false, watchDate = '', rating = 0) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    // saved as dayjs object
    this.watchDate = watchDate && dayjs(watchDate);

    // Filters
    this.isFavorite = () => { return this.favorite; }
    this.isBestRated = () => { return this.rating === 5; }

    this.isSeenLastMonth = () => {
        if (this.watchDate == '') return false;    // no watchdate
        const diff = this.watchDate.diff(dayjs(), 'month')
        const ret = diff <= 0 && diff > -1;      // last month
        return ret;
    }

    this.isUnseen = () => {
        if (this.watchDate == '') return true;     // no watchdate
        else return false;
    }

    this.toString = () => {
        return `Id: ${this.id}, ` +
            `Title: ${this.title}, Favorite: ${this.favorite}, Score: ${this.formatRating()}, ` +
            `watchDate: ${this.formatWatchDate('YYYY-MM-DD')}`;
    }

    this.formatWatchDate = (format) => {
        return this.watchDate ? this.watchDate.format(format) : '';
    }

    this.formatRating = () => {
        return this.rating ? this.rating : '<not assigned>';
    }
}

function FilmLibrary() {
    this.list = [];

    this.add = (film) => {
        if (!this.list.some(f => f.id == film.id))
            this.list = [...this.list, film];
        else throw new Error('Duplicate id');
    };

    this.delete = (id) => {
        this.list = this.list.filter(f => f.id != id);
    }

    this.filterAll = () => {
        // Using "filter" method we return a copy of the list, not the list itself.
        return this.list.filter(() => true);
    }

    this.filterByFavorite = () => {
        return this.list.filter((film) => film.isFavorite());
    }

    this.filterByBestRated = () => {
        return this.list.filter((film) => film.isBestRated());
    }

    this.filterBySeenLastMonth = () => {
        return this.list.filter((film) => film.isSeenLastMonth());
    }

    this.filterByUnseen = () => {
        return this.list.filter((film) => film.isUnseen());
    }

}

function createFilmNode(film) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.id = "film" + film.id;

    // creating a higher <div>
    const div = document.createElement('div');
    div.className = 'd-flex w-100 justify-content-between';

    // creating a <span> for delete icon and title
    const firstSpan = document.createElement('span');
    firstSpan.className = 'text-start col-md-5 col-3';

    // creating delete icon
    const deleteRow = document.createElement('a');
    deleteRow.insertAdjacentHTML("beforeend", deleteIcon);
    deleteRow.className = 'me-2 delete-icon';
    deleteRow.setAttribute('href', '#');
    // deleteRow.dataset.filmId = film.id;
    firstSpan.appendChild(deleteRow);

    // creating a <p> for the title
    const p = document.createElement('p');
    p.className = 'd-inline';
    if (film.isFavorite())
        p.className += ' favorite ';
    p.innerText = film.title;
    firstSpan.appendChild(p);
    div.appendChild(firstSpan);

    // creating a "inner" <span> for the checkbox and the 'Favorite' label
    const span = document.createElement('span');
    span.className = 'custom-control custom-checkbox col-md-1 col-3';
    span.style.whiteSpace = 'nowrap';
    span.id = 'fav_check' + film.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'custom-control-input';
    checkbox.id = "check-f" + film.id;
    checkbox.checked = film.isFavorite();
    span.appendChild(checkbox);

    const label = document.createElement('label');
    label.className = 'custom-control-label';
    label.innerHTML = '&nbsp;Favorite';
    label.htmlFor = "check-f" + film.id;
    span.appendChild(label);
    div.appendChild(span);

    // creating a <small> element for the date
    const data_text = document.createElement('small');
    data_text.className = 'watch-date col-md-3 col-3';
    data_text.innerText = film.formatWatchDate('MMMM D, YYYY');
    div.appendChild(data_text);

    // creating a <span> for the rating stars
    const ratingSpan = document.createElement('span');
    ratingSpan.className = 'rating text-end col-md-3 col-3';
    for (let i = 0; i < 5; i++) {
        const star = (i < film.rating) ? starFilled : starEmpty;
        ratingSpan.insertAdjacentHTML("beforeend", star);
    }
    div.appendChild(ratingSpan);

    // adding the external <div> to the <li> before returning it
    li.appendChild(div);
    return li;
}

function createListFilms(films) {
    const listFilms = document.getElementById("list-films");
    for (const film of films) {
        const filmNode = createFilmNode(film);
        listFilms.appendChild(filmNode);
    }
}

function clearListFilms() {
    const listFilms = document.getElementById("list-films");
    listFilms.innerHTML = '';
}

function filterFilms(filterID, filterTitle, filter_func) {

    // if called without parameters, repeat last used filter
    if (!filterID) ({ filterID, filterTitle, filter_func } = filterFilms.currentFilter);

    document.querySelectorAll('#left-sidebar div a ').forEach(x => x.classList.remove('active'));
    document.getElementById("filter-title").innerText = filterTitle;
    document.getElementById(filterID).classList.add('active');

    clearListFilms();
    createListFilms(filter_func());

    // register delete event handler for each film item
    document.querySelectorAll(".delete-icon").forEach(item => item.addEventListener('click', event => {
        const filmId = event.currentTarget.parentElement.parentElement.parentElement.id
            .slice('film'.length);
        filmLibrary.delete(filmId);
        filterFilms();
        event.preventDefault();
    }));

    // remember last used filter
    filterFilms.currentFilter = { filterID, filterTitle, filter_func };

    document.querySelectorAll("input").forEach(x => x.addEventListener('change', event => {
        if (x.checked){
            x.parentElement.previousElementSibling.lastChild.style.color = "red";
        }
        else
            x.parentElement.previousElementSibling.lastChild.style.color = "black";
    }))
}

/*MAIN*/
const filmLibrary = new FilmLibrary();
FILMS.forEach(f => { filmLibrary.add(new Film(...f)); })
filterFilms('filter-all', 'All', filmLibrary.filterAll);

document.getElementById("filter-all").addEventListener('click', event => {
    filterFilms('filter-all', 'All', filmLibrary.filterAll)
});

document.getElementById("filter-favorites").addEventListener('click', event => {
    filterFilms('filter-favorites', 'Favorites', filmLibrary.filterByFavorite);
})

document.getElementById("filter-best").addEventListener('click', event => {
    filterFilms('filter-best', 'Best', filmLibrary.filterByBestRated);
})

document.getElementById("filter-seen-last-month").addEventListener('click', event => {
    filterFilms('filter-seen-last-month', 'Seen Last Month', filmLibrary.filterBySeenLastMonth);
})

document.getElementById('filter-unseen').addEventListener('click', event => {
    filterFilms('filter-unseen', 'Unseen', filmLibrary.filterByUnseen);
})

