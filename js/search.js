var searchLH = new searchLogHandling();

function searchLogHandling() {
    this.open = function(){
        this.window = new Window();
        this.window.createWindow("Поиск");
        main.addWindow(this.window);
        var text = '<form method="post" '
            + 'onsubmit="return searchLH.submit(this)">'
            + '<input type="text" name="search">'
            + '</form>'
            + '<div id="tableid' + this.window.n + '"></div>';
        this.window.setContent(text);
    };
    this.submit = function(e){
        var search = e['search'].value;
        if (search != "") {
            this.window.query = "SELECT * FROM `certificatelog_v4` WHERE `all` like '%" 
                + search + "%' ORDER BY `date` DESC, `time` DESC";
            var myJson = JSON.stringify({'query':this.window.query});
            myJson = encodeURIComponent(myJson);
            var id = this.window.root;
            drawTable(id);
        }
        return false;
    };
}
/*
function searchLogHandling() {
    var myWindow = new Window();
    myWindow.createWindow("Поиск");
    main.addWindow(myWindow);
    var id = myWindow.root;
    var text = '<form method="post" onsubmit="return searchSubmitLogHandling(this)">';
    text += '<input type="text" name="search" autofocus>';
    text += '</form>';
    text += '<div class="result"></div>';
    main[id.id].setContent(text);
}

function searchSubmitLogHandling(el) {
    var search = el['search'].value;
    if (search != "") {
        var myJson = JSON.stringify({'query':"SELECT * FROM `certificatelog_v4`"
            + " WHERE `all` like '%" + search + "%'" 
            + " ORDER BY `date` DESC, `time` DESC"});
        myJson = encodeURIComponent(myJson);
        var id = main.findId(el);
        var ajax = new Ajax();
        ajax.open(id, "php/clientSearchLogHandling.php", getSearchLogHandling);
        ajax.send("q=" + myJson);
    }
    return false;
}

function getSearchLogHandling(id, xhttp) {
    var myObj = JSON.parse(xhttp.responseText);
    id.getElementsByClassName("result")[0].innerHTML = displayTable(myObj);
}

function displayTable(myObj) {
    var table = '<table>';
    var x;
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
    return table + '</table>';
}*/