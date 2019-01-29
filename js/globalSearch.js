var gS = new globalSearch();

document.getElementById("globalSearch")
    .addEventListener("click", gS.open);

function globalSearch() {
    this.open = function(){
        gS.window = new Window();
        gS.window.createWindow("Глобальный поиск");
        gS.show();
        main.addWindow(gS.window);
    };
    this.show = function(){
        var text = '<form method="post" name="globalSearch_id' + this.window.n + '" '
            + 'onsubmit="return gS.search(this)">'
            + '<input type="text" name="search">'
            + '</form>'
            + '<div id="result_id' + this.window.n + '"></div>';
        this.window.setContent(text);
    };
    this.search = function(e){
        var id = main.findId(e);
        var value = document.forms["globalSearch_" + id.id]["search"].value;
        document.getElementById('result_' + id.id).innerHTML = '';
        this.table_userblock(id, value);
        this.table_certificate_fio(id, value);
        this.table_certificate_nike(id, value);
        this.table_certificate_company(id, value);
        this.table_certificate_identification(id, value);
        return false;
    };
    this.table = function(id, query, describe, field){
        var myJson = JSON.stringify({
            'query':query});
        myJson = encodeURIComponent(myJson);
        var ajax = new Ajax();
        ajax.open(id, "php/clientSelect.php", function(id, xhttp){
            var myObj = JSON.parse(xhttp.responseText);
            var text;
            if (myObj.result) {
                text = '<div onclick="gS.hide(this)">' + describe + ' [' 
                    + myObj[field].length + ']:'
                    + '<div style="display: none;">'
                    + gS.showArray(myObj[field])
                    + '</div></div>';
            } else {
                text = '<div>' + describe + ' [0]:</div>';
            }
            var result = document.getElementById('result_' + id.id);
            if (result.innerHTML == '') {
                result.innerHTML = text;
            } else {
                result.innerHTML += text;
            }
        });
        ajax.send("q=" + myJson);
    };
    this.table_userblock = function(id, value){
        var query = 'SELECT * FROM `userblock` WHERE `fio` LIKE "%' 
            + value + '%" GROUP BY `fio` ORDER BY `fio`';
        var describe = 'Блокировка бользователей';
        this.table(id, query, describe, 'fio');
    };
    this.table_certificate_fio = function(id, value){
        var query = 'SELECT * FROM `certificate` WHERE `fio` LIKE "%' 
            + value + '%" GROUP BY `fio` ORDER BY `fio`';
        var describe = 'Сертификаты_fio';
        this.table(id, query, describe, 'fio');
    };
    this.table_certificate_nike = function(id, value){
        var query = 'SELECT * FROM `certificate` WHERE `nike` LIKE "%' 
            + value + '%" GROUP BY `nike` ORDER BY `nike`';
        var describe = 'Сертификаты_nike';
        this.table(id, query, describe, 'nike');
    };
    this.table_certificate_company = function(id, value){
        var query = 'SELECT * FROM `certificate` WHERE `company` LIKE "%' 
            + value + '%" GROUP BY `company` ORDER BY `company`';
        var describe = 'Сертификаты_company';
        this.table(id, query, describe, 'company');
    };
    this.table_certificate_identification = function(id, value){
        var query = 'SELECT * FROM `certificate` WHERE `identification` LIKE "%' 
            + value + '%" GROUP BY `identification` ORDER BY `identification`';
        var describe = 'Сертификаты_identification';
        this.table(id, query, describe, 'identification');
    };
    this.hide = function(e){
        if (e.lastChild.style.display == 'none') {
            e.lastChild.style.display = 'block';
        } else {
            e.lastChild.style.display = 'none';
        }
    };
    this.request = function(e){
        var value = e.innerHTML;
        var query = e.parentElement.parentElement.innerHTML;
        if (query.search("Блокировка бользователей") == 0) {
            query = 'SELECT * FROM `userblock` WHERE `fio` = "' + value + '"'
                + ' ORDER BY `date1` DESC';
        }
        if (query.search("Сертификаты_fio") == 0) {
            query = 'SELECT * FROM `certificate` WHERE `fio` = "' + value + '"'
                + ' ORDER BY `startD` DESC';
        }
        if (query.search("Сертификаты_nike") == 0) {
            query = 'SELECT * FROM `certificate` WHERE `nike` = "' + value + '"'
                + ' ORDER BY `startD` DESC';
        }
        if (query.search("Сертификаты_company") == 0) {
            query = "SELECT * FROM `certificate` WHERE `company` = '" 
                + value + "' ORDER BY `startD` DESC";
        }
        if (query.search("Сертификаты_identification") == 0) {
            query = 'SELECT * FROM `certificate` WHERE `identification` = "' 
                + value + '" ORDER BY `startD` DESC';
        }
        this.openOne(query);
    };
    this.openOne = function(query){
        var tmp = new Window();
        tmp.createWindow("Поиск...");
        var id = tmp.root;
        var text = '<div id="table' + id.id + '"></div>';
        tmp.setContent(text);
        tmp.query = query;
        main.addWindow(tmp);
        drawTable(id);
    };
    this.showArray = function(array){
        var text = '';
        for(var x in array) {
            text += '<div class="button" onclick="gS.request(this)">' 
                + array[x] + '</div>';
        }
        return text;
    };
}