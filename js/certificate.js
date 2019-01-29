document.getElementById("certificate")
    .addEventListener("click", openCertificate);

//--
var nick = ["1m__", "bm__", "1c__", "bc__", "1k__", "bk__", "1p__", "bp__"];

function openCertificate() {
    var myWindow = new Window();
    myWindow.createWindow("Сертификаты");
    main.addWindow(myWindow);
    showCertificate(myWindow);
}

function showCertificate(el) {
    var id = el.root;
    var text = '<div class="container">'
        + '<div class="button" onclick="checkCertificate(this)">'
        + 'Обновить лог</div>'
        + '<div class="button" onclick="openReportCertificate()">Отчет</div>'
        + '</div>';
    text += '<div>';
    for (var i = 0; i < nick.length; i++) {
        text += '<div id="' + id.id + nick[i] + '" class="lamp">' 
            + nick[i][0] + nick[i][1] + '</div>';
    }
    text += '</div>';
    text += '<div id="table' + id.id + '"></div>';
    main[id.id].setContent(text);
    main[id.id].query = 'SELECT * FROM `certificate` ORDER BY `startD` DESC, `startT` DESC';
    drawTable(id);
}

function drawTable(id) {
    var myJson = JSON.stringify({'query': main[id.id].query + ' LIMIT ' 
        + main[id.id].limitCount + ',' + main[id.id].limit});
    var ajax = new Ajax();
    ajax.open(id, "php/clientSelect.php", showTable);
    ajax.send("q=" + myJson);
}

function drawTable_(id) {
    var myJson = JSON.stringify({'query':"SELECT * FROM `certificate` " 
        + "ORDER BY `startD` DESC, `startT` DESC LIMIT " 
        + main[id.id].limitCount + "," + main[id.id].limit});
    var ajax = new Ajax();
    ajax.open(id, "php/clientSelect.php", showTable);
    ajax.send("q=" + myJson);
}

function showTable(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    var fLatter = firstLatter(myObj);    
    var x;
    var div;
    main[id.id].hideEl ? div = '<div class="hide button">' : div = '<div class="button">';    
    for (x in myObj) {
        if (typeof myObj[x] == "object" && myObj[x] != null) {
            div += '<input type="checkbox" ' + checkField(myObj, fLatter, x) 
                + ' onchange="changeField(this)" value="' + fLatter + "_" + x 
                + '">' + x;
        } else {
            delete myObj[x];
        }
    } 
    div += '</div>';
    //var canvasSetting = '<canvas id="myCanvas" width="15" height="15" style="border:1px solid red;">'
    var table = 
        '<div class="container">'
        + '<div onclick="previous(this)" class="button next-to"><-</div>'
        + '<div onclick="next(this)" class="button next-to">-></div>'
        + '<div class="button next-to" onclick="hide(this)">*</div>'
        + div
        +'</div>';
    table += '<table>';
    var xTmp;
    var xArray = [];
    for (x in myObj) {
        table += '<th>' + x + '</th>';
        xArray[x] = x;
        xTmp = x;
    }
    for (x in myObj[xArray[xTmp]]) {
        table += '<tr>';
        for (y in xArray) {
            table += '<td>' + myObj[y][x] + '</td>';
        }
        table += '</tr>'
    }
    table += '</table>';
    document.getElementById("table" + id.id).innerHTML = table;
    //main[id.id].addContent(table);
    /*
    <canvas id="myCanvas" width="100" height="100" style="border:1px solid #d3d3d3;">
    Your browser does not support the HTML5 canvas tag.</canvas>

    var h = 100;
    var w = 100;
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.rotate(45*Math.PI/180);

    var x = 35;
    ctx.fillRect(x,-x,w/2,h/2);

    ctx.rotate(-45*Math.PI/180);
    ctx.fillRect(25,10,w/2,h/2);

    ctx.beginPath();
    ctx.arc(50,35,18,0,2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();*/
}

function hide(el) {
    var id = main.findId(el);
    if (el.parentElement.lastChild.className == "hide button") {
        el.parentElement.lastChild.className = "button";
        el.parentElement.lastChild.style.display = "inline-block";
        main[id.id].hideEl = false;
    } else {
        el.parentElement.lastChild.className = "hide button";
        el.parentElement.lastChild.style.display = "";
        main[id.id].hideEl = true;
    }

}

function checkCertificate(el) {
    var id = main.findId(el);
    var myJson;
    var state;
    showCertificate(main[id.id]);
    myJson = JSON.stringify({
        "lock":"certificate.lock",
        "close":false
    });
    var ajax = new Ajax();
    ajax.open(id, "php/clientLock.php", downloadCertificate);
    ajax.send("q=" + myJson);
}

function downloadCertificate(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    var myJson;
    main[id.id].setStatus("Проверка");
    if (myObj.lock) {
        for (var i = 0; i < nick.length; i++) {
            myJson = JSON.stringify({
                "fileName":"http://10.200.121.24/cc/search.php?Nick=" 
                    + nick[i] + "&FIO=&Organization=&Unit=&SN=&OID=",
                "saveName": nick[i]
            });
            myJson = encodeURIComponent(myJson);
            document.getElementById(id.id + nick[i]).style
                .backgroundColor = "grey";
            var ajax = new Ajax();
            ajax.open(id, "php/clientDownload.php", checkSizeCertificate);
            ajax.send("q=" + myJson);
            main[id.id].block++;
        }
    } else {
        main[id.id].setStatus("Обновление уже запущено другим процессом");
    }
}


function checkSizeCertificate(id, xhttp) {
    var myJson = xhttp.responseText;
    var myObj = JSON.parse(xhttp.responseText);
    main[id.id].setStatus("Проверен " + myObj.saveName);
    var ajax = new Ajax();
    ajax.open(id, "php/clientCheckCertificate.php", updateCertificate);
    ajax.send("q=" + myJson);
}

function updateCertificate(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    if (myObj.update) {
        document.getElementById(id.id + myObj.nick)
            .style.backgroundColor = "red";
        var myJson = JSON.stringify({
            "fileName":"http://10.200.121.24/cc/search.php?FIO=&Nick="
            + myObj.nick + "&Organization=&Unit=&SN=&OID=&Count="
            + myObj.sizeFile + "&Page=0&ReadVar="
            + (myObj.sizeFile - myObj.sizeDB) + "&SortType=7&SortOrder=DESC",
            "saveName": myObj.nick
        });
        myJson = encodeURIComponent(myJson);
        var ajax = new Ajax();
        ajax.open(id, "php/clientDownload.php", searchWhatCertificateUpdate);
        ajax.send("q=" + myJson);
    } else {
        document.getElementById(id.id + myObj.nick)
            .style.backgroundColor = "yellow";
        lessBlock(id);
    }
}

function searchWhatCertificateUpdate(id, xhttp) {
    var myJson = xhttp.responseText;
    var myObj = JSON.parse(xhttp.responseText);
    main[id.id].setStatus("Загружен " + myObj.saveName);
    var ajax = new Ajax();
    ajax.open(id, "php/clientSearchWhatUpdateCertificate.php", finish);
    ajax.send("q=" + myJson);
    lessBlock(id);
}

function finish(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    main[id.id].setStatus("");
    document.getElementById(id.id + myObj.nick).style.backgroundColor = "green";
    drawTable(id);
}

function lessBlock(id) {
    main[id.id].block--;
    if (main[id.id].block == 0) {
        var myJson = JSON.stringify({
            "lock":"certificate.lock",
            "close":true
        });
        main[id.id].setStatus("");
        var ajax = new Ajax();
        ajax.open(id, "php/clientLock.php", function(){});
        ajax.send("q=" + myJson);
    }
}

function openReportCertificate() {
    var myWindow = new Window();
    myWindow.createWindow("Отчет");
    var id = main.addWindow(myWindow);
    showReportCertificate(id);
}

function showReportCertificate(id) {
    var d = new Date();
    var dateNow = formatDate(d);
    var text = 'Отчет по количеству сертификатов по нику<br />'
        + '<form name="report' + id + '" method="post" onsubmit="return submitCertificate(this)">'
            + 'Дата с:<input type="date" name="dateFrom" value="' + dateNow + '">'
            + 'Дата по:<input type="date" name="dateTo" value="' + dateNow + '">'
            + '<input type="submit">'
        + '</form>'
    text += '<table>';
    for (var i = 0; i < nick.length; i++) {
        text += '<th>' + nick[i][0] + nick[i][1] + '</th>';
    }
    text += '<th>Итого</th><tr>';
    for (var i = 0; i < nick.length; i++) {
        text += '<td id="report_' + nick[i][0] + nick[i][1] + '"></td>';
    }
    text += '<td id="sum'+ id +'"></td></tr></table>';
    main[id].setContent(text);
}

function submitCertificate(e) {
    var id = main.findId(e);
    var dateFrom = document.forms["report" + id.id]["dateFrom"].value;
    var dateTo = document.forms["report" + id.id]["dateTo"].value;
    var myJson;
    var ajax = new Ajax();
    main[id.id].sum = 0;
    for (var i = 0; i < nick.length; i++) {
        myJson = JSON.stringify({
            "transfer":nick[i][0] + nick[i][1],
            "query":'SELECT count(*) FROM `certificate` WHERE `nike` like "' 
                + nick[i][0] + nick[i][1] + '%" AND startD >= "' + dateFrom + '" '
                + 'AND startD <= "' + dateTo + '"'
        });
        ajax.open(id, "php/clientSelect.php", submitCertificateRequest);
        ajax.send("q=" + myJson);
    }
    return false;
}

function submitCertificateRequest(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    document.getElementById("report_" + myObj.transfer).innerHTML = 
        myObj["count(*)"][0];
    main[id.id].sum += Number(myObj["count(*)"][0]);
    document.getElementById("sum" + id.id).innerHTML = main[id.id].sum;

}

function previous(el) {
    var id = main.findId(el);
    if (main[id.id].limitCount > 0) {
        main[id.id].limitCount -= main[id.id].limit;
        drawTable(id);
    }
}

function next(el) {
    var id = main.findId(el);
    main[id.id].limitCount += main[id.id].limit;
    drawTable(id);
}

function firstLatter(obj) {
    var x;
    var key = "";
    for (x in obj) {
        key += x[0];
    }
    return key;
}

function checkField(obj, fLatter, field) {
    var key = fLatter + "_" + field;
    if (localStorage.getItem(key) == null) {
        localStorage.setItem(key, "true");
        return "checked"
    }
    if (localStorage.getItem(key) == "false") {
        delete obj[field];
        return "";
    }
    return "checked";
}

function changeField(el) {
    var id = main.findId(el);
    if (el.checked == false) {
        localStorage.setItem(el.value, "false");
    }
    if (el.checked == true) {
        localStorage.setItem(el.value, "true");
    }
    drawTable(id);
}