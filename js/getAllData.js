axios.post(
    '/.netlify/functions/read',
).then((res) => {
    let datas = res.data.data;
    datas.forEach(element => {
        let name = element.name;
        let html = `<div class="card" style="width: 18rem;">
            <div class="card-body">
                <h6 class="card-title fs-6">`+ name +`</h6>
                <button class="btn btn-outline-primary" onclick="getTheFileData('`+name+`')">click</button>
            </div>
        </div>`;

        document.getElementById('row').innerHTML += html;
    });
}).catch((err) => {
    console.log(err);
});

function getTheFileData(fileName) {
    axios.post(
        '/.netlify/functions/readOneFile',
        fileName
    ).then((res) => {
        let data = atob(res.data.data.content);
        sessionStorage.setItem("fileData", data);
        location.replace('index.html');
    });
}