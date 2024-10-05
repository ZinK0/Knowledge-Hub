let loadedArticles = [];
let registeredUsers = [];
let userAvatar;
let loginState = {
  isLogin: false,
  loggedUserID: null,
};
const articlesPerPage = 6;
let currentPage = 1;

// Login Form Modal
let loginFormModal = new bootstrap.Modal($("#login-form-modal"), {});
let signUpFormModal = new bootstrap.Modal($("#signup-form-modal"), {});

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
    loadLocalStorage();
    // Fetch registered users
    console.log(registeredUsers);

    // registeredUsers = await fetchData("assets/data/users.json");
    // console.log(registeredUsers);

    // Fetch Articles from the json file
    // loadedArticles = await fetchData("assets/data/articles.json");
    // console.log(loadedArticles);
    // saveLocalStorage("users", registeredUsers);

    checkLoginStatus();

    // Authenticate the user with username and password from local storage
    function authenticateUser(registeredUsers, email, password) {
      console.log(registeredUsers);

      return registeredUsers.find(
        (user) => user.email === email && user.password === password
      );
    }

    $("#signup-form").on("submit", function (e) {
      e.preventDefault();

      if (checkUserExit(registeredUsers)) {
        alert("User already exist");
        return;
      }

      // Validate Password and success load to login page
      if (
        $("#signup-form-password").val() !==
        $("#signup-form-confirm-password").val()
      ) {
        alert("Passwords do not match");
        return;
      } else {
        let newUser = {
          userID: generateUID(),
          createdDate: generateDate(),
          avatar: userAvatar,
          userName: $("#signup-form-username").val(),
          email: $("#signup-form-email").val(),
          password: $("#signup-form-password").val(),
        };

        // Add the new user to the registeredUsers array
        registeredUsers.push(newUser);
        console.log(registeredUsers);

        // Update local storage registered users
        saveLocalStorage("users", registeredUsers);

        // clear the data
        $("#signup-form").trigger("reset");

        alert("User created successfully!");

        // Hide the sign up form
        signUpFormModal.hide();

        // Show the login form
        loginFormModal.show();

        // $("#login-form-modal").modal("show");
      }
      console.log("SignUP Form Working");
    });

    // Submit Login Form Modal Data
    $("#login-form").on("submit", function (e) {
      e.preventDefault();
      console.log("Login Form Working");

      // Get the form data
      let email = $("#login-form-email").val();
      let password = $("#login-form-password").val();

      // clear the data
      $("#login-form").trigger("reset");

      // Authenticate the user
      if (!authenticateUser(registeredUsers, email, password)) {
        console.log(registeredUsers);

        alert("Invalid Credentials!");
        return;
      } else {
        // Find the user
        let loginUser = registeredUsers.find((user) => user.email === email);

        // Update the login status

        loginState.isLogin = true;
        loginState.loggedUserID = loginUser.userID;

        // Hide the login form
        loginFormModal.hide();

        // Clear the previous login signup btn
        $("#navbar-link-container").empty();

        // update logged user avatar
        userAvatar = loginUser.avatar;
        // Show the page navbar with login state
        checkLoginStatus();

        // Update local storage login state
        saveLocalStorage("loginState", loginState);
      }
      console.log(email, password);
    });

    // Load articles from local storage to control the delete update

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

function checkLoginStatus() {
  // TODO: Check the logout dropdown
  let navbarLinkContainer = $("#navbar-link-container");
  navbarLinkContainer.empty();
  if (!loginState.isLogin) {
    let navbarLink = $("<li>").addClass("nav-item");
    let navbarLinkLogin = $("<a>")
      .addClass("btn btn-outline-secondary me-2 py-2 rounded-pill")
      .attr("data-bs-toggle", "modal")
      .attr("data-bs-target", "#login-form-modal")
      .text("Login");

    let navbarLinkSignUp = $("<a>")
      .addClass("btn btn-dark py-2 rounded-pill")
      .attr("data-bs-toggle", "modal")
      .attr("data-bs-target", "#signup-form-modal")
      .text("Sign Up");

    // Add User Avatar icon in Sign Up form
    showAvatarIcons($(".avatar-container"));

    navbarLinkContainer.empty();
    navbarLink.append(navbarLinkLogin, navbarLinkSignUp);
    navbarLinkContainer.append(navbarLink);
  } else {
    let addPostBtn = $("<li>")
      .addClass("nav-item")
      .html(
        ` <button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#add-post-modal"  >
                    <i class="bi bi-plus-lg me-2"></i>New post
                  </button>`
      );
    navbarLinkContainer.append(addPostBtn);

    let navbarProfilePage = $("<li>").addClass("nav-item").html(`
        <a class="nav-link" aria-current="page" href="profile.html">Profile</a>
      `);
    navbarLinkContainer.append(navbarProfilePage);

    // TODO: Switch Account need to add functionality
    let navbarSwitchAccount = $("<li>").addClass("nav-item").html(`
        <a class="nav-link" aria-current="page" href="#">Switch Account</a>
      `);
    navbarLinkContainer.append(navbarSwitchAccount);

    // TODO: Settings need to add functionality
    let navbarSetting = $("<li>").addClass("nav-item dropdown-center").html(`
        <img
                width="70"
                class="rounded rounded-circle nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                src="${userAvatar}"
              />
              
              <ul class="dropdown-menu">
                <li><a id="logout-btn" class="dropdown-item" href="#">Logout</a></li>
              </ul>
      `);

    navbarLinkContainer.append(navbarSetting);
    // Add Logout to exit the user
    $("#logout-btn").on("click", () => {
      console.log("Logout working");

      // TODO: Fix this
      loginState = {
        isLogin: false,
        loggedUserID: null,
      };
      location.reload(true);

      saveLocalStorage("loginState", loginState);
    });
  }
}

// Render All Articles Landing Page and Cards
function renderArticles(articles) {
  console.log(articles);

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

  // Remove Old Load More Button
  $("#load-more-btn-container").empty();

  // Check the total pages and add Load More Button if needed
  addLoadMoreBtn(articles, start, end);
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

// Function about calculation the total pages for add or not about load more btn
function addLoadMoreBtn(articles, start, end) {
  let totalPages = Math.ceil(articles.length / articlesPerPage);
  if (currentPage < totalPages) {
    console.log("Load more btn working!");

    let loadMoreBtn = $("<button>").addClass(
      "btn btn-lg btn-dark mx-auto mt-5 shadow-sm rounded-pill"
    );
    loadMoreBtn.html(`<i class="bi bi-arrow-down p-2 "> Load More</i>`);
    loadMoreBtn.on("click", () => {
      currentPage++;
      renderArticleCard(
        articles,
        (start = 0),
        (end = articlesPerPage * currentPage)
      );
      // renderCards(
      //   articles,
      //   (start = (currentPage - 1) * articlesPerPage),
      //   (end = Math.min(start + articlesPerPage, articles.length))
      // );
    });
    $("#load-more-btn-container").append(loadMoreBtn);
  }
}

// Show Avatar Icons
function showAvatarIcons(avatarContainer) {
  let avatarChar = [
    "Felix",
    "Aneka",
    "Liliana",
    "Eden",
    "Mackenzie",
    "Chase",
    "Aidan",
    "George",
    "Christian",
    "Riley",
    "Mason",
  ];

  // Show avatar char with for loop
  avatarChar.forEach((char) => {
    let avatarAPI = `https://api.dicebear.com/9.x/notionists/svg?scale=100&size=64&backgroundColor=b6e3f4,c0aede,d1d4f9&seed=${char}`;
    let avatarImg = $(`<img src="${avatarAPI}" alt="${char}">`)
      .addClass("rounded-circle border-danger border-3 mb-3")
      .attr("width", "50")
      .attr("data-char", char)
      .on("click", function () {
        userAvatar = $(this).attr("src");

        // Remove the border from other avatars
        avatarContainer.find("img").removeClass("border");
        $(this).addClass("border");
      });
    avatarContainer.append(avatarImg);
  });
}

// Generate UUID for user
// ========================
function generateUID() {
  return Date.now() + Math.random().toString(36).substr(2, 9); // Generate a unique ID
}

// Generate Date for new user creation
function generateDate() {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Check sign up user for exit or not
// =================================
function checkUserExit(registeredUsers) {
  return registeredUsers.find(
    (user) => user.email === $("#signup-form-email").val()
  );
}

async function loadLocalStorage() {
  // Load articles from local storage
  localArticles = JSON.parse(localStorage.getItem("articles"));
  console.log(loadedArticles);

  if (localArticles) {
    // Filter users that are not already in registeredUsers based on userID
    let newArticles = localArticles.filter((localArticle) => {
      return !loadedArticles.some(
        (loadedArticle) => loadedArticle.postID === localArticle.postID
      );
    });

    // Add only new unique users to registeredUsers
    loadedArticles.push(...newArticles);
    console.log(loadedArticles); // Now registeredUsers will include only unique users
  } else {
    // If local storage is empty, load from json file
    // Fetch Articles from the json file
    loadedArticles = await fetchData("assets/data/articles.json");

    // Save articles to local storage
    saveLocalStorage("articles", loadedArticles);
  }

  // Load registered users from local storage
  let localRegisteredUsers = JSON.parse(localStorage.getItem("users"));
  console.log(localRegisteredUsers);

  if (localRegisteredUsers) {
    // Filter users that are not already in registeredUsers based on userID
    let newUsers = localRegisteredUsers.filter((localUser) => {
      return !registeredUsers.some(
        (registeredUser) => registeredUser.userID === localUser.userID
      );
    });

    // Add only new unique users to registeredUsers
    registeredUsers.push(...newUsers);
    console.log(registeredUsers); // Now registeredUsers will include only unique users
  } else {
    // If local storage is empty, load from json file
    // Fetch Users from the json file
    registeredUsers = await fetchData("assets/data/users.json");

    // Save users to local storage
    saveLocalStorage("users", registeredUsers);
  }

  // Load login state from local storage
  let localLoginState = JSON.parse(localStorage.getItem("loginState"));
  if (localLoginState) {
    loginState = localLoginState;
    console.log(loginState);

    // load avatar
    let avatarId = loginState.loggedUserID;
    console.log(avatarId);

    let loggedUser = localRegisteredUsers.find(
      (user) => user.userID === avatarId
    );
    console.log(localRegisteredUsers);

    console.log(loggedUser);

    if (loggedUser) {
      userAvatar = loggedUser.avatar;
    }
  }
}

function saveLocalStorage(KEY, VALUE) {
  // Save articles to local storage
  localStorage.setItem(`${KEY}`, JSON.stringify(VALUE));
}
function getNewPostImgUrl(oriImg) {
  return new Promise((resolve, reject) => {
    let updateImg = document.getElementById("add-post-img").files;

    if (!updateImg || updateImg.length == 0) {
      resolve(oriImg); // Return the original image if no new file is selected
      return;
    }

    const file = updateImg[0];
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result); // Resolve the promise with the image data
    };

    reader.onerror = (error) => {
      reject(error); // Reject the promise in case of an error
    };

    reader.readAsDataURL(file); // Read the file
  });
}

// function addNewArticle(e) {
//   e.preventDefault();
//   console.log(getNewPostImgUrl());
//   let findAuthor = registeredUsers.find(
//     (user) => user.userID === loginState.loggedUserID
//   );
//   console.log(findAuthor);

//   let newArticle = {
//     postID: generateUID(),
//     title: $("#add-post-title").val(),
//     imgUrl: getNewPostImgUrl(),
//     contents: $("#add-post-content").val(),
//     author: findAuthor.userName,
//     date: generateDate(),
//     category: "All Posts",
//   };
//   console.log(newArticle);
//   alert("Article added successfully");
//   console.log("********");
//   $("#add-post-modal").hide();
// }

async function addNewArticle(e) {
  e.preventDefault();

  let findAuthor = registeredUsers.find(
    (user) => user.userID === loginState.loggedUserID
  );

  try {
    const imgUrl = await getNewPostImgUrl(); // Wait for the image URL to be resolved

    let newArticle = {
      postID: generateUID(),
      title: $("#add-post-title").val(),
      imgUrl: imgUrl, // Use the resolved image URL here
      contents: $("#add-post-content").val(),
      author: findAuthor.userName,
      publishedDate: generateDate(),
      category: null,
    };

    console.log(newArticle); // Log or save the new article to localStorage
    // Save the article to your data store (e.g., localStorage)
    saveArticleToLocalStorage(newArticle);
  } catch (error) {
    console.error("Error reading the image file: ", error);
  }
  $("#add-post-modal").hide();
}

function saveArticleToLocalStorage(article) {
  // Assuming you have a way to store articles in localStorage
  let articles = JSON.parse(localStorage.getItem("articles")) || [];
  articles.push(article);
  localStorage.setItem("articles", JSON.stringify(articles));
}

$("#add-post-form").on("submit", (e) => addNewArticle(e));

fetchAndRender();
