checkUpdate();
main.sec = 60;
main.interval = setInterval(checkUpdate, main.sec*1000);

function update() {
    var myWindow = new Window();
    myWindow.createWindow("Обновление");
    main.addWindow(myWindow);
    var text = 'Доступно обновление...'
        + '<div class="button" onclick="updateReload()">Обновить</div>';
    myWindow.setContent(text);
}

function checkUpdate() {
    var myJson = JSON.stringify({
        "file":"ver"
    });
    var ajax = new Ajax();
    ajax.open(null, "php/clientRead.php", checkUpdateRequest);
    ajax.send("q=" + myJson);
}

function checkUpdateRequest(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    if (localStorage.getItem("ver") != myObj.request) {
        main.ver = myObj.request;
        clearInterval(main.interval);
        update();
    } 
}

function updateReload() {
    localStorage.setItem("ver", main.ver);
    window.location.reload(true);
}