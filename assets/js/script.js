let loadedArticles = [];

// Navbar collapse function
(() => {
  "use strict";

  document
    .querySelector("#navbarSideCollapse")
    .addEventListener("click", () => {
      document.querySelector(".offcanvas-collapse").classList.toggle("open");
    });
})();

// Fetch and return data
async function fetchData(url) {
  try {
    let response = await fetch(url);
    let data = response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

// Async that fetch the data from json file and display it
async function fetchAndRender() {
  try {
    // Fetch Articles from the json file
    loadedArticles = await fetchData("assets/data/articles.json");
    console.log(loadedArticles);

    // Render Articles
    renderArticles(loadedArticles);
  } catch (error) {
    console.log(error);
  }
}
// Render All Articles Landing Page and Cards
function renderArticles(articles) {
  // Need last page for landing page
  const lastArticle = articles[articles.length - 1];

  // Use Landing Page Function
  renderLandingPage(lastArticle);
}

function renderLandingPage(lastPost) {
  let landingPageTitle = $("#landing-page-title");
  let landingPageDescription = $("#landing-page-description");
  let landingPageImg = $("#landing-page-img");

  landingPageTitle.text(lastPost.title);
  landingPageDescription.text(lastPost.contents);
  landingPageImg.attr("src", lastPost.imgUrl);
}

fetchAndRender();
