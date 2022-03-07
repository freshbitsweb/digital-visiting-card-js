let card = document.getElementById('card');
let firstField = document.getElementById('first');
let lastField = document.getElementById('last');
let titleField = document.getElementById('title');
let websiteField = document.getElementById('website');
let gmailField = document.getElementById('gmail');
let githubField = document.getElementById('github');
let phoneNumberField = document.getElementById('phone-number');

getFileData = sessionStorage.getItem("fileData");
getFileData = JSON.parse(getFileData);
firstField.innerHTML = getFileData.name;
lastField.innerHTML = getFileData.name;
titleField.innerHTML = getFileData.name;
websiteField.innerHTML = getFileData.name;
gmailField.innerHTML = getFileData.name;
gmailField.href = getFileData.email;
phoneNumberField.innerHTML = getFileData.name;
githubField.innerHTML = getFileData.name;
githubField.href = getFileData.name;

card.classList.remove('d-none');
