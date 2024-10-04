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
    // console.log(loadedArticles);

    // Render Articles
    renderArticles(loadedArticles);

    // Render Categories
    renderCategories(loadedArticles);
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

// Landing Page rendering function
function renderLandingPage(lastPost) {
  let landingPageTitle = $("#landing-page-title");
  let landingPageDescription = $("#landing-page-description");
  let landingPageImg = $("#landing-page-img");

  landingPageTitle.text(lastPost.title);
  landingPageDescription.text(lastPost.contents);
  landingPageImg.attr("src", lastPost.imgUrl);
  $(".readmore-btn")
    .attr("data-bs-postid", lastPost.postID)
    .on("click", function (e) {
      e.preventDefault();

      // Add all articles to modal
      $(".modal-article-title").text(lastPost.title);
      $(".modal-text").text(lastPost.contents);
      $(".modal-img").attr("src", lastPost.imgUrl);
      $(".modal-published-date").text(lastPost.publishedDate);
      $(".modal-author").text(lastPost.author);
    });
}

// Categories will show from all the articles loaded
function renderCategories(articles) {
  // Get all categories
  let allCategories = articles.map((article) => article.category);

  // Get unique categories but added all post ( all categories ) in the first
  let uniqueCategories = ["All Posts", ...new Set(allCategories)];

  // Loop through unique categories
  uniqueCategories.forEach((category) => {
    // Create li
    let li = document.createElement("li");
    let categoryLink = document.createElement("a");

    categoryLink.textContent = category;
    categoryLink.classList.add(
      "nav-link",
      "text-black",
      "text-decoration-none"
    );
    li.appendChild(categoryLink);
    $("#categories-link").append(li);
  });
}

fetchAndRender();
