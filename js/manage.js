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
const templateTheme1 = document.getElementById('theme-1');
const templateTheme2 = document.getElementById('theme-2');
const updateThemeCard = document.getElementById('update-theme-card');
let getFileDataResponse = sessionStorage.getItem("visiting-card-data");
let themeSelect = document.getElementById('theme-select');

const nameValidation = document.getElementById('name-validation');
const emailValidation = document.getElementById('email-validation');
const phoneNumberValidation = document.getElementById('phone-number-validation');
const githubValidation = document.getElementById('github-validation');
const websiteValidation = document.getElementById('website-validation');
const themeValidation = document.getElementById('theme-validation');

let emailFlag = false;
let websiteFlag = false;
let nameFlag = false;
let phoneNumberFlag = false;
let githubFlag = false;
let themeFlag = false;

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

    if (themeSelect.value === '') {
        themeValidation.innerText = 'Please Select Theme';
        themeFlag = false;
    }
};

const submitForm = async () => {
    livePreviewOfTheme();
    checkValidation();

    if (phoneNumberFlag != true ||
        emailFlag != true ||
        nameFlag != true ||
        websiteFlag != true ||
        githubFlag != true ||
        themeFlag != true
    ) {
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
            phoneNumberArray.forEach((element, index) => {
                if (element.file_name == fileNameInput.value) {
                    phoneNumberArray.splice(index, 1);
                }
            });
            deleteVisitingCardData(shaName, phoneNumberArray);
        } else if (nameTemp && nameTemp !== nameInput.value) {
            phoneNumberArray.forEach((element, index) => {
                if (element.file_name == fileNameInput.value) {
                    phoneNumberArray.splice(index, 1);
                }
            });
            deleteVisitingCardData(shaName, phoneNumberArray);
        } else if (fileNameTemp == fileNameInput.value && nameTemp == nameInput.value && phoneNumberInput.value == phoneNumberTemp) {
            updateVisitingCardData();
            return;
        }
        createNewVisitingCard(shaName, phoneNumberArray);
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
        'selected_theme': themeSelect.value,
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
        'selected_theme': themeSelect.value,
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

const displayCardTheme1 = () => {
    const theme1 = templateTheme1.content.cloneNode(true);

    theme1.querySelector('.name-theme-1').innerText = nameInput.value;
    theme1.querySelector('.title-theme-1').innerText = titleInput.value ? titleInput.value : '';
    theme1.querySelector('.phone-number-theme-1').innerText = phoneNumberInput.value;
    theme1.querySelector('.email-theme-1').innerText = emailInput.value;
    theme1.querySelector('.website-theme-1').innerText = websiteInput.value;
    theme1.querySelector('.github-theme-1').innerText = githubInput.value;
    updateThemeCard.innerHTML = '';
    updateThemeCard.append(theme1);
};

const displayCardTheme2 = () => {
    const theme2 = templateTheme2.content.cloneNode(true);

    theme2.querySelector('.name').innerText = nameInput.value;
    theme2.querySelector('.title').innerText = titleInput.value ? titleInput.value : '';
    theme2.querySelector('.phone-number').innerText = phoneNumberInput.value;
    theme2.querySelector('.email').innerText = emailInput.value;
    theme2.querySelector('.website').innerText = websiteInput.value;
    theme2.querySelector('.github').innerText = githubInput.value;
    updateThemeCard.innerHTML = '';
    updateThemeCard.append(theme2);
};

let livePreviewOfTheme = () => {
    switch (themeSelect.value) {
        case 'theme1':
            displayCardTheme1();
            break;
        case 'theme2':
            displayCardTheme2();
            break;
        default:
            break;
    }
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
    themeSelect.value = fileData.selected_theme;
    livePreviewOfTheme();

    document.getElementById('submit-button').innerText = 'Update';
}

if (getFileDataResponse) {
    displayTheDataInVisitingCard();
}