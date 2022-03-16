let firstNameInput = document.getElementById('first-name');
let lastNameInput = document.getElementById('last-name');
let emailInput = document.getElementById('email');
let phoneNumberInput = document.getElementById('phone-number');
let githubInput = document.getElementById('github-link');
let websiteInput = document.getElementById('website');
let titleInput = document.getElementById('title');
let sha = document.getElementById('sha');
let fileNameInput = document.getElementById('file-name');
let getFileDataResponse = sessionStorage.getItem("visiting-card-data");
let fileName = '',
    phoneNumberTemp = '';
let submitButton = document.querySelector("#submit-button");
let userName = localStorage.getItem('username');

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
let websiteRegex = /^(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\\/\\/=]*)$/gi;
let phoneRegex = /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g;
let githubRegex = /^(https:\/\/)github.com[:/](.*)$/g;

let checkValidation = () => {
    if (emailInput.value === '') {
        emailValidation.innerText = 'Please Enter Email Address';
        emailFlag = false;
    } else {
        let result = (emailInput.value).match(emailRegex);
        if (!result) {
            emailValidation.innerText = 'Invalid Email Address';
            emailFlag = false;
            return;
        }

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
            return;
        }

        firstNameValidation.innerText = '';
        firstNameFlag = true;
    }

    if (lastNameInput.value === '') {
        lastNameValidation.innerText = 'Please Enter Name';
        lastNameFlag = false;
    } else {
        let result = (lastNameInput.value).match(nameRegex);
        if (!result) {
            lastNameValidation.innerText = 'Invalid First Name';
            lastNameFlag = false;
            return;
        }

        lastNameValidation.innerText = '';
        lastNameFlag = true;
    }

    if (githubInput.value === '') {
        githubValidation.innerText = 'Please Enter Github Username URL';
        githubFlag = false;
    } else {
        let result = (githubInput.value).match(githubRegex);
        if (!result) {
            githubValidation.innerText = 'Please Enter Proper Github URL (Do add the full url include http or https)';
            githubFlag = false;
            return;
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
            websiteValidation.innerText = 'Invalid Website (Do add the full url include http or https)';
            websiteFlag = false
            return;
        }

        websiteValidation.innerText = '';
        websiteFlag = true;
    }

    if (phoneNumberInput.value === '') {
        phoneNumberValidation.innerText = 'Please Enter Phone Number';
        phoneNumberFlag = false;
    } else {
        let result = (phoneNumberInput.value).match(phoneRegex);
        if (!result) {
            phoneNumberValidation.innerText = 'Invalid Phone Number';
            phoneNumberFlag = false;
            return;
        }

        phoneNumberValidation.innerText = '';
        phoneNumberFlag = true;
    }
};

let submitForm = async () => {
    checkValidation();

    if (phoneNumberFlag == true && emailFlag == true && firstNameFlag == true && lastNameFlag == true && websiteFlag == true && githubFlag == true) {
        submitButton.setAttribute('disabled', true);
        displayLoading();
        await axios.post(
            '/.netlify/functions/fetchPhoneNumbers',
        ).then((res) => {
            let phoneNumberArray = JSON.parse(window.atob(res.data.data.content));
            let shaName = res.data.data.sha;

            if (!fileName || phoneNumberInput.value != phoneNumberTemp) {
                if (phoneNumberArray.includes(parseInt(phoneNumberInput.value))) {
                    phoneNumberValidation.innerHTML = 'Phone Number is already taken.';
                    submitButton.removeAttribute('disabled');
                    hideLoading();
                    return;
                }
                updateThePhoneNumber(shaName, phoneNumberArray);
                return;
            }

            updateData();

        });
        return;
    }
};

let displayTheData = () => {
    getFileDataResponse = sessionStorage.getItem("visiting-card-data");
    getFileDataResponse = JSON.parse(getFileDataResponse);

    let fileData = JSON.parse(atob(getFileDataResponse.content));
    let shaValue = getFileDataResponse.sha;
    fileName = getFileDataResponse.name;
    fileNameInput.value = fileName;
    sha.value = shaValue;

    firstNameInput.value = fileData.first_name;
    lastNameInput.value = fileData.last_name;
    titleInput.value = fileData.title ? fileData.title : '';
    emailInput.value = fileData.email;
    phoneNumberInput.value = fileData.phone_number;
    phoneNumberTemp = fileData.phone_number;
    websiteInput.value = fileData.website;
    githubInput.value = fileData.github;
}

if (getFileDataResponse) {
    displayTheData();
}

let updateThePhoneNumber = (shaName, phoneNumberArray) => {
    phoneNumberArray.push(parseInt(phoneNumberInput.value));
    axios.post(
        '/.netlify/functions/updatePhoneNumbersList', {
            'sha': shaName,
            'data': phoneNumberArray
        }).then(() => {
        if (fileName !== '') {
            updateData();
            return;
        }
        createData();
    });
}

let createData = async () => {
    let jsonData = {
        'first_name': firstNameInput.value,
        'last_name': lastNameInput.value,
        'title': titleInput.value,
        'email': emailInput.value,
        'phone_number': phoneNumberInput.value,
        'website': websiteInput.value,
        'github': githubInput.value,
    };

    displayLoading();
    await axios.post(
        '/.netlify/functions/createNewCard', {
            'data': jsonData,
            'folder_name': userName
        }
    ).then(() => {
        window.location.href = 'index.html';
    });
}

let updateData = async () => {
    let jsonData = {
        'first_name': firstNameInput.value,
        'last_name': lastNameInput.value,
        'title': titleInput.value,
        'email': emailInput.value,
        'phone_number': phoneNumberInput.value,
        'website': websiteInput.value,
        'github': githubInput.value,
    };

    displayLoading();
    await axios.post(
        '/.netlify/functions/updateVisitingCard', {
            'data': jsonData,
            'folder_name': userName,
            "file_name": fileNameInput.value,
            'sha': sha.value
        }
    ).then(() => {
        localStorage.removeItem('visiting-card-data');
        window.location.href = 'index.html';
    });
}