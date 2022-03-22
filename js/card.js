let visitingCardData= sessionStorage.getItem("visiting-card-data");
visitingCardData = JSON.parse(visitingCardData);
let firstName = (visitingCardData.name).split(' ')[0];
let lastName = (visitingCardData.name).split(' ')[1];
document.getElementById('first').innerHTML = firstName;
document.getElementById('last').innerHTML = lastName;
document.getElementById('title').innerHTML = visitingCardData.title ? visitingCardData.title : '';
document.getElementById('gmail').innerHTML = visitingCardData.email;
document.getElementById('phone-number').innerHTML = visitingCardData.phone_number;
document.getElementById('whatsapp').href = 'https://wa.me/' + visitingCardData.phone_number;
document.getElementById('phone-number').href = 'tel:' + visitingCardData.phone_number;
document.getElementById('gmail').href = 'mailto:' + visitingCardData.email;
document.getElementById('github').href = visitingCardData.github;
document.getElementById('website').href = visitingCardData.website;

let queryString = document.location.search;
let paramString = queryString.split('?')[1];
let params_arr = paramString.split('&');

const fetchSpecificCard = async (fileName, folderName) => {
    await axios.post(
        '/.netlify/functions/getSpecificVisitingCard', {
        file_name: fileName,
        folder_name: folderName
    }
    ).then((res) => {
        let data = atob(res.data.data.content);
        sessionStorage.removeItem("visiting-card-data");
        sessionStorage.setItem("visiting-card-data", data);
    });
};

const fetchVisitingCards = async (phoneNumber) => {
    await axios.post(
        '/.netlify/functions/fetchPhoneNumbers'
    ).then((res) => {
        let phoneNumberArray = JSON.parse(window.atob(res.data.data.content))
        phoneNumberArray.forEach(element => {
            if (element.phone_number == phoneNumber) {
                fetchSpecificCard(element.file_name, element.folder_name);
                return;
            }
        });
    });
}

for (let i = 0; i < params_arr.length; i++) {
    let pair = params_arr[i].split('=');
    fetchVisitingCards(pair[1]);
}