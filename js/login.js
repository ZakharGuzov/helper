function login() {
    var myWindow = new Window();
    myWindow.windowButton = false;

    myWindow.createWindow("Вход");
    myWindow.setContent(showLogin());

    myWindow.wLeft = (main.getWidth() / 2) - (myWindow.getContentWidth() / 2);
    myWindow.wTop = (main.getHeight() / 2) - (myWindow.getContentHeight() / 2);
    myWindow.move();

    main.addWindow(myWindow);
    main.dragElement = myWindow.root;
}

function showLogin() {
    var text = '<form method="post" name="login" onsubmit="return checkLogin(this)">'
        + '<p>Пользователь</p>'
        + '<input type="text" name="user">'
        + '<p>Пароль</p>'
        + '<input type="password" name="password">'
        + '<p><input type="submit" value="Вход"></p>'
        + '</form>';
    return text;
}

function checkLogin(e) {
    var user = document.forms["login"]["user"].value;
    var password = document.forms["login"]["password"].value;
    var id = main.findId(e);
    var myJson = JSON.stringify({
        'query':'SELECT * FROM `users` WHERE `user` = "' + user 
        + '" AND `paswd` = "' + password + '"'
    });
    var ajax = new Ajax();
    ajax.open(id, "php/clientSelect.php", requestCheckLog);
    ajax.send("q=" + myJson);
    return false;
}

function requestCheckLog(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    if (myObj.result) {
        showMenu();
    } else {
        alert('Введен неправильно логин и/или пароль');
    }
}

function addScript(script) {
    var node = document.createElement("script");
    node.setAttribute("src", script);
    document.body.appendChild(node);
}

function showMenu() {
    var text = '<span class="dropdown-menu">Меню</span>'
        + '<div class="dropdown-content">'
        + '<a href="#" id="logHandling" class="button">Лог - CryptoService 41</a>'
        + '<a href="#" id="certificate" class="button">Сертификаты</a>'
        + '<a href="#" id="freeNike" class="button">Свободные ники</a>'
        + '<a href="#" id="globalSearch" class="button">Глобальный поиск</a>'
        + '</div>';
    document.getElementById("dropdown").innerHTML = text;

    addScript("js/LogHandling.js?20190129");
    addScript("js/search.js?20190129");
    addScript("js/certificate.js?20190129");
    addScript("js/freeNike.js?20190129");
    addScript("js/globalSearch.js?20190129");
    main.closeWindow();
}