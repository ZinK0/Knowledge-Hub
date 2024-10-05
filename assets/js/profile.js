// Filter user's post
let userID = loginState.loggedUserID;
let articles = JSON.parse(localStorage.getItem("articles"));

let filteredArticles = articles.filter((article) => article.userID == userID);
let firstARTICLE = filteredArticles[2];
console.log(firstARTICLE.imgUrl);

console.log(articles);
console.log(filteredArticles);

// Create Table Row
console.log("Profile JS Loaded");

let tableRow = $("<tr>");

let tableHeadingContainer = $("<th>").attr("scope", "row");
let tableListHeading = $("<h5>").text(`${firstARTICLE.postID}`);
let tableListBodyContainer = $("<div>").addClass("card border-0 p-2 flex-row");
let tableListBodyImg = $("<img>")
  .addClass("rounded object-fit-cover col-4")
  .attr("src", firstARTICLE.imgUrl);
let tableListCard = $("<div>").addClass("card-body col-8");
let tableListCardTitle = $("<h5>")
  .addClass("card-title")
  .text(`${firstARTICLE.title}`);
let tableListCardContents = $("<p>")
  .addClass("card-text text-black-70")
  .text(`${firstARTICLE.contents}`);
let tableListDate = $("<td>").text(`${firstARTICLE.publishedDate}`);
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

tableRow.append(tableHeadingContainer, tableListDate, tableListActionContainer);

$(".table-group-divider").append(tableRow);
console.log($("<tbody>"));
