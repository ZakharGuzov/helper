document.getElementById("freeNike")
    .addEventListener("click", openFreeNike);

//--
function openFreeNike() {
    var myWindow = new Window();
    myWindow.createWindow("Свободные ники");
    main.addWindow(myWindow);
    showFreeNike(myWindow);
}

function showFreeNike(el) {
    var id = el.root;//main.findId(el);
    main[id.id].setStatus("Запрос");
    var myJson = JSON.stringify({"query":'SELECT * FROM `freenike` ' 
        + 'WHERE `nike` LIKE "bm__"'});
    var ajax = new Ajax();
    ajax.open(id, "php/clientSelect.php", showFreeNikeRequest);
    ajax.send("q=" + myJson);
}

function showFreeNikeRequest(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    if (myObj.result) {
        main[id.id].setStatus("Готово");
        secondCheckFreeNike(id);
    } else {
        main[id.id].setStatus("Поиск свободных ников");
        main[id.id].setContent("Ждите...");
        findFreeNike(id);
    }
}

function secondCheckFreeNike(id) {
    var date = new Date();
    var dateNow = formatDate(date);
    date.setFullYear(date.getFullYear() - 3);
    var date_3 = formatDate(date);
    var myJson = JSON.stringify({"query":'SELECT * FROM `freenike` '
        + 'WHERE `datelast` < "' + date_3 + '" AND `datetmp` < "' + dateNow 
        + '" AND `datecheck` < "' + dateNow + '" ORDER BY `nike`'});
    var ajax = new Ajax();
    ajax.open(id, "php/clientSelect.php", secondCheckFreeNikeRequest);
    ajax.send("q=" + myJson);    
}

function secondCheckFreeNikeRequest(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    if (!myObj.result) {
        showFreeNikeMore3Years(id);
    } else {
        main[id.id].setContent("Ждите...");
        secondUpdateFreeNike(id, myObj);
    }
}

function secondUpdateFreeNike(id, myObj) {
    main.findFreeNikeRequest = 0;
    main.findFreeNike = 0;
    var myJson;
    var ajax = new Ajax();
    for (x in myObj.nike) { 
        myJson = JSON.stringify({
            "transfer":myObj.nike[x],
            "query":'SELECT * FROM `certificate` WHERE `nike` = "'
            + myObj.nike[x] + '" ORDER BY `endD` DESC LIMIT 1'});
        ajax.open(id, "php/clientSelect.php", secondUpdateFreeNikeRequest);
        ajax.send("q=" + myJson);
    }
}

function secondUpdateFreeNikeRequest(id, xhttp) {
    main.findFreeNikeSum = ++main.findFreeNikeRequest;
    var myObj = JSON.parse(xhttp.responseText);
    var myJson;
    var date = new Date();
    date = formatDate(date);
    if (myObj.result) {
        myJson = JSON.stringify({"query":'UPDATE `freenike` SET `datelast` = "' 
            + myObj.endD + '", `datecheck` = "' + date + '"'
            + ' WHERE `nike`="' + myObj.transfer + '"'});

        secondUpdate2FreeNike(id, myObj, myJson);
    } else {
        myJson = JSON.stringify({"query":'UPDATE `freenike` SET `datecheck` = "' 
            + date + '" WHERE `nike`="' + myObj.transfer + '"'});

        secondUpdate2FreeNike(id, myObj, myJson);
    }
}

function secondUpdate2FreeNike(id, myObj, myJson) {
    var date = new Date();
    date = formatDate(date);
    main[id.id].setStatus("Обновление " + myObj.transfer);
    var ajax = new Ajax();
    ajax.open(id, "php/clientInsert.php", secondUpdate2FreeNikeRequest);
    ajax.send("q=" + myJson);
}

function secondUpdate2FreeNikeRequest(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    if (myObj.insert) {
        main.findFreeNikeRequest--;
        main.findFreeNike++;
        main[id.id].setStatus("Обновлено " + main.findFreeNike + "/"
            + main.findFreeNikeSum);
        if (main.findFreeNikeRequest == 0) {
            main[id.id].setContent("");
            showFreeNikeMore3Years(id);
        }
    }
}

function addZeroToDate(z) {
    if (z.length == 1) z = "0" + z;
    return z;
}

function formatDate(date) {
    return date.getFullYear() + "-" 
        + addZeroToDate(String(date.getMonth() + 1)) + "-" 
        + addZeroToDate(String(date.getDate())); 
}

function showFreeNikeMore3Years(id) {
    main[id.id].setStatus("Запрос");
    var date = new Date();
    var dateNow = formatDate(date);
    date.setFullYear(date.getFullYear() - 3);
    var date_3 = formatDate(date);
    var myJson = JSON.stringify({"query":'SELECT * FROM `freenike` '
        + 'WHERE `datelast` < "' + date_3 + '" AND `datetmp` < "' + dateNow 
        + '" ORDER BY `nike`'});
    var ajax = new Ajax();
    ajax.open(id, "php/clientSelect.php", showFreeNikeMore3YearsRequest);
    ajax.send("q=" + myJson);
}

function showFreeNikeMore3YearsRequest(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    var text = "";
    var tmp = "";
    for (x in myObj.nike) {
        if (tmp != myObj.nike[x].slice(0,3)) {
            tmp = myObj.nike[x].slice(0,3);
            if (text != "") text += "<br /><br />";
        }
        text += '<div class="button" onclick="takeFreeNike(this)">' 
            + myObj.nike[x] + '</div>';
    }
    main[id.id].addContent(text);
    if (myObj.result) {
        main[id.id].setStatus("Количество свободных ников: " 
            + myObj.nike.length);
    }
}

function takeFreeNike(el) {
    var nike = el.innerHTML;
    var id = main.findId(el);
    checkUpdateFreeNike(id, nike);
}

function checkUpdateFreeNike(id, nike) {
    var date = new Date();
    date.setMonth(date.getMonth() + 1);
    date = formatDate(date);
    var myJson = JSON.stringify({"query":'SELECT * FROM `freenike` '
        + 'WHERE `nike` = "' + nike + '" AND `datetmp` = "' + date + '" ',
        "transfer":nike});
    var ajax = new Ajax();
    ajax.open(id, "php/clientSelect.php", checkUpdateFreeNikeRequest);
    ajax.send("q=" + myJson);
}

function checkUpdateFreeNikeRequest(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    if (!myObj.result) {
        updateFreeNike(id, myObj.transfer);
        main[id.id].setContent("Взят " + myObj.transfer + "<br />");
    } else {
        main[id.id].setContent("Кто-то уже взял " + myObj.transfer 
            + ". Возьми другой!<br />");
        showFreeNikeMore3Years(id);
    }
}

function updateFreeNike(id, nike) {
    var date = new Date();
    date.setMonth(date.getMonth() + 1);
    date = formatDate(date);
    var myJson = JSON.stringify({"query":'UPDATE `freenike` SET `datetmp` = "' 
        + date + '" WHERE `nike`="' + nike + '"'});
    var ajax = new Ajax();
    ajax.open(id, "php/clientInsert.php", updateFreeNikeRequest);
    ajax.send("q=" + myJson);
}

function updateFreeNikeRequest(id, xhttp) {
    showFreeNikeMore3Years(id);
}

function findFreeNike(id) {
    main.findFreeNike = 0;
    main.findFreeNikeRequest = 0;
    var i, j, l = 0;
    var arr = [];
    for (i = 48; i < 58; i++) {
        arr[l++] = String.fromCharCode(i);
    }
    for (i = 97; i < 123; i++) {
        arr[l++] = String.fromCharCode(i);
    }
    var myJson;
    var ajax = new Ajax();
    l = 0;
    for (i = 0; i < arr.length; i++) {
        for (j = 0; j < arr.length; j++) {
            main[id.id].setStatus("Запрос bm" + arr[i] + arr[j]);
            myJson = JSON.stringify({
                "transfer":"bm" + arr[i] + arr[j],
                "query":'SELECT * FROM `certificate` WHERE `nike` = "bm'
                + arr[i] + arr[j] + '" ORDER BY `endD` DESC LIMIT 1'});
            ajax.open(id, "php/clientSelect.php", findFreeNikeRequest);
            ajax.send("q=" + myJson);
            l++;  
        }
    }
}

function findFreeNikeRequest(id, xhttp) {
    main.findFreeNikeSum = ++main.findFreeNikeRequest;
    var myObj = JSON.parse(xhttp.responseText);
    main[id.id].setStatus("Ответ " + myObj.transfer);
    var myJson;
    if (myObj.result) {
        myJson = JSON.stringify({
            "query":'INSERT INTO `freenike`(`nike`, `datelast`, `datecheck`)'
            + ' VALUES ("' + myObj.transfer + '", "' + myObj.endD + '", "' 
            + date + '")'});
        insertFreeNike(id, myObj, myJson);
    } else {
        myJson = JSON.stringify({
            "query":'INSERT INTO `freenike`(`nike`, `datelast`, `datecheck`)'
            + ' VALUES ("' + myObj.transfer + '", "0000-00-00", "' 
            + date + '")'});
        insertFreeNike(id, myObj, myJson);
    }
}

function insertFreeNike(id, myObj, myJson) {
    var date = new Date();
    date = formatDate(date);
    main[id.id].setStatus("Запись " + myObj.transfer);
    var ajax = new Ajax();
    ajax.open(id, "php/clientInsert.php", insertFreeNikeRequest);
    ajax.send("q=" + myJson);
}

function insertFreeNikeRequest(id, xhttp) {  
    var myObj = JSON.parse(xhttp.responseText);
    if (myObj.insert) {
        main.findFreeNikeRequest--;
        main.findFreeNike++;
        main[id.id].setStatus("Записано " + main.findFreeNike + "/"
            + main.findFreeNikeSum);
        if (main.findFreeNikeRequest == 0) {
            main[id.id].setContent("");
            showFreeNikeMore3Years(id);
        }
    }
}

/*
nike = bm__

show:
SELECT * FROM freenike WHERE nike LIKE "bm__"
if request > 0 then show request
if request = 0 then find and insert bmxx

find:
SELECT * FROM certificate WHERE nike = "bmxx" ORDER BY endD LIMIT 1
if request = 1 then insert-> nike, datelast = endD
if request = 0 then insert-> nike, datelast = "0000-00-00"

take nike:
update nike set datetmp = now + 30 days

+-------------------------------+
|freenike                       |
+----+--------+-------+---------+
|nike|datelast|datetmp|datecheck|
+----+--------+-------+---------+

*/