let firstNameInput = document.getElementById('first-name');
let lastNameInput = document.getElementById('last-name');
let emailInput = document.getElementById('email');
let phoneNumberInput = document.getElementById('phone-number');
let githubInput = document.getElementById('github-link');
let websiteInput = document.getElementById('website');
let titleInput = document.getElementById('title');
let sha = document.getElementById('sha');
let fileNameInput = document.getElementById('file-name');
let getFileDataResponse = sessionStorage.getItem("file-data");
let fileName = '',
	phoneNumberTemp = '';

let firstNameValidation = document.getElementById('first-name-validation');
let lastNameValidation = document.getElementById('last-name-validation');
let emailValidation = document.getElementById('email-validation');
let phoneNumberValidation = document.getElementById('phone-number-validation');
let githubValidation = document.getElementById('github-validation');
let websiteValidation = document.getElementById('website-validation');

let emailFlag = false;
let websiteFlag = false;
let firstNameFlag = false;
let lastNameFlag = false;
let phoneNumberFlag = false;
let githubFlag = false;

let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
let nameRegex = /^[a-zA-Z ]{2,30}$/;
let websiteRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
let phoneRegex = /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g;

let checkValidation = () => {
	if (emailInput.value === '') {
		emailValidation.innerText = 'Please Enter Email Address';
		emailFlag = false;
	} else {
		let result = (emailInput.value).match(emailRegex);
		if (!result) {
			emailValidation.innerText = 'Invalid Email Address';
			emailFlag = false;
		} else
			emailValidation.innerText = '';
		emailFlag = true;
	}

	if (firstNameInput.value === '') {
		firstNameValidation.innerText = 'Please Enter Name';
		firstNameFlag = false;
	} else {
		let result = (firstNameInput.value).match(nameRegex);
		if (!result) {
			firstNameValidation.innerText = 'Invalid First Name';
			firstNameFlag = false;
		} else {
			firstNameValidation.innerText = '';
			firstNameFlag = true;
		}
	}

	if (lastNameInput.value === '') {
		lastNameValidation.innerText = 'Please Enter Name';
		lastNameFlag = false;
	} else {
		let result = (lastNameInput.value).match(nameRegex);
		if (!result) {
			lastNameValidation.innerText = 'Invalid First Name';
			lastNameFlag = false;
		} else {
			lastNameValidation.innerText = '';
			lastNameFlag = true;
		}
	}

	if (githubInput.value === '') {
		githubValidation.innerText = 'Please Enter Github Id';
		githubFlag = false;
	} else {
		let result = (githubInput.value).match(websiteRegex);
		if (!result) {
			githubValidation.innerText = 'Please Enter Proper Github Id';
			githubFlag = false;
		}
		githubValidation.innerText = '';
		githubFlag = true;
	}

	if (websiteInput.value === '') {
		websiteValidation.innerText = 'Please Enter Website';
		websiteFlag = false
	} else {
		let result = (websiteInput.value).match(websiteRegex);
		if (!result) {
			websiteValidation.innerText = 'Invalid Website';
			websiteFlag = false
		} else {
			websiteValidation.innerText = '';
			websiteFlag = true;
		}
	}

	if (phoneNumberInput.value === '') {
		phoneNumberValidation.innerText = 'Please Enter Phone Number';
		phoneNumberFlag = false;
	} else {
		let result = (phoneNumberInput.value).match(phoneRegex);
		if (!result) {
			phoneNumberValidation.innerText = 'Invalid Phone Number';
			phoneNumberFlag = false;
		} else {
			phoneNumberValidation.innerText = '';
			phoneNumberFlag = true;
		}
	}

	submitForm();
};

let submitForm = async () => {
	if (phoneNumberFlag == true && emailFlag == true && firstNameFlag == true && lastNameFlag == true && websiteFlag == true && githubFlag == true) {
		//
	}

	checkValidation();
};