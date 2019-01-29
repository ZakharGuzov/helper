document.getElementById("logHandling")
    .addEventListener("click", openLogHandling);


function openLogHandling() {
    var myWindow = new Window();
    myWindow.createWindow("Лог - CryptoService 41");
    main.addWindow(myWindow);
    var id = myWindow.root;
    var ajax = new Ajax();
    ajax.open(id, "php/clientLogHandling.php", findFileSize);
    ajax.send();
}

function findFileSize(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    var text = "<div>"
    text += "logs_new/ra_handling.log на " 
        + myObj.date + " " 
        + myObj.time + " размер " 
        + formatSize(myObj.sizeDB) + ".";
    text += "</div>";
    text += '<div class="container">'
        + '<div onclick="refreshLog(this)" class="button">Обновить лог</div>'
        + '<div onclick="searchLH.open()" class="button">Поиск</div></div>';
        //+ '<div onclick="searchLogHandling()" class="button">Поиск</div></div>';
    main[id.id].setContent(text);
}

function refreshLog(el) {
    var id = main.findId(el);
    main[id.id].setStatus("Проверка лога");
    var ajax = new Ajax();
    ajax.open(id, "php/clientCheckLogHandling.php", checkLogHandling);
    ajax.send();
}

function checkLogHandling(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    if (!myObj.lock) {
        main[id.id].webSize = myObj.webSize;
        if (!myObj.download) {
            main[id.id].setStatus("Обновление не требуется");
        } else {
            main[id.id].setStatus("Загрузка файла");
            var ajax = new Ajax();
            ajax.open(id, "php/clientDownloadLogHandling.php", 
                downloadLogHandling);
            ajax.send();
        }
    } else {
        main[id.id].setStatus("Обновление уже запущено другим процессом");
    }
}

function downloadLogHandling(id, xhttp) {
    main[id.id].setStatus("Чтение файла");
    var ajax = new Ajax();
    ajax.open(id, "php/clientReadLogHandling.php", readLogHandling);
    ajax.send();
}


function readLogHandling(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    var x;
    var count = 0;
    var myJson;
    var ajax = new Ajax();
    main[id.id].count = 0;
    for (x in myObj.arr) {
        count++;
        if (count > 1 ) {
            myJson = JSON.stringify({ "query": 
                'INSERT INTO `certificatelog_v4`(`date`, `time`, `all`) VALUES ("'
                + myObj.arr[x][0] + '", "' 
                + myObj.arr[x][1] + '", "'
                + myObj.arr[x][2] + '")'});
            ajax.open(id, "php/clientInsert.php", insertCertificatLog);
            ajax.send("q=" + myJson);
        }
    }
    main[id.id].sum = count - 1;
    myJson = JSON.stringify({"query":
        'UPDATE `temp` SET `text2`= "'
        + main[id.id].webSize + '" WHERE `text1` = "logs_new/ra_handling.log"'});
    ajax.open(id, "php/clientInsert.php", function(){});
    ajax.send("q=" + myJson);
    main[id.id].setStatus("Записано в БД: " + count);
}

function insertCertificatLog(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    if (myObj.insert) {
        main[id.id].count++;
        main[id.id].setStatus("Запись в БД: " + main[id.id].count 
            + "/" + main[id.id].sum);
        if (main[id.id].count == main[id.id].sum) {
            main[id.id].setStatus("Записано в БД: " + main[id.id].count);
            var ajax = new Ajax();
            ajax.open(id, "php/clientLogHandling.php", findFileSize);
            ajax.send();
        }
    }
}

function formatSize(size) {
    var b = ["б","Кб","Мб","Гб"];
    var s = 0;
    while (size > 1024) {
        size /= 1024;
        s++;
    }
    return size.toFixed(2).replace(".", ",") + " " + b[s];
}