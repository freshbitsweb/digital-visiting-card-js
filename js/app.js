let netlifyIdentityLogout = () => {
	netlifyIdentity.logout();
};

var userEmail, userName;

let checkAuth = () => {
	const user = localStorage.getItem('gotrue.user');

	if (!user) {
		netlifyIdentity.open();
		return;
	}
	userEmail = JSON.parse(user).email;
	userName = userEmail.split("@")[0];
}

checkAuth();

var navbarHtml = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
		<div class="container-fluid">
			<a class="navbar-brand" href="#">Digital Visiting Card</a>
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
                        <a class="nav-link d-hidden" href="manage.html">Form</a>
                    </li>
                </ul>
				<div class="dropdown ms-auto">
					<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
						<i class="fa fa-user"></i>
						<span id="login-username">${userEmail}</span>
					</button>
					<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
						<li><a class="dropdown-item" href="#" onclick="netlifyIdentityLogout()">Logout</a></li>
					</ul>
				</div>
			</div>
		</div>
	</nav>
`;
let body = document.getElementById('dynamic-body');
body.innerHTML = navbarHtml;
