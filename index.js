const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const pdf = require("html-pdf");

// object to store user info
const userInfo = {
  name: "",
  color: "",
  picture: "",
  login: "",
  bio: "",
  location: "",
  profile: "",
  portfolio: "",
  followers: "",
  following: "",
  stars: "",
  repos: ""
};
//const generateMarkdown = require("./generateMarkdown");
const questions = [
  {
    type: "input",
    name: "username",
    message: "What is your GitHub username?"
  },
  {
    type: "input",
    name: "color",
    message: "What is your favorite color?"
  },
  {
    type: "input",
    name: "description",
    message: "Please write a short description of your project"
  },
  {
    type: "list",
    name: "license",
    message: "What kind of license should your project have?",
    choices: ["MIT", "APACHE 2.0", "GPL 3.0", "BSD 3", "None"]
  },
  {
    type: "input",
    name: "installation",
    message: "What command should be run to install dependencies?",
    default: "npm i"
  },
  {
    type: "input",
    name: "test",
    message: "What command should be run to run tests?",
    default: "npm test"
  },
  {
    type: "input",
    name: "usage",
    message: "What does the user need to know about using the repo?",
  },
  {
    type: "input",
    name: "contributing",
    message: "What does the user need to know about contributing to the repo?",
  }
];
// base html to be generated
function generateHTML(info) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
      <title>${info.name}</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  </head>
  <body>
    <div class="jumbotron" style="background-color: ${info.color} ;">
      <div class="text-center">
      <img src="${info.picture}" class= "rounded-circle" style="max-height: 200px;">
      </div>
      <h1 class="display-4 text-center">${info.name}</h1>
      <h4 class="text-center">${info.login}</h4>
      <div class="row justify-content-sm-center">
        <div class="col-sm-8">
          <p class="lead text-center">${info.bio}</p>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-4 text-center">
          <p><a href="https://www.google.com/maps/place/${info.location}">${info.location}</a></p>
        </div>
        <div class="col-sm-12 col-md-4 text-center">
          <p><a href="${info.profile}">Github</a></p>
        </div>
        <div class="col-sm-12 col-md-4 text-center">
          <p><a href="${info.portfolio}" class="text-center">Portfolio</a></p>
        </div>
      </div>
    </div>
    <div class="container" style="margin-top: 30px; margin-bottom: 50px;">
      <div class="row">
        <div class="col-sm-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title text-center">Followers:</h5>
              <p class="card-text text-center">${info.followers}</p>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title text-center">Following:</h5>
              <p class="card-text text-center">${info.following}</p>
            </div>
          </div>
        </div>  
        <div class="col-sm-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title text-center">Stars:</h5>
              <p class="card-text text-center">${info.stars}</p>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title text-center">Public Repos:</h5>
              <p class="card-text text-center">${info.repos}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>`;
}
// methods to initialize the app, save user info, query the Github API,
// and generate the html & pdf files
promptUser()
  .then((data) => {
    userInfo.login = data.username;
    userInfo.color = data.color;
    const queryUrl = `https://api.github.com/users/${data.username}`;

    axios.get(queryUrl).then((res) => {
      userInfo.name = res.data.name;
      userInfo.picture = res.data.avatar_url;
      userInfo.bio = res.data.bio;
      userInfo.location = res.data.location;
      userInfo.profile = res.data.html_url;
      userInfo.portfolio = res.data.blog;
      userInfo.followers = res.data.followers;
      userInfo.following = res.data.following;
      userInfo.stars = res.data.public_gists;
      userInfo.repos = res.data.public_repos;

      const html = generateHTML(userInfo);

      fs.writeFile("profile.html", html, (err) => {
        if (err) {
          return console.log(err);
        }
      });
      const options = {
        format: 'A3',
        orientation: 'landscape',
      };
      pdf.create(html, options).toFile("profile.pdf", (err) => {
        if (err) {
          return console.log(err);
        }
      });
    }).then(() => {
      console.log("Successfully wrote to profile.html & profile.pdf");
    }).catch((err) => {
      console.log(err);
    })
  });
  

