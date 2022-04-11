const userName = localStorage.getItem('userDirectory');
const templateWithData = document.getElementById('card-with-data');
const templateWithoutData = document.getElementById('card-without-data');
const row = document.getElementById('row');

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
            axios.post(
                'fetch-specific-visiting-card', {
                file_name: element.name,
                folder_name: userName
            }
            ).then((res) => {
                hideLoading();
                const data = JSON.parse(atob(res.data.data.content));
                const card = templateWithData.content.cloneNode(true);
                const generatedLink = window.location.origin + '/card.html?phone_number=' + data.phone_number;
                const clickCardButton = card.querySelector('.click-card-button');
                const clickModalButton = card.querySelector('.social-modal-box');

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
                card.querySelector('.edit-card-button').onclick = function () { editTheFileData(element.name) };
                card.querySelector('.open-card-button').onclick = function () { getTheFileData(element.name) };
                clickModalButton.setAttribute('id', 'share-div-modal-' + data.phone_number);
                clickCardButton.setAttribute('data-bs-toggle', 'modal');
                clickCardButton.setAttribute('data-bs-target', '#share-div-modal-' + data.phone_number);
                card.querySelector('.copy-link').onclick = function () {
                    navigator.clipboard.writeText(generatedLink);
                    alertify.success('Link Copied Successfully.');
                };
                card.querySelector('.twitter-link').href = 'https://twitter.com/intent/tweet?text=Digital Visiting Card of ' + data.name + '&url=' + generatedLink;
                card.querySelector('.facebook-link').href = 'https://www.facebook.com/sharer/sharer.php?u=' + generatedLink + '&quote=' + 'Digital Visiting Card of ' + data.name;
                card.querySelector('.linkedin-link').href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + generatedLink;
                row.append(card);
            });
        });
    });
};

fetchAllCards();

const editTheFileData = async (fileName) => {
    displayLoading();
    await axios.post(
        '/fetch-specific-visiting-card', {
        file_name: fileName,
        folder_name: userName
    }
    ).then((res) => {
        const data = res.data.data;
        sessionStorage.removeItem("visiting-card-data");
        sessionStorage.setItem("visiting-card-data", JSON.stringify(data));
        location.replace('manage.html');
    });
};

const getTheFileData = async (fileName) => {
    displayLoading();
    await axios.post(
        '/fetch-specific-visiting-card', {
        file_name: fileName,
        folder_name: userName
    }
    ).then((res) => {
        let data = atob(res.data.data.content);
        sessionStorage.setItem("visiting-card-data", data);
        location.replace('card.html');
    });
};