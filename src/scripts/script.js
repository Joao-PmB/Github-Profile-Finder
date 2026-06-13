const APIURL = "https://api.github.com/users/";
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

// Busca os dados do perfil do usuário na API do GitHub:
async function getUser(username) {
  try {
    const resp = await fetch(APIURL + username);

    // Caso não exista um perfil com o username:
    if (resp.status === 404) {
      createErrorCard("Nenhum perfil possui este username.");
      return;
    }
    const data = await resp.json();
    createUserCard(data);
    getRepos(username);
  }
   catch (err) {

    // Caso o fetching der erro:
    createErrorCard("Houve um erro para achar este perfil.");
  }
}


// Busca os repositórios do usuário na API do GitHub:
async function getRepos(username) {
  try {
    const resp = await fetch(APIURL + username + "/repos?sort=created");
    const data = await resp.json();
    addReposToCard(data);
  } catch (err) {

    // Caso o fetching dos repositorios der erro:
    createErrorCard("Não foi possível achar os repositórios deste usuário.");
  }
}

// Cria e exibe o card do usuário na tela com seus dados:
function createUserCard(user) {
  const userID = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : "";
  const cardHTML = `
    <div class="card">
        <div>
            <img src="${user.avatar_url}" alt="${user.name}" class="avatar"/>
        </div>
        <div class="user-info">
            <h2>${userID}</h2>
            ${userBio}
            <ul>
                <li>${user.followers} <strong>Seguidores</strong></li>
                <li>${user.following} <strong>Seguindo</strong></li>
                <li>${user.public_repos} <strong>Repositórios</strong></li>
            </ul>
            <div id="repos"></div>
        </div>
    </div>`;
  main.innerHTML = cardHTML;
}

// Adiciona os repositórios do usuário ao card já criado:
function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");
  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;
    reposEl.appendChild(repoEl);
  });
}

// Cria e exibe um card de erro com a mensagem recebida:
function createErrorCard(message) {
  const cardHTML = `
    <div class="card">
        <h1>${message}</h1>
    </div>`;
  main.innerHTML = cardHTML;
}

// Escuta o envio do formulário e inicia a busca do usuário digitado:
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;
  if (user) {
    getUser(user);
    search.value = "";
  }
});
