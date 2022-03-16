displayLoading();
let userName = localStorage.getItem('username');
const templateWithData = document.getElementById('card-with-data');
const templateWithoutData = document.getElementById('card-without-data');
const row = document.getElementById('row');

axios.post(
    '/.netlify/functions/getVisitingCards', {
        folder_name: userName
    }
).then((res) => {
    let allData = res.data.data;
    if (allData.status == 404) {
        const card = templateWithoutData.content.cloneNode(true);
        hideLoading();
        row.append(card);
        return;
    }

    hideLoading();
    allData.forEach(element => {
        let name = element.name;
        const card = templateWithData.content.cloneNode(true);
        card.querySelector('.card-name').innerText = name;
        card.querySelector('.click-card-button').onclick = function() { getTheFileData(name) };
        card.querySelector('.edit-card-button').onclick = function() { editTheFileData(name) };

        row.append(card);
    });
}).catch((err) => {});

function getTheFileData(fileName) {
    displayLoading();
    axios.post(
        '/.netlify/functions/getSpecificVisitingCard', {
            file_name: fileName,
            folder_name: userName
        }
    ).then((res) => {
        let data = atob(res.data.data.content);
        sessionStorage.setItem("visiting-card-data", data);
        location.replace('card.html');
    });
}

function editTheFileData(fileName) {
    displayLoading();
    axios.post(
        '/.netlify/functions/getSpecificVisitingCard', {
            file_name: fileName,
            folder_name: userName
        }
    ).then((res) => {
        let data = res.data.data;
        sessionStorage.setItem("visiting-card-data", JSON.stringify(data));
        location.replace('manage.html');
    });
}