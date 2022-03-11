let card = document.getElementById('card');
let firstField = document.getElementById('first');
let lastField = document.getElementById('last');
let titleField = document.getElementById('title');
let websiteField = document.getElementById('website');
let gmailField = document.getElementById('gmail');
let githubField = document.getElementById('github');
let phoneNumberField = document.getElementById('phone-number');
let whatsapp = document.getElementById('whatsapp');


getFileData = sessionStorage.getItem("fileData");
getFileData = JSON.parse(getFileData);
firstField.innerHTML = getFileData.first_name;
lastField.innerHTML = getFileData.last_name;
titleField.innerHTML = getFileData.title ? getFileData.title : '';
gmailField.innerHTML = getFileData.email;
phoneNumberField.innerHTML = getFileData.phone_number;
whatsapp.href = 'https://wa.me/' + getFileData.phone_number;
phoneNumberField.href = 'tel:' + getFileData.phone_number;
gmailField.href = 'mailto:' + getFileData.email;
githubField.href = getFileData.github;
websiteField.href = getFileData.website
