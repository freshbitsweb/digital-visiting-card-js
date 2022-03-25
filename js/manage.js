const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneNumberInput = document.getElementById('phone-number');
const githubInput = document.getElementById('github-link');
const websiteInput = document.getElementById('website');
const titleInput = document.getElementById('title');
let fileName = '',
    phoneNumberTemp = '';
const submitButton = document.querySelector("#submit-button");
const userName = localStorage.getItem('userDirectory');
const date = new Date();
const seconds = date.getSeconds();

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

    if (phoneNumberFlag == true && emailFlag == true && nameFlag == true && websiteFlag == true && githubFlag == true) {
        submitButton.setAttribute('disabled', true);
		displayLoading();
        await axios.post(
            '/.netlify/functions/fetchPhoneNumbers',
		).then((res) => {
			fileName = (nameInput.value).replace(' ', '_') + '_' + seconds + '.json';

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
        });
        return;
    }
};

const updateThePhoneNumber = (shaName, phoneNumberArray) => {
    phoneNumberArray.push(
        { 'file_name': fileName, 'folder_name': userName, 'phone_number': parseInt(phoneNumberInput.value) }
    );
    axios.post(
        '/.netlify/functions/updatePhoneNumbersList', {
            'sha': shaName,
            'data': phoneNumberArray
        }).then(() => {
			createData();
		}).catch(() => {
			hideLoading();
			submitButton.removeAttribute('disabled');
		})
	;
}

const createData = async () => {
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
        '/.netlify/functions/createNewCard', {
            'data': jsonData,
			'folder_name': userName,
			'file_name': fileName
        }
    ).then(() => {
        window.location.href = 'index.html';
    });
}