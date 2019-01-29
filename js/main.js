var main = new Main();
main.load();

var mainHeight = document.getElementById("main");
var height;
function myResize() {
    height = window.innerHeight;
    height -= 40;
    mainHeight.style.height = height + "px";
};
myResize();
document.body.onresize = myResize;

function Main() {
    this.main = document.getElementById("main");
    this.count = 0;
    this.top = 0;
    this.left = 0;
    this.zIndex = {};

    this.getHeight = function() {
        return this.main.clientHeight;
    };
    this.getWidth = function() {
        return this.main.clientWidth;
    };
    this.getCount = function() {
        return this.count;
    };
    this.setCount = function(count) {
        this.count = count; 
    };
    this.getTop = function() {
        return this.top;
    };
    this.setTop = function(top) {
        if (top == undefined) {
            this.top = 0;
        } else {
            this.top = top + 50;
        }
    };
    this.getLeft = function() {
        return this.left;
    };
    this.setLeft = function(left) {
        if (left == undefined) {
            this.left = 0;
        } else {
            this.left = left + 50;
        }
    };
    this.mouseDown = function(event) {
        var el = main.findIdForEvent(event);
        main.changeZIndex(el);
        main.dragElement = el;
        if (this.className == "window-top") {
            main.move = true;
            main[el.id].top.style.cursor = "move";
        }
        if (this.className == "window-bottom-button") {
            main.resize = true;
        }
        main.Y0 = event.clientY;
        main.X0 = event.clientX;
        main.topY = main.findPx(el.style.top);
        main.leftX = main.findPx(el.style.left);
        main.clientHeight = el.getElementsByClassName("window-content")[0]
            .offsetHeight;
        main.clientWidth = el.getElementsByClassName("window-content")[0]
            .offsetWidth;
    };
    this.mouseMove = function(event) {
        var myY = event.clientY - main.Y0;
        var myX = event.clientX - main.X0;
        if (main.move) {
            main.main.style.MozUserSelect = 'none';
            main.dragElement.style.top = main.topY + myY + "px";
            main.dragElement.style.left = main.leftX + myX + "px";
        }
        if (main.resize) {
            main.main.style.MozUserSelect = 'none';
            var reSizeEl = main.dragElement
                .getElementsByClassName("window-content")[0];
            reSizeEl.style.maxWidth = "none";
            reSizeEl.style.maxHeight = "none";
            var shiftX = 30;//old = 25
            var shiftY = 20;
            reSizeEl.style.width = (Number(main.clientWidth) + myX - shiftX) 
                + "px";
            reSizeEl.style.height = (Number(main.clientHeight) + myY - shiftY) 
                + "px";
        }
    };
    this.mouseUp = function() {
        main.move = false;
        main.resize = false;
        main.main.style.MozUserSelect = 'auto';
        if (this.className == "window-top") {
            main[main.dragElement.id].top.style.cursor = "pointer";
            main.setTop(main.findPx(main.dragElement.style.top));
            main.setLeft(main.findPx(main.dragElement.style.left));
        }
        
    };
    this.closeWindow = function() {
        if (this.parentNode != undefined) {
            if (this.parentNode.innerHTML.search("Обновление") == 0) {
                main.interval = setInterval(checkUpdate, main.sec*1000);
            }
        }
        main.move = false;
        var el = main.dragElement;
        el.style.animationName = "close";
        //main.sleep(1000);
        main.main.removeChild(el);
        delete main.zIndex[el.id];
        delete main[el.id];
        main.maxZIndex();
    };
    this.sleep = function(milliseconds) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + milliseconds);
    };
    this.changeZIndex = function(el) {
        var newId = el.id;
        var newZIndex = el.style.zIndex;
        var x;
        for (x in this.zIndex) {
            if (this.zIndex[x] > newZIndex) {
                this.zIndex[x] -= 1;
                document.getElementById(x).style.zIndex = this.zIndex[x];
            }
        }
        this.zIndex[newId] = this.getCount();
        el.style.zIndex = this.zIndex[newId];
        this.setTop(this.findPx(el.style.top));
        this.setLeft(this.findPx(el.style.left));
    };
    this.maxZIndex = function() {
        var x;
        var max = 0;
        var maxId;
        for (x in this.zIndex) {
            if (this.zIndex[x] > max) {
                max = this.zIndex[x];
                maxId = x;
            }   
        }
        if (maxId != undefined) {
            var el = document.getElementById(maxId);
            this.setTop(this.findPx(el.style.top));
            this.setLeft(this.findPx(el.style.left));
        } else {
            this.setTop();
            this.setLeft();
        }
    };
    this.findPx = function(px) {
        return Number(px.slice(0, px.search("px")));
    };
    this.findIdForEvent = function(el) {
        var target = el.target.parentNode;
        while (target.className != "window") {
            target = target.parentNode;
        }
        return target;
    };
    this.findId = function(el) {
        while (el.className != "window") {
            el = el.parentNode;
        }
        return el;
    };
    this.addWindow = function(window) {
        this["id" + this.getCount()] = window;
        return "id" + this.getCount();
    };
    this.load = function () {
        document.body.onload = function() {
            login();
        };
    };
}