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
let fileName = '', phoneNumberTemp = '';

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

let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
let nameRegex = /^[a-zA-Z ]{2,30}$/;
let websiteRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
let phoneRegex = /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g;

let checkValidation = () => {
    if (emailInput.value === '') {
        emailValidation.innerText = 'Please Enter Email Address';
        emailFlag = 0;
    }
    else {
        let result = (emailInput.value).match(emailRegex);
        if (!result) {
            emailValidation.innerText = 'Invalid Email Address';
            emailFlag = 0;
        }
        else
            emailValidation.innerText = '';
        emailFlag = 1;
    }

    if (firstNameInput.value === '') {
        firstNameValidation.innerText = 'Please Enter Name';
        firstNameFlag = 0;
    }
    else {
        let result = (firstNameInput.value).match(nameRegex);
        if (!result) {
            firstNameValidation.innerText = 'Invalid First Name';
            firstNameFlag = 0;
        }
        else {
            firstNameValidation.innerText = '';
            firstNameFlag = 1;
        }
    }

    if (lastNameInput.value === '') {
        lastNameValidation.innerText = 'Please Enter Name';
        lastNameFlag = 0;
    }
    else {
        let result = (lastNameInput.value).match(nameRegex);
        if (!result) {
            lastNameValidation.innerText = 'Invalid First Name';
            lastNameFlag = 0;
        }
        else {
            lastNameValidation.innerText = '';
            lastNameFlag = 1;
        }
    }

    if (githubInput.value === '') {
        githubValidation.innerText = 'Please Enter Github Id';
        githubFlag = 0;
    }
    else {
        let result = (githubInput.value).match(websiteRegex);
        if (!result) {
            githubValidation.innerText = '';
                githubFlag = 1;
        }
        githubValidation.innerText = '';
        githubFlag = 1;
    }

    if (websiteInput.value === '') {
        websiteValidation.innerText = 'Please Enter Website';
        websiteFlag = 0
    }
    else {
        let result = (websiteInput.value).match(websiteRegex);
        if (!result) {
            websiteValidation.innerText = 'Invalid Website';
            websiteFlag = 0
        }
        else {
            websiteValidation.innerText = '';
            websiteFlag = 1;
        }
    }

    if (phoneNumberInput.value === '') {
        phoneNumberValidation.innerText = 'Please Enter Phone Number';
        phoneNumberFlag = 0
    }
    else {
        let result = (phoneNumberInput.value).match(phoneRegex);
        if (!result) {
            phoneNumberValidation.innerText = 'Invalid Phone Number';
            phoneNumberFlag = 0
        }
        else {
            phoneNumberValidation.innerText = '';
            phoneNumberFlag = 1;
        }
    }

    submitForm();
};

let submitForm = async () => {
    if (phoneNumberFlag == 1 && emailFlag == 1 && firstNameFlag == 1 && lastNameFlag == 1 && websiteFlag == 1 && githubFlag == 1) {
        await axios.post(
            '/.netlify/functions/getThePhoneNumber',
        ).then((res) => {
            let phoneNumberArray = JSON.parse(window.atob(res.data.data.content));
            let shaName = res.data.data.sha;

            if (!fileName || phoneNumberInput.value != phoneNumberTemp) {
                phoneNumberArray.includes(parseInt(phoneNumberInput.value)) ?
                    phoneNumberValidation.innerHTML = 'Phone Number is already taken.' :
                    updateThePhoneNumber(shaName, phoneNumberArray)
                ;
                return;
            }

            updateData();

        }).catch((err) => {
        });
        return;
    }

    checkValidation();
};

let displayTheData = () => {
    getFileDataResponse = sessionStorage.getItem("file-data");
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
        '/.netlify/functions/updateThePhoneNumber', {
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

    await axios.post(
        '/.netlify/functions/create', {
            'data': jsonData,
            'folder_name': userName
        }
    ).then((res) => {
        window.location.href = 'index.html';
    }).catch((err) => {
        //
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

    await axios.post(
        '/.netlify/functions/update', {
            'data': jsonData,
            'folder_name': userName,
            "file_name": fileNameInput.value,
            'sha': sha.value
        }
    ).then((res) => {
        localStorage.removeItem('file-data');
        window.location.href = 'index.html';
    }).catch((err) => {
        //
    });
}
