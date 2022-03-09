axios.post(
    '/.netlify/functions/read', {
        folder_name: userName
    }
).then((res) => {
    let allData = res.data.data;
    allData.forEach(element => {
        let name = element.name;
        let html = `
            <div class="col-12 col-lg-3 col-md-4 col-sm-6">
                <div class="card mt-4" style="width: 18rem;">
                    <div class="card-body">
                        <h6 class="card-title">${name}</h6>
                        <button class="btn btn-outline-primary"
                            onclick="getTheFileData('${name}')"
                        >
                            Click
                        </button>

                        <button class="btn btn-outline-primary"
                            onclick="editTheFileData('${name}')"
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('row').innerHTML += html;
    });
}).catch((err) => {
    console.log(err);
});

function getTheFileData(fileName) {
    axios.post(
        '/.netlify/functions/readOneFile', {
            file_name: fileName,
            folder_name: userName
        }
    ).then((res) => {
        let data = atob(res.data.data.content);
        sessionStorage.setItem("fileData", data);
        location.replace('card.html');
    });
}

function editTheFileData(fileName) {
    axios.post(
        '/.netlify/functions/readOneFile', {
            file_name: fileName,
            folder_name: userName
        }
    ).then((res) => {
        let data = res.data.data;
        sessionStorage.setItem("file-data", JSON.stringify(data));
        location.replace('manage.html');
    });
}
