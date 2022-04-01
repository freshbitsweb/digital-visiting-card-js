window.onload = function () {
    checkAuth();
}

const checkAuth = () => {
    const user = localStorage.getItem('gotrue.user');

    if (!user) {
        netlifyIdentity.open();
        return;
    }
    localStorage.setItem('userDirectory', JSON.parse(user).email);
}

const loader = document.querySelector("#loading");

const displayLoading = () => {
    loader.classList.add("display");
}

const hideLoading = () => {
    loader.classList.remove("display");
}

const logout = () => {
    netlifyIdentity.logout();
    window.location.reload();
}

const login = () => {
    netlifyIdentity.open();
}

const navbarHtml = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <div class="">
                <a class="navbar-brand" href="#">
                    <img src="../images/logo.png" alt="logo" width="200px">
                </a>
            </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="index.html">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link d-hidden" href="manage.html">Add New Card</a>
                    </li>
                   ${
                        localStorage.getItem('gotrue.user') ?
                        '<a class="nav-link d-hidden" href="#" onclick="logout()">Logout</a>' :
                        '<a class="nav-link d-hidden" href="#" onclick="login()">Login</a>'
                    }
                </ul>
            </div>
        </div>
    </nav>
`;
const body = document.getElementById('dynamic-navbar');
body.innerHTML = navbarHtml;