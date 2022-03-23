let userName = localStorage.getItem('username');
const templateWithData = document.getElementById('card-with-data');
const templateWithoutData = document.getElementById('card-without-data');
const row = document.getElementById('row');

const fetchAllCards = async () => {
    displayLoading();
    await axios.post(
        '/.netlify/functions/getVisitingCards', {
        folder_name: userName
    }
    ).then((response) => {
        let allData = response.data.data;
        if (allData.status == 404) {
            const card = templateWithoutData.content.cloneNode(true);
            hideLoading();
            row.append(card);
            return;
        }

        hideLoading();
        allData.forEach(element => {
            displayLoading();
            axios.post(
                '/.netlify/functions/getSpecificVisitingCard', {
                file_name: element.name,
                folder_name: userName
            }
            ).then((res) => {
                hideLoading();
                let data = JSON.parse(atob(res.data.data.content));
                const card = templateWithData.content.cloneNode(true);
                card.querySelector('.card-name').innerHTML = data.name;
                card.querySelector('.card-title').innerHTML = data.title ? data.title : '';
                card.querySelector('.card-phone').innerHTML = data.phone_number;
                card.querySelector('.card-phone').href = 'tel:' + data.phone_number;
                card.querySelector('.card-gmail').innerHTML = data.email;
                card.querySelector('.card-gmail').href = 'mailto:' + data.email;
                card.querySelector('.card-website').innerHTML = data.website;
                card.querySelector('.card-website').href = data.website;
                card.querySelector('.card-github').innerHTML = data.github;
                card.querySelector('.card-github').href = data.github;
                row.append(card);
            });
            // card.querySelector('.click-card-button').onclick = function () { getTheFileData(filename) };
            // card.querySelector('.edit-card-button').onclick = function () { editTheFileData(filename) };

        });
    });
};

fetchAllCards();

const getTheFileData = async (fileName) => {
    displayLoading();
    await axios.post(
        '/.netlify/functions/getSpecificVisitingCard', {
        file_name: fileName,
        folder_name: userName
    }
    ).then((res) => {
        let data = atob(res.data.data.content);
        sessionStorage.setItem("visiting-card-data", data);
        location.replace('card.html');
    });
};

const editTheFileData = async (fileName) => {
    displayLoading();
    await axios.post(
        '/.netlify/functions/getSpecificVisitingCard', {
        file_name: fileName,
        folder_name: userName
    }
    ).then((res) => {
        let data = res.data.data;
        sessionStorage.removeItem("visiting-card-data");
        sessionStorage.setItem("visiting-card-data", JSON.stringify(data));
        location.replace('manage.html');
    });
};