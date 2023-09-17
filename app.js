
"use strict";

const searchInput = document.querySelector(".searchUser");
const DELAY = 500; // Затримка в мілісекундах (0.5 секунди)
let searchTimeout = null;

class Github {
	constructor() {
		this.clientId = "9f1be853161dc20284d3";
		this.clientSecret = "27d05812a75ce5e2be2055f063cff0ba93fa1548";
	}

	async getUser(userName) {
		const response = await fetch(
			`https://api.github.com/users/${userName}?client_id=${this.clientId}&client_secret=${this.clientSecret}`
		);
		const user = await response.json();

		return user;
	}

	async getRepos(userName) {
		const response = await fetch(
			`https://api.github.com/users/${userName}/repos?sort=updated&per_page=5`
		);
		const repos = await response.json();

		return repos;
	}
}

class UI {
	constructor() {
		this.profile = document.querySelector(".profile");
	}

	showProfile(user, repos) {
		this.profile.innerHTML = `
          <div class="card card-body mb-3">
            <div class="row">
              <div class="col-md-3">
                <img class="img-fluid mb-2" src="${user.avatar_url}">
                <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
              </div>
              <div class="col-md-9">
                <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
                <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
                <span class="badge badge-success">Followers: ${user.followers}</span>
                <span class="badge badge-info">Following: ${user.following}</span>
                <br><br>
                <ul class="list-group">
                  <li class="list-group-item">Company: ${user.company}</li>
                  <li class="list-group-item">Website/Blog: ${user.blog}</li>
                  <li class="list-group-item">Location: ${user.location}</li>
                  <li class="list-group-item">Member Since: ${user.created_at}</li>
                </ul>
              </div>
            </div>
          </div>
          <h3 class="page-heading mb-3">Latest Repos</h3>
          <div class="repos"></div>
        `;

		const reposContainer = document.querySelector(".repos");
		let output = "";

		repos.forEach((repo) => {
			output += `
            <div class="card card-body mb-2">
              <div class="row">
                <div class="col-md-6">
                  <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </div>
                <div class="col-md-6">
                  <span class="badge badge-primary">Stars: ${repo.stargazers_count}</span>
                  <span class="badge badge-secondary">Watchers: ${repo.watchers_count}</span>
                  <span class="badge badge-success">Forks: ${repo.forks_count}</span>
                </div>
              </div>
            </div>
          `;
		});

		reposContainer.innerHTML = output;
	}

	clearProfile() {
		this.profile.innerHTML = "";
	}

	showAlert(message, className) {
		this.clearAlert();
		const div = document.createElement("div");

		div.className = className;
		div.innerHTML = message;

		const search = document.querySelector(".searchUser");

		search.before(div);

		setTimeout(() => {
			this.clearAlert();
		}, 3000);
	}

	clearAlert() {
		const alert = document.querySelector(".alert");
		if (alert) {
			alert.remove();
		}
	}
}

const github = new Github();
const ui = new UI();

searchInput.addEventListener("input", (e) => {
	const inputValue = e.target.value;

	clearTimeout(searchTimeout); // Скасувати попередню затримку

	searchTimeout = setTimeout(async () => {
		ui.clearProfile(); // Очистити профіль перед новим запитом

		if (inputValue !== "") {
			const userData = await github.getUser(inputValue);

			if (userData.message === "Not Found") {
				return ui.showAlert(userData.message, "alert alert-danger");
			}

			const reposData = await github.getRepos(inputValue);
			ui.showProfile(userData, reposData);
		}
	}, DELAY);
});
