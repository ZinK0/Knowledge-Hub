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

    // Set default active category for all posts
    $("#categories-link .nav-link:first").addClass("active");
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
    cardTopLevelContainer.empty();
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

    //   Add Read More button
    let readMoreBtn = $("<a>")
      .addClass("text-black ")
      .attr("href", "#") // Set the href attribute
      .attr("class", "readmore-btn") // Set the class attribute
      .attr("data-bs-toggle", "modal") // Bootstrap modal toggle
      .attr("data-bs-target", "#article-modal") // Target the modal with this ID
      .attr("data-bs-postid", article.postID) // Dynamically add the post ID from the article object
      .html(`Read More <i class="bi bi-arrow-up-right"></i>`) // Add text and icon inside the anchor tag
      .on("click", function (e) {
        e.preventDefault();
        console.log("clicked");

        // Get the post with the data-bs-postid attribute
        let postId = $(this).data("bs-postid");
        let article = articles.find((a) => a.postID === postId);

        // Add the data to the modal
        $(".modal-article-title").text(article.title);
        $(".modal-text").text(article.contents);
        $(".modal-author").text(article.author);
        $(".modal-published-date").text(article.publishedDate);
        $(".modal-img").attr("src", article.imgUrl);
        console.log(article.title);
        console.log(postId);
      });

    // Append elements to card
    cardBody.append(author, title, description, readMoreBtn);
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

  // Add event listener to all category links
  $(".nav-tabs .nav-link").on("click", function (e) {
    e.preventDefault();

    // Reset the current page for selected category
    currentPage = 1;

    const selectedCategory = $(this).text();

    // Filter selected category post
    const filteredArticles = loadedArticles.filter((article) => {
      return (
        article.category === selectedCategory ||
        selectedCategory === "All Posts"
      );
    });

    // Set Default Active Category for All Post
    addActiveCategory(selectedCategory);

    // Render 6 Cards only per page
    let start = (currentPage - 1) * articlesPerPage;
    let end = Math.min(start + articlesPerPage, filteredArticles.length);

    // Calculate the total pages for add or not about read more btn
    // let totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    renderArticleCard(filteredArticles, start, end);
  });
}

// Add Active Category for Categories Link
function addActiveCategory(category) {
  $("#categories-link .nav-link").removeClass("active");
  $(`#categories-link .nav-link:contains(${category})`).addClass("active");
}

fetchAndRender();
