let firstNameInput = document.getElementById('first-name');
let lastNameInput = document.getElementById('last-name');
let emailInput = document.getElementById('email');
let phoneNumberInput = document.getElementById('phone-number');
let githubInput = document.getElementById('github-link');
let websiteInput = document.getElementById('website');

let firstNameValidation = document.getElementById('first-name-validation');
let lastNameValidation = document.getElementById('last-name-validation');
let emailValidation = document.getElementById('email-validation');
let phoneNumberValidation = document.getElementById('phone-number-validation');
let githubValidation = document.getElementById('github-validation');
let websiteValidation = document.getElementById('website-validation');

let emailFlag = 0;
let websiteFlag = 0;
let firstNameFlag = 0;
let lastNameFlag = 0;
let phoneNumberFlag = 0;
let githubFlag = 0;

let onChangeInput = (idName) => {
    if (idName === 'email') {
        let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        let result = (emailInput.value).match(emailRegex);
        if (emailInput.value === '') {
            emailValidation.innerText = 'Please Enter Email Address';
            emailFlag = 0;
        }
        else {
            if (!result) {
                emailValidation.innerText = 'Invalid Email Address';
                emailFlag = 0;
            }
            else
                emailValidation.innerText = '';
            emailFlag = 1;
        }

    }
    else if (idName === 'first-name') {
        let nameRegex = /^[a-zA-Z ]{2,30}$/;

        let result = (firstNameInput.value).match(nameRegex);
        if (firstNameInput.value === '') {
            firstNameValidation.innerText = 'Please Enter Name';
            firstNameFlag = 0;
        }
        else {
            if (!result) {
                firstNameValidation.innerText = 'Invalid First Name';
                firstNameFlag = 0;
            }
            else {
                firstNameValidation.innerText = '';
                firstNameFlag = 1;
            }
        }
    }
    else if (idName === 'last-name') {
        let nameRegex = /^[a-zA-Z ]{2,30}$/;

        let result = (lastNameInput.value).match(nameRegex);
        if (lastNameInput.value === '') {
            lastNameValidation.innerText = 'Please Enter Name';
            lastNameFlag = 0;
        }
        else {
            if (!result) {
                lastNameValidation.innerText = 'Invalid First Name';
                lastNameFlag = 0;
            }
            else {
                lastNameValidation.innerText = '';
                lastNameFlag = 1;
            }
        }
    }
    else if (idName === 'github') {
        let regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

        let result = (githubInput.value).match(regex);
        if (githubInput.value === '') {
            githubValidation.innerText = 'Please Enter Github Id';
            githubFlag = 0;
        }
        else {
            if (!result) {
                githubValidation.innerText = '';
                    githubFlag = 1;
            }
            githubValidation.innerText = '';
            githubFlag = 1;
        }
    }
    else if (idName === 'website') {
        let regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

        let result = (websiteInput.value).match(regex);
        if (websiteInput.value === '') {
            websiteValidation.innerText = 'Please Enter Website';
            websiteFlag = 0
        }
        else {
            if (!result) {
                websiteValidation.innerText = 'Invalid Website';
                websiteFlag = 0
            }
            else {
                websiteValidation.innerText = '';
                websiteFlag = 1;
            }
        }
    }
    else if (idName === 'phone-number') {
        let phoneRegex = /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g;

        let result = (phoneNumberInput.value).match(phoneRegex);
        if (phoneNumberInput.value === '') {
            phoneNumberValidation.innerText = 'Please Enter Phone Number';
            phoneNumberFlag = 0
        }
        else {
            if (!result) {
                phoneNumberValidation.innerText = 'Invalid Phone Number';
                phoneNumberFlag = 0
            }
            else {
                phoneNumberValidation.innerText = '';
                phoneNumberFlag = 1;
            }
        }
    }
};

let submitForm = async() => {
    let jsonData = {
        'first_name': firstNameInput.value,
        'last_name': lastNameInput.value,
        'email': emailInput.value,
        'phone_number': phoneNumberInput.value,
        'website': websiteInput.value,
        'github': githubInput.value,
    }

    await axios.post(
        '/.netlify/functions/update', {
            'data': jsonData,
            'folder_name': userName,
            'sha': sha
        }
    ).then((res) => {
        console.log(res);
    }).catch((err) => {
        //
    });
};

let displayTheData = () => {
    getFileDataResponse = sessionStorage.getItem("file-data");
    getFileDataResponse = JSON.parse(getFileDataResponse);
    let fileData = JSON.parse(atob(getFileDataResponse.content));
    let sha = getFileDataResponse.sha;
    console.log(getFileDataResponse);
    console.log("---------------------------------");
    console.log(sha);
    console.log("---------------------------------");
    console.log(fileData);

    firstNameInput.value = fileData.first_name;
    lastNameInput.value = fileData.last_name;
    emailInput.value = fileData.email;
    phoneNumberInput.value = fileData.phone_number;
    websiteInput.value = fileData.website;
    githubInput.value = fileData.github;
}

displayTheData();