let visitingCardData;
const templateTheme1 = document.getElementById('theme-1');
const templateTheme2 = document.getElementById('theme-2');
const updateThemeCard = document.getElementById('update-theme-card');

const displayCardTheme1 = () => {
    const theme1 = templateTheme1.content.cloneNode(true);
    theme1.querySelector('.name-theme-1').innerText = visitingCardData.name;
    theme1.querySelector('.title-theme-1').innerText = visitingCardData.title ? visitingCardData.title : '';
    theme1.querySelector('.phone-number-theme-1').innerText = visitingCardData.phone_number;
    theme1.querySelector('.email-theme-1').innerText = visitingCardData.email;
    theme1.querySelector('.website-theme-1').innerText = visitingCardData.website;
    theme1.querySelector('.github-theme-1').innerText = visitingCardData.github;
    updateThemeCard.innerHTML = '';
    updateThemeCard.append(theme1);
};

const displayCardTheme2 = () => {
    const theme2 = templateTheme2.content.cloneNode(true);
    theme2.querySelector('.name').innerText = visitingCardData.name;
    theme2.querySelector('.title').innerText = visitingCardData.title ? visitingCardData.title : '';
    theme2.querySelector('.phone-number').innerText = visitingCardData.phone_number;
    theme2.querySelector('.email').innerText = visitingCardData.email;
    theme2.querySelector('.website').innerText = visitingCardData.website;
    theme2.querySelector('.github').innerText = visitingCardData.github;
    updateThemeCard.innerHTML = '';
    updateThemeCard.append(theme2);
};

let livePreviewOfTheme = () => {
    visitingCardData = sessionStorage.getItem("visiting-card-data");
    visitingCardData = JSON.parse(visitingCardData);
    switch (visitingCardData.selected_theme) {
        case 'theme1':
            displayCardTheme1();
            break;
        case 'theme2':
            displayCardTheme2();
            break;
        default:
            break;
    }
}

livePreviewOfTheme();

const queryString = document.location.search;
const paramString = queryString.split('?');

const fetchSpecificCard = async (fileName, folderName) => {
    await axios.post(
        '/fetch-specific-visiting-card', {
        file_name: fileName,
        folder_name: folderName
    }
    ).then((res) => {
        let data = atob(res.data.data.content);
        sessionStorage.removeItem("visiting-card-data");
        sessionStorage.setItem("visiting-card-data", data);
        livePreviewOfTheme();
    });
};

const fetchVisitingCards = async (phoneNumber) => {
    await axios.get(
        '/fetch-phone-numbers'
    ).then((response) => {
        if (response.data.data.status === 403) {
            updateThemeCard.innerHTML = '<h2 class="text-center text-danger mt-5">Something Went Wrong.</h2>';
            return;
        }
        let phoneNumberArray = JSON.parse(window.atob(response.data.data.content));
        phoneNumberArray.forEach(element => {
            if (element.phone_number == phoneNumber) {
                fetchSpecificCard(element.file_name, element.folder_name);
                return;
            }
        });
    });
}

if (queryString) {
    for (let i = 0; i < paramString.length; i++) {
        let pair = paramString[i].split('=');
        fetchVisitingCards(pair[1]);
    }
}
