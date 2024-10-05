// Filter user's post
let userID = loginState.loggedUserID;
let articles = JSON.parse(localStorage.getItem("articles"));

let filteredArticles = articles.filter((article) => article.userID == userID);
// let firstARTICLE = filteredArticles[2];
// console.log(firstARTICLE.imgUrl);

console.log(articles);
console.log(filteredArticles);

function renderArticleCard(articles) {
  articles.forEach((article) => {
    let tableRow = $("<tr>");
    let tableHeadingContainer = $("<th>").attr("scope", "row");
    let tableListHeading = $("<h5>").text(`${article.postID}`);
    let tableListBodyContainer = $("<div>").addClass(
      "card border-0 p-2 flex-row"
    );
    let tableListBodyImg = $("<img>")
      .addClass("rounded object-fit-cover col-4")
      .attr("src", article.imgUrl);
    let tableListCard = $("<div>").addClass("card-body col-8");
    let tableListCardTitle = $("<h5>")
      .addClass("card-title")
      .text(`${article.title}`);
    let tableListCardContents = $("<p>")
      .addClass("card-text text-black-70")
      .text(`${article.contents}`);
    let tableListDate = $("<td>").text(`${article.publishedDate}`);
    let tableListAction = $("<td>");
    let tableListActionContainer = $("<div>").addClass(
      "d-flex flex-column w-50 h-auto"
    );
    let tableListEditActionButton = $("<button>")
      .addClass("btn btn-primary mb-2")
      .text("Edit");
    let tableListDeleteActionButton = $("<button>")
      .addClass("btn btn-danger")
      .text("Delete");

    tableListCard.append(tableListCardTitle, tableListCardContents);

    tableListBodyContainer.append(tableListBodyImg, tableListCard);
    tableHeadingContainer.append(tableListHeading, tableListBodyContainer);

    tableListActionContainer.append(
      tableListEditActionButton,
      tableListDeleteActionButton
    );

    tableRow.append(
      tableHeadingContainer,
      tableListDate,
      tableListActionContainer
    );

    $(".table-group-divider").append(tableRow);
  });
}

renderArticleCard(filteredArticles);

// Create Table Row
console.log("Profile JS Loaded");

function saveLocalStorage(KEY, VALUE) {
  // Save articles to local storage
  localStorage.setItem(`${KEY}`, JSON.stringify(VALUE));
}

// Logout User and redirect to main page
$("#logout-btn").on("click", () => {
  console.log("Logout working");

  // Update loginState to indicate the user is logged out
  loginState = {
    isLogin: false,
    loggedUserID: null,
  };

  // Save the updated loginState to localStorage
  saveLocalStorage("loginState", loginState);

  // Redirect to the index page after logout
  window.location.href = "index.html"; // Change 'index.html' to the actual path of your index page
});
