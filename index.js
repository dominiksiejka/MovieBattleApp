const API = "https://www.omdbapi.com/";
const autoCompleteConfig = {
  renderOption(movie) {
    const imgSRC = movie.Poster === "N/A" ? "" : movie.Poster;
    return `<img src="${imgSRC} alt="picture ilustrating the movie" /> ${movie.Title} (${movie.Year})`;
  },
  inputVal(movie) {
    return movie.Title;
  },
  async getData(title) {
    const response = await axios.get(API, {
      params: {
        apikey: "99a48243",
        s: title,
      },
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};
autoComplete({
  ...autoCompleteConfig,
  autocomplete: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    getNewMovie(movie, document.querySelector("#right-summary"), "right");
  },
});
autoComplete({
  ...autoCompleteConfig,
  autocomplete: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    getNewMovie(movie, document.querySelector("#left-summary"), "left");
  },
});
let rightMovie;
let leftMovie;
const getNewMovie = async (movie, summaryElement, side) => {
  const response = await axios.get(API, {
    params: {
      apikey: "99a48243",
      i: movie.imdbID,
    },
  });
  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === "right") {
    rightMovie = response.data;
  } else {
    leftMovie = response.data;
  }

  if (rightMovie && leftMovie) {
    comparisonMovie();
  }
};
const comparisonMovie = () => {
  const leftSide = document.querySelectorAll("#left-summary .notification");
  const rightSide = document.querySelectorAll("#right-summary .notification");
  leftSide.forEach((leftStat, index) => {
    const rightStat = rightSide[index];
    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue < leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};
const movieTemplate = (movieDetail) => {
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.split(",").join(""));
  const awardss = movieDetail.Awards.split(" ").reduce((total, current) => {
    const value = parseInt(current);
    if (isNaN(value)) {
      return total;
    } else {
      return total + value;
    }
  }, 0);

  return `
  <article class='media'>
  <figure class='media-left'>
<p class="image">
<img src="${movieDetail.Poster}" alt='Picture ilustrating the film'/>

</p>

  </figure>
  <div class='media-content'>
  <div class='content'>
  <h1>${movieDetail.Title}</h1>
  <h4>${movieDetail.Genre}</h4>
  <p>${movieDetail.Plot}</p>
  </div>
  
  </div>
  
  </article>
  <article data-value=${awardss} class="notification is-primary">
  <p class="title">${movieDetail.Awards}</p>
  <p class="subtitle">Awards</p>
  </article>
  <article class="notification is-primary">
  <p class="title">${movieDetail.BoxOffice}</p>
  <p class="subtitle">Box Office</p>
  </article>
  <article data-value=${metascore} class="notification is-primary">
  <p class="title">${movieDetail.Metascore}</p>
  <p class="subtitle">Metascore</p>
  </article>
  <article data-value=${imdbRating} class="notification is-primary">
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">IMDB Rating</p>
  </article>
  <article data-value=${imdbVotes} class="notification is-primary">
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">IMDB Votes</p>
  </article>
  `;
};
