const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const phoneNumberInput = document.getElementById('phone-number');
const githubInput = document.getElementById('github-link');
const websiteInput = document.getElementById('website');
const titleInput = document.getElementById('title');
const sha = document.getElementById('sha');
const fileNameInput = document.getElementById('file-name');
const getFileDataResponse = sessionStorage.getItem("visiting-card-data");
const fileName = '',
    phoneNumberTemp = '';
const submitButton = document.querySelector("#submit-button");
const userName = localStorage.getItem('username');

const firstNameValidation = document.getElementById('first-name-validation');
const lastNameValidation = document.getElementById('last-name-validation');
const emailValidation = document.getElementById('email-validation');
const phoneNumberValidation = document.getElementById('phone-number-validation');
const githubValidation = document.getElementById('github-validation');
const websiteValidation = document.getElementById('website-validation');

const emailFlag = false;
const websiteFlag = false;
const firstNameFlag = false;
const lastNameFlag = false;
const phoneNumberFlag = false;
const githubFlag = false;

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const nameRegex = /^[a-zA-Z ]{2,30}$/;
const websiteRegex = /^(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\\/\\/=]*)$/gi;
const phoneRegex = /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g;
const githubRegex = /^(https:\/\/)github.com[:/](.*)$/g;

const checkValidation = () => {
    if (emailInput.value === '') {
        emailValidation.innerText = 'Please Enter Email Address';
        emailFlag = false;
    } else {
        const result = (emailInput.value).match(emailRegex);
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
        const result = (firstNameInput.value).match(nameRegex);
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
        const result = (lastNameInput.value).match(nameRegex);
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
        const result = (githubInput.value).match(githubRegex);
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
        const result = (websiteInput.value).match(websiteRegex);
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
        const result = (phoneNumberInput.value).match(phoneRegex);
        if (!result) {
            phoneNumberValidation.innerText = 'Invalid Phone Number';
            phoneNumberFlag = false;
            return;
        }

        phoneNumberValidation.innerText = '';
        phoneNumberFlag = true;
    }
};

const submitForm = async () => {
    checkValidation();

    if (phoneNumberFlag == true && emailFlag == true && firstNameFlag == true && lastNameFlag == true && websiteFlag == true && githubFlag == true) {
        submitButton.setAttribute('disabled', true);
        displayLoading();
        await axios.post(
            '/.netlify/functions/fetchPhoneNumbers',
        ).then((res) => {
            const phoneNumberArray = JSON.parse(window.atob(res.data.data.content));
            const shaName = res.data.data.sha;

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

const displayTheData = () => {
    getFileDataResponse = sessionStorage.getItem("visiting-card-data");
    getFileDataResponse = JSON.parse(getFileDataResponse);

    const fileData = JSON.parse(atob(getFileDataResponse.content));
    const shaValue = getFileDataResponse.sha;
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

const updateThePhoneNumber = (shaName, phoneNumberArray) => {
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

const createData = async () => {
    const jsonData = {
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

const updateData = async () => {
    const jsonData = {
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