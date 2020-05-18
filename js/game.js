/**
 * Copyright (c) Amur 2020
 *
 * Game Fifteen
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

;(function(game) {
    let positionItems = [];

    let numbersItems = [];

    let emptyItem, itemCount, cof, top, left, parent, width, height, counter, win, selector;

    function init(sel, count = 16) {
        selector = sel;

        parent = game.querySelector(selector);

        parent.innerHTML = "";

        height = width = parent.clientWidth;

        itemCount = count;

        let startContent = game.createElement("div");
        startContent.classList.add("start-content");

        let btnStart = game.createElement("button");
        btnStart.type = "button";
        btnStart.innerText = "Play";

        btnStart.addEventListener("click", start);

        let btnRecorde= game.createElement("button");
        btnRecorde.type = "button";
        btnRecorde.innerText = "Recordes";

        btnRecorde.addEventListener("click", getRecordes);

        startContent.appendChild(btnStart);
        startContent.appendChild(btnRecorde);

        parent.appendChild(startContent);
    };

    function start() {
        counter = 0;
        win = false;
        
        parent.innerHTML = "";

        cof = Math.sqrt(itemCount);

        top = width / cof;
        left = width / cof;

        for(let i = 0; i < cof; i++) {
            for(let j = 0; j < cof; j++) {
                positionItems.push({
                    top: i * top,
                    left: j * left
                });
            }
        }

        for(let i = 1; i < itemCount; i++) {
            numbersItems.push(i);
        }

        emptyItem = Math.random() * itemCount >> 0;

        let moves = game.createElement("div");
        moves.classList.add("moves");

        let movesCounter = game.createElement("span");
        movesCounter.classList.add("moves-counter");
        movesCounter.innerText = "Moves " + counter;
        moves.appendChild(movesCounter);

        let btnStart = game.createElement("button");
        btnStart.type = "button";
        btnStart.innerText = "Restart";

        btnStart.addEventListener("click", start);

        moves.appendChild(btnStart);

        let content = game.createElement("div");
        content.style.width = width + "px";
        content.style.height = height + "px";
        content.style.position = "relative";

        for(let i = 0; i < itemCount; i++) {
            if(i === emptyItem) continue;
            let index = Math.random() * numbersItems.length >> 0;
            let div = game.createElement("div");
            div.classList.add("item");
            div.setAttribute("item-count", numbersItems[index]);
            div.setAttribute("data-left", positionItems[i].left);
            div.setAttribute("data-top", positionItems[i].top);
            div.setAttribute("data-index", i);
            div.style.top = positionItems[i].top + "px";
            div.style.left = positionItems[i].left + "px";
            div.style.width = top + "px";
            div.style.height = left + "px";
            div.addEventListener("click", replacePosition.bind(this));
            content.appendChild(div);
            numbersItems.splice(index, 1);
        }

        let gameFooter = game.createElement("div");
        gameFooter.classList.add("game-footer");

        let btnHome = game.createElement("button");
        btnHome.type = "button";
        btnHome.innerText = "Home";

        btnHome.addEventListener("click", function(e) {
            init(selector, itemCount);
        });

        gameFooter.appendChild(btnHome);

        parent.appendChild(moves);
        parent.appendChild(content);
        parent.appendChild(gameFooter);
        gameEqual();

        win = gameEqualWin();

        if(win) {
            start();
        }
    };

    function setRecordes() {
        let storage = window.localStorage;
        let recordes = storage.getItem("armfifteenrecordes");
        let date = new Date();
        let dateStr =  date.toLocaleString()
        let rec = [{
                count: counter,
                dateStr: dateStr
            }
        ];
        if(recordes === null) {
            recordes = rec;
        }else {
            rec = JSON.parse(recordes);
            rec.push({
                count: counter,
                dateStr: dateStr
            });
            recordes = rec;
            let len = recordes.length;
            let count;
            for(let i = 0; i < len; i++){
                for(let j = 0; j < len; j++){
                    if(recordes[i].count < recordes[j].count){
                        count = recordes[j];
                        recordes[j] = recordes[i];
                        recordes[i] = count;
                    }
                }
            }
            if(len > 5) recordes.length = 5;
        }

        storage.setItem("armfifteenrecordes", JSON.stringify(recordes));
    };

    function getRecordes() {
        parent.innerHTML = "";

        let startContent = game.createElement("div");
        startContent.classList.add("start-content");

        let btnStart = game.createElement("button");
        btnStart.type = "button";
        btnStart.innerText = "Play";

        btnStart.addEventListener("click", start);

        let btnHome = game.createElement("button");
        btnHome.type = "button";
        btnHome.innerText = "Home";

        btnHome.addEventListener("click", function(e) {
            init(selector, itemCount);
        });

        startContent.appendChild(btnStart);
        startContent.appendChild(btnHome);

        let startRecordes = game.createElement("div");
        startRecordes.classList.add("start-recordes");

        let storage = window.localStorage;
        let recordes = storage.getItem("armfifteenrecordes");

        if(recordes !== null) {
            let rec = JSON.parse(recordes);
            rec.forEach(function(item, index) {
                let itemRecorde = game.createElement("div");
                itemRecorde.classList.add("item-recordes");

                let recordesText = game.createElement("span");
                let recordesData= game.createElement("span");

                recordesData.innerText = item.dateStr;

                let recordesCount= game.createElement("span");

                recordesCount.innerText = item.count;

                recordesText.appendChild(recordesData);
                recordesText.appendChild(recordesCount);

                itemRecorde.appendChild(recordesText);
                startRecordes.appendChild(itemRecorde);
            });
        }else {
            let itemRecorde = game.createElement("div");
            itemRecorde.classList.add("item-recordes");

            let recordesText = game.createElement("span");
            recordesText.innerText = "There are no records";

            itemRecorde.appendChild(recordesText);
            startRecordes.appendChild(itemRecorde);
        }

        parent.appendChild(startContent);
        parent.appendChild(startRecordes);
    };

    function gameEqualWin() {
        let elem = game.querySelectorAll(".game-parent .item");
        let len = elem.length;

        for(let i = 0; i < len; i++) {
            if(parseInt(elem[i].getAttribute("item-count")) !== parseInt(elem[i].getAttribute("data-index")) + 1){
                return false
            }
        }

        return true;
    };

    function winGame() {
        let popupParent = game.createElement("div");
        popupParent.classList.add("popup-parent");
        
        let popupHeader = game.createElement("div");
        popupHeader.classList.add("popup-header");

        let headerTitle = game.createElement("div");
        headerTitle.classList.add("header-title");
        let headerDes = game.createElement("div");
        headerDes.classList.add("header-des");

        let titleText = game.createElement("span");
        titleText.innerText = "Game Fifteen";
        let desText = game.createElement("span");
        desText.innerText = "You Win " + counter;

        headerTitle.appendChild(titleText);
        popupHeader.appendChild(headerTitle);

        headerDes.appendChild(desText);
        popupHeader.appendChild(headerDes);

        let popupBody = game.createElement("div");
        popupBody.classList.add("popup-body");

        popupParent.appendChild(popupHeader);

        let btnStart = game.createElement("button");
        btnStart.type = "button";
        btnStart.innerText = "Restart";

        let btnHome = game.createElement("button");
        btnHome.type = "button";
        btnHome.innerText = "Home";

        btnStart.addEventListener("click", start);
        btnHome.addEventListener("click", function(e) {
            init(selector, itemCount);
        });

        popupBody.appendChild(btnStart);
        popupBody.appendChild(btnHome);

        popupParent.appendChild(popupBody);

        parent.appendChild(popupParent);

        setRecordes();
    };

    function gameEqual() {
        let elem = game.querySelectorAll(".game-parent .item");
        
        elem.forEach(function(item, index){
            if(parseInt(item.getAttribute("item-count")) === parseInt(item.getAttribute("data-index")) + 1){
                item.classList.add("green");
            }else {
                item.classList.remove("green");
            }
        });
    };

    function equalPos(elemPos, emptyItemPos) {
        if(elemPos.startX === emptyItemPos.startX && elemPos.endX === emptyItemPos.endX && elemPos.startY + top === emptyItemPos.startY) return true;
        if(elemPos.startX === emptyItemPos.startX && elemPos.endX === emptyItemPos.endX && elemPos.startY - top === emptyItemPos.startY) return true;
        if(elemPos.startY === emptyItemPos.startY && elemPos.endY === emptyItemPos.endY && elemPos.startX + left === emptyItemPos.startX) return true;
        if(elemPos.startY === emptyItemPos.startY && elemPos.endY === emptyItemPos.endY && elemPos.startX - left === emptyItemPos.startX) return true;

        return false;
    };
    
    function replacePosition(target) {
        if(win) return;
        counter++;
        let moves = game.querySelector(".moves-counter");
        moves.innerText = "Moves " + counter;

        let elem = target.target;
        let elemPos = {
            startX: parseFloat(elem.getAttribute("data-left")),
            startY: parseFloat(elem.getAttribute("data-top")),
            endX: parseFloat(elem.getAttribute("data-left")) + (width / cof),
            endY: parseFloat(elem.getAttribute("data-top")) + (height / cof)
        };

        let emptyItemPos = {
            startX: positionItems[emptyItem].left,
            startY: positionItems[emptyItem].top,
            endX: positionItems[emptyItem].left + (width / cof),
            endY: positionItems[emptyItem].top + (height / cof)
        };

        if(equalPos(elemPos, emptyItemPos)){
            let index = elem.getAttribute("data-index");
            elem.setAttribute("data-index", emptyItem);
            elem.setAttribute("data-left", emptyItemPos.startX);
            elem.setAttribute("data-top", emptyItemPos.startY);
            elem.style.top = emptyItemPos.startY + "px";
            elem.style.left = emptyItemPos.startX + "px";
            emptyItem = index;
            gameEqual();

            win = gameEqualWin();

            if(win) {
                winGame();
            }
        }
    };

    let ArmFifteen = {
        init: init
    };

    window.ArmFifteen = ArmFifteen;
    
})(document);