let navbarHtml = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
		<div class="container-fluid">
			<a class="navbar-brand" href="#">Digital Visiting Card</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse"
				data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
				aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<a class="nav-link active" aria-current="page" href="index.html">Home</a>
					</li>

					<li class="nav-item">
						<a class="nav-link d-hidden" href="form.html">Form</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
`;
// let body = document.getElementById('body');
// body.innerHTML = navbarHtml;

let netlifyIdentityLogout = () => {
	netlifyIdentity.logout();
};

const user = localStorage.getItem('gotrue.user');
var userEmail = JSON.parse(user).email;
var userName = userEmail.split("@")[0];

if (!user) {
	netlifyIdentity.open();
}
