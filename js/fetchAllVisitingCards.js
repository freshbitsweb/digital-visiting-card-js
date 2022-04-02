const userName = localStorage.getItem('userDirectory');
const templateWithData = document.getElementById('card-with-data');
const templateWithoutData = document.getElementById('card-without-data');
const row = document.getElementById('row');
const loadMoreButton = document.getElementById('load-more-button');
let filenames = [];

const fetchAllCards = async () => {
    displayLoading();
    await axios.post(
        'fetch-visiting-cards', {
        folder_name: userName
    }
    ).then((response) => {
        const allData = response.data.data;
        if (allData.status == 404) {
            const card = templateWithoutData.content.cloneNode(true);
            hideLoading();
            card.querySelector('.error-message').innerText = "No Data Found.";
            row.append(card);
            return;
        } else if (allData.status == 403) {
            const card = templateWithoutData.content.cloneNode(true);
            hideLoading();
            card.querySelector('.error-message').innerText = "Something Went Wrong.";
            row.append(card);
            return;
        }

        hideLoading();
        allData.forEach(element => {
            displayLoading();
            filenames.push(element.name);
        });
        loadMoreSpecificDetailsCard();
    });
};

fetchAllCards();

const loadMoreSpecificDetailsCard = async () => {
    for (let i = 0; i <= filenames.length; i++) {
        if (i < 2) {
            await axios.post(
                'fetch-specific-visiting-card', {
                file_name: filenames[filenames.length - 1],
                folder_name: userName
            }
            ).then((res) => {
                hideLoading();
                const data = JSON.parse(atob(res.data.data.content));
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
            filenames.pop();
        }
    }

    if (filenames.length === 0) {
        loadMoreButton.classList += " d-none";
    }
}
