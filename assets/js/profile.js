let loginUserAvatar;
let loginState = JSON.parse(localStorage.getItem("loginState"));
let users = JSON.parse(localStorage.getItem("users"));

if (loginState) {
  let avatarId = loginState.loggedUserID;

  let loggedUser = users.find((user) => user.userID === avatarId);
  $("#profile-img").attr("src", loggedUser.avatar);
  $("#profile-name").text(loggedUser.userName);

  $("#updateEmail").val(loggedUser.email);
  $("#updatePassword").val(loggedUser.password);
}

// Restore Active Tab
$("#postsLink").on("click", (event) => showSection(event, "posts"));

$("#updateProfileLink").on("click", (event) =>
  showSection(event, "updateProfile")
);
// JavaScript for toggling content sections
function showSection(event, sectionId) {
  // Prevent default link behavior
  event.preventDefault();

  // Hide all content sections
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => {
    section.style.display = "none";
  });

  // Remove active class from all nav links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Show the selected section
  document.getElementById(sectionId).style.display = "block";

  // Add active class to the clicked nav link
  event.currentTarget.classList.add("active");
}

// Filter user's post
let userID = loginState.loggedUserID;
let localArticles = JSON.parse(localStorage.getItem("articles"));

let filteredArticles = localArticles.filter(
  (article) => article.userID == userID
);

console.log();
console.log(filteredArticles);

function generateDate() {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

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
      .attr("id", "edit-btn")
      .attr("data-bs-toggle", "modal")
      .attr("data-bs-target", "#post-modal")
      .text("Edit")
      .on("click", () => {
        $("#post-form")
          .data("postID", article.postID)
          .data("userID", article.userID)
          .data("author", article.author)
          .data("publishedDate", article.publishedDate)
          .data("category", article.category)
          .data("imgUrl", article.imgUrl);
        $("#post-title").val(article.title);
        $("#post-content").val(article.contents);
      });

    let tableListDeleteActionButton = $("<button>")
      .addClass("btn btn-danger")
      .text("Delete")
      .on("click", () => {
        // Delete article from local storage
        filteredArticles = filteredArticles.filter(
          (filteredArticle) => filteredArticle.postID !== article.postID
        );

        // Update the local articles for delete
        localArticles = localArticles.filter(
          (localArticle) => localArticle.postID !== article.postID
        );
        saveLocalStorage("articles", localArticles);

        // Clear the table
        $(".table-group-divider").empty();

        renderArticleCard(filteredArticles);
      });

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

$("#post-form").on("submit", (event) => {
  //   event.preventDefault();

  // Retrieve the stored data using .data()
  let postID = $("#post-form").data("postID");
  let userID = $("#post-form").data("userID");
  let author = $("#post-form").data("author");
  let publishedDate = $("#post-form").data("publishedDate");
  let category = $("#post-form").data("category");
  let imgUrl = $("#post-form").data("imgUrl");

  // Output the data to verify
  //   console.log(postID, userID, author, publishedDate, category, imgUrl);

  let updateTitle = $("#post-title").val();
  let updateContent = $("#post-content").val();
  function getImgUrl(oriImg) {
    let updateImg = document.getElementById("post-img").files;
    if (!updateImg || updateImg.length == 0) {
      return oriImg;
    }

    const file = updateImg[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      return reader.result;
    };
  }

  let newPost = {
    userID: userID,
    author: author,
    publishedDate: publishedDate,
    category: category,
    postID: postID,
    title: updateTitle,
    contents: updateContent,
    imgUrl: getImgUrl(imgUrl),
  };
  updateArticle(newPost);
});

function updateArticle(newPost) {
  let title = newPost.title;
  let contents = newPost.contents;
  let imgUrl = newPost.imgUrl;
  // Filter update article
  const updateArticles = localArticles.map((article) => {
    if (article.postID === newPost.postID) {
      return {
        ...article,
        title: title,
        contents: contents,
        imgUrl: imgUrl,
      };
    } else {
      return article;
    }
  });
  saveLocalStorage("articles", updateArticles);
}

renderArticleCard(filteredArticles);

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

// Post Update
function postUpdate() {
  $("")
    .addClass("btn btn-dark py-2 rounded-pill")
    .attr("data-bs-toggle", "modal")
    .attr("data-bs-target", "")
    .text("Sign Up");
}
