let nameInput = document.getElementById('name');
let emailInput = document.getElementById('email');
let phoneNumberInput = document.getElementById('phone-number');
let addressInput = document.getElementById('address');

let nameValidation = document.getElementById('name-validation');
let emailValidation = document.getElementById('email-validation');
let phoneNumberValidation = document.getElementById('phone-number-validation');
let addressValidation = document.getElementById('address-validation');

let emailFlag = 0;
let addressFlag = 0;
let nameFlag = 0;
let phoneNumberFlag = 0;

var fs = require('fs');

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
    else if (idName === 'name') {
        let nameRegex = /^[a-zA-Z ]{2,30}$/;

        let result = (nameInput.value).match(nameRegex);
        if (nameInput.value === '') {
            nameValidation.innerText = 'Please Enter Name';
            nameFlag = 0;
        }
        else {
            if (!result) {
                nameValidation.innerText = 'Invalid First Name';
                nameFlag = 0;
            }
            else {
                nameValidation.innerText = '';
                nameFlag = 1;
            }
        }
    }
    else if (idName === 'address') {
        if (addressInput.value === '') {
            addressValidation.innerText = 'Please Enter Address';
            addressFlag = 0;
        }
        else {
            addressValidation.innerText = '';
            addressFlag = 1;
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

let submitForm = () => {
    if (nameFlag === 1 && emailFlag === 1 && phoneNumberFlag === 1 && addressFlag === 1) {
        let jsonData = {
            'name': nameInput.value,
            'email': emailInput.value,
            'phone-number': phoneNumberInput.value,
            'address': addressInput.value,
        }

        let fileName = "/js" + nameInput.value + '.json';
        var file = new File([JSON.stringify(jsonData)], fileName, { type: 'application/json' });
        const fs = require('fs');

        var anchor = document.createElement("a");
        anchor.href = URL.createObjectURL(file);
        anchor.download = fileName;
        anchor.click();
        console.log(file);
    }
};