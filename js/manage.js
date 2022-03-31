const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneNumberInput = document.getElementById('phone-number');
const githubInput = document.getElementById('github-link');
const websiteInput = document.getElementById('website');
const titleInput = document.getElementById('title');
let fileName = '',
    fileNameTemp = '',
    phoneNumberTemp = '',
    nameTemp;
const submitButton = document.querySelector("#submit-button");
const userName = localStorage.getItem('userDirectory');
const date = new Date();
const seconds = date.getSeconds();
const fileNameInput = document.getElementById('file-name');
let getFileDataResponse = sessionStorage.getItem("visiting-card-data");

const nameValidation = document.getElementById('name-validation');
const emailValidation = document.getElementById('email-validation');
const phoneNumberValidation = document.getElementById('phone-number-validation');
const githubValidation = document.getElementById('github-validation');
const websiteValidation = document.getElementById('website-validation');

let emailFlag = false;
let websiteFlag = false;
let nameFlag = false;
let phoneNumberFlag = false;
let githubFlag = false;

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

    if (nameInput.value === '') {
        nameValidation.innerText = 'Please Enter Name';
        nameFlag = false;
    } else {
        let result = (nameInput.value).match(nameRegex);
        if (!result) {
            nameValidation.innerText = 'Invalid Name';
            nameFlag = false;
            return;
        }

        nameValidation.innerText = '';
        nameFlag = true;
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

    if (phoneNumberFlag != true || emailFlag != true || nameFlag != true || websiteFlag != true || githubFlag != true) {
        return;
    }
    submitButton.setAttribute('disabled', true);
    displayLoading();
    await axios.post(
        '/fetch-phone-numbers',
    ).then((response) => {
        fileName = (nameInput.value).replace(' ', '_') + '_' + seconds + '.json';

        const phoneNumberArray = JSON.parse(window.atob(response.data.data.content));
        const shaName = response.data.data.sha;

        if (phoneNumberInput.value != phoneNumberTemp) {
            if (phoneNumberArray.find(phoneNumber => phoneNumber.phone_number === parseInt(phoneNumberInput.value))) {
                phoneNumberValidation.innerHTML = 'Phone Number is already taken.';
                submitButton.removeAttribute('disabled');
                hideLoading();
                return;
            }
            if (nameTemp && nameTemp !== nameInput.value) {
                phoneNumberArray.forEach((element, index) => {
                    if (element.file_name == fileNameInput.value) {
                        phoneNumberArray.splice(index, 1);
                    }
                });
                deleteVisitingCardData(shaName, phoneNumberArray);
            }
            if (fileNameTemp == fileNameInput.value) {
                phoneNumberArray.forEach((element, index) => {
                    if (element.file_name == fileNameTemp) {
                        phoneNumberArray.splice(index, 1);
                    }
                });
                updateVisitingCardData(shaName, phoneNumberArray);
                return;
            }
            createNewVisitingCard(shaName, phoneNumberArray);
            return;
        }

        updateVisitingCardData();
    });
};

const updateThePhoneNumber = async (shaName, phoneNumberArray, fileNameParameter = fileName) => {
    phoneNumberArray.push(
        { 'file_name': fileNameParameter, 'folder_name': userName, 'phone_number': parseInt(phoneNumberInput.value) }
    );
    await axios.post(
        '/update-phone-number', {
            'sha': shaName,
            'data': phoneNumberArray
        }).then(() => {
            window.location.href = 'index.html';
        })
    ;
}

const createNewVisitingCard = async (shaName, phoneNumberArray) => {
    const jsonData = {
        'name': nameInput.value,
        'title': titleInput.value,
        'email': emailInput.value,
        'phone_number': phoneNumberInput.value,
        'website': websiteInput.value,
        'github': githubInput.value,
    };

    displayLoading();
    await axios.post(
        '/create-new-visiting-card', {
            'data': jsonData,
            'folder_name': userName,
            'file_name': fileName
        }
    ).then(() => {
        updateThePhoneNumber(shaName, phoneNumberArray);
    });
}

const updateVisitingCardData = async (shaName, phoneNumberArray) => {
    const jsonData = {
        'name': nameInput.value,
        'title': titleInput.value,
        'email': emailInput.value,
        'phone_number': phoneNumberInput.value,
        'website': websiteInput.value,
        'github': githubInput.value,
    };

    displayLoading();
    await axios.post(
        '/update-visiting-card', {
            'data': jsonData,
            'folder_name': userName,
            'file_name': fileNameInput.value,
            'sha': sha.value
        }
    ).then(() => {
        localStorage.removeItem('visiting-card-data');
        if (shaName !== '' && phoneNumberArray !== '') {
            updateThePhoneNumber(shaName, phoneNumberArray, fileNameInput.value);
        }
        window.location.href = 'index.html';
    });
}

const deleteVisitingCardData = async (shaName, phoneNumberArray) => {
    displayLoading();
    await axios.post(
        '/delete-visiting-card', {
            'folder_name': userName,
            'file_name': fileNameInput.value,
            'sha': sha.value
        }
    ).then(() => {
        createNewVisitingCard(shaName, phoneNumberArray);
    });
}

const displayTheDataInVisitingCard = () => {
    getFileDataResponse = JSON.parse(getFileDataResponse);

    const fileData = JSON.parse(atob(getFileDataResponse.content));

    fileNameTemp = getFileDataResponse.name;
    fileNameInput.value = fileNameTemp;
    sha.value = getFileDataResponse.sha;;
    nameTemp = fileData.name;

    nameInput.value = fileData.name;
    titleInput.value = fileData.title ? fileData.title : '';
    emailInput.value = fileData.email;
    phoneNumberInput.value = fileData.phone_number;
    phoneNumberTemp = fileData.phone_number;
    websiteInput.value = fileData.website;
    githubInput.value = fileData.github;

    document.getElementById('submit-button').innerText = 'Update';
}

if (getFileDataResponse) {
    displayTheDataInVisitingCard();
}