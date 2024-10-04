let loadedArticles = [];
const articlesPerPage = 6;
let currentPage = 1;

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

  // Render Article Cards
  renderArticleCard(articles);
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

// Article Post Card function
function renderArticleCard(articles) {
  // Count to show limit 6 posts per page
  let start = (currentPage - 1) * articlesPerPage;
  let end = Math.min(start + articlesPerPage, articles.length);

  let cardTopLevelContainer = $("#card-group");

  // Clear leftover cards
  if (currentPage == 1) {
    cardTopLevelContainer.innerHTML = "";
  }

  // Loop through articles
  for (let i = start; i < end; i++) {
    let article = articles[i];
    console.log(article);

    // Create cards
    let cardGrid = $("<div>").addClass("col");
    let cardContainer = $("<div>").addClass("card shadow-sm p-2");
    let cardBody = $("<div>").addClass("card-body");

    // Create Image
    let img = $("<img>")
      .attr("src", article.imgUrl)
      .addClass("rounded object-fit-cover");
    console.log(img);

    // Create Title
    let title = $("<h5>")
      .text(article.title)
      .addClass("card-title text-nowrap");
    // let author = $("<p>")
    //   .text(`${article.author}`)
    //   .addClass("text-primary author");
    let author = $("<p>")
      .addClass("text-primary author")
      .html(`${article.author} | <span>${article.publishedDate}</span>`);

    // Create Description
    let description = $("<p>")
      .text(article.contents)
      .addClass("card-text text-black-70");

    // Append elements to card
    cardBody.append(author, title, description);
    cardContainer.append(img, cardBody);
    cardGrid.append(cardContainer);

    cardTopLevelContainer.append(cardGrid);
  }
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
