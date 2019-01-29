function Window() {
    this.windowButton = true;

    this.createWindow = function(nameTitle) {
        
        var n = main.getCount() + 1;
        this.n = n;

        this.root = document.createElement("div");
        this.root.setAttribute("id", "id" + n);
        this.root.setAttribute("class", "window");
        
        this.top = document.createElement("div");
        this.top.setAttribute("class", "window-top");
        this.top.addEventListener("mousedown", main.mouseDown, true);
        this.top.addEventListener("mouseup", main.mouseUp);
        this.top.innerHTML = nameTitle;
        this.root.appendChild(this.top);
        
        if (this.windowButton) {
            var windowButton = document.createElement("div");
            windowButton.setAttribute("class", "window-top-button");
            windowButton.addEventListener("mousedown", main.closeWindow);
            windowButton.innerHTML = "X";
            this.top.appendChild(windowButton);
        }
        
        this.content = document.createElement("div");
        this.content.setAttribute("class", "window-content");
        this.content.addEventListener("mousedown", main.mouseDown);
        this.root.appendChild(this.content);

        var windowBottom = document.createElement("div");
        windowBottom.setAttribute("class", "window-bottom");
        this.root.appendChild(windowBottom);

        this.status = document.createElement("div");
        this.status.setAttribute("class", "window-bottom-lable");
        windowBottom.appendChild(this.status);

        var canvasDrag = '<canvas id="canvasDrag' 
            + n + '" width="14" height="14"></canvas>';

        var windowBButton = document.createElement("div");
        windowBButton.setAttribute("class", "window-bottom-button");
        windowBButton.addEventListener("mousedown", main.mouseDown);
        windowBButton.addEventListener("mouseup", main.mouseUp);
        windowBButton.innerHTML = canvasDrag;
        windowBottom.appendChild(windowBButton);

        main.main.addEventListener("mousemove", main.mouseMove);
        main.main.addEventListener("mouseup", main.mouseUp);
        main.main.appendChild(this.root);

        var top = main.getTop();
        var left = main.getLeft();
        this.wTop = top;
        this.wLeft = left;
        this.root.setAttribute(
            "style", 
            "top:" + top + "px;left:" + left + "px;z-index:" + n + ";");
        main.setTop(top);
        main.setLeft(left);
        main.setCount(n);
        main.zIndex["id" + n] = n;

        var canvas = document.getElementById("canvasDrag" + n);
        var ctx = canvas.getContext("2d");
        ctx.moveTo(0,14);
        ctx.lineTo(10,4);
        
        ctx.moveTo(4,14);
        ctx.lineTo(10,8);
        
        ctx.moveTo(8,14);
        ctx.lineTo(10,12);
        ctx.stroke();

        this.hideEl = true;
        this.limitCount = 0;
        this.limit = 5;
        this.block = 0;
    };
    this.move = function() {
        this.root.setAttribute(
            "style", 
            "top:" + this.wTop + "px;left:" + this.wLeft + "px;z-index:" 
            + this.n + ";");
    }
    this.getContentWidth = function() {
        return this.root.clientWidth;
    };
    this.getContentHeight = function() {
        return this.root.clientHeight;
    };
    this.setContent = function(text) {
        this.content.innerHTML = text;
    };
    this.getContent = function() {
        return this.content.innerHTML;
    };
    this.addContent = function(text) {
        if (this.content.innerHTML == "") {
            this.content.innerHTML = text;
        } else {
            this.content.innerHTML = this.content.innerHTML + "<br />" + text;
        }
    };
    this.setStatus = function(text) {
        this.status.innerHTML = text;
    };
}