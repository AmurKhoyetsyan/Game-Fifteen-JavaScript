/**
 * Copyright (c) Amur 2020
 *
 * Game Fifteen
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

;(function(game) {
    /**
     * @type {*[]}
     */
    let positionItems = [];

    /**
     * @type {*[]}
     */
    let numbersItems = [];

    let emptyItem, itemCount, cof, top, left,
        parent, width, height, counter, win, selector,
        timer = null, sound = true, audoClick, audioWin, headling, 
        soundOn, soundOf;

    /**
     * @type {({file: string, name: string}|{file: string, name: string}|{file: string, name: string}|{file: string, name: string}|{file: string, name: string})[]}
     */
    let filesAssets = [
        {name: "of", file: 'https://raw.githubusercontent.com/AmurKhoyetsyan/Game-Fifteen-JavaScript/31f32d053b3e5619943a01aa654a9c7d3799f07b/img/audio_of.svg'},
        {name: "on", file: 'https://raw.githubusercontent.com/AmurKhoyetsyan/Game-Fifteen-JavaScript/31f32d053b3e5619943a01aa654a9c7d3799f07b/img/audio_on.svg'},
        {name: "click", file: 'https://raw.githubusercontent.com/AmurKhoyetsyan/Game-Fifteen-JavaScript/31f32d053b3e5619943a01aa654a9c7d3799f07b/audio/click_item.wav'},
        {name: "clickHeadling", file: 'https://raw.githubusercontent.com/AmurKhoyetsyan/Game-Fifteen-JavaScript/31f32d053b3e5619943a01aa654a9c7d3799f07b/audio/click_headling.wav'},
        {name: "win", file: 'https://raw.githubusercontent.com/AmurKhoyetsyan/Game-Fifteen-JavaScript/31f32d053b3e5619943a01aa654a9c7d3799f07b/audio/win_game.wav'}
    ];

    /**
     * @param event
     */
    function soundOnOf(event) {
        sound = !sound;
        let btn = game.querySelector('.btn-sound-on-of');
        if(!sound) {
            btn.innerHTML = soundOn.outerHTML;
        }else {
            btn.innerHTML = soundOf.outerHTML;
        }
    };

    /**
     * @param sel
     * @param count
     */
    function init(sel, count = 16) {
        Assets.loadFile(filesAssets).then( async res => {
            audoClick = new Audio(Assets.files.click);
            audioWin = new Audio(Assets.files.win);
            headling = new Audio(Assets.files.clickHeadling);
            soundOn = new Image();
            soundOn.src = Assets.files.on;
            soundOf = new Image();
            soundOf.src = Assets.files.of;

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

            let btnSound = game.createElement("button");
            btnSound.type = "button";
            btnSound.classList.add('btn-sound-on-of');
            btnSound.innerHTML = sound ? soundOf.outerHTML : soundOn.outerHTML;

            btnSound.addEventListener('click', soundOnOf);

            startContent.appendChild(btnStart);
            startContent.appendChild(btnSound);
            startContent.appendChild(btnRecorde);

            parent.appendChild(startContent);

            let loader = game.querySelector('.parent-loader-game');
            setTimeout(() => loader.classList.add('hidden'), 1000);

        }).catch(err => {
            console.log(err);
        });
    };

    /**
     * @param items
     * @param pos
     * @returns {boolean}
     */
    function findItem(items, pos) {
        for(let item of items) {
            let itemTop = parseFloat(item.getAttribute('data-top'));
            let itemLeft = parseFloat(item.getAttribute('data-left'));

            if(parseFloat(pos.top) === itemTop && parseFloat(pos.left) === itemLeft) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param items
     * @returns {number}
     */
    function getEmptyItem(items) {
        for(let [index, itemPos] of positionItems.entries()) {
            if(!findItem(items, itemPos)) {
                return {
                    index: index,
                    item: itemPos
                };
            }
        }
    }

    /**
     * @param items
     * @param index
     * @returns {[]}
     */
    function getFreeParticles(items, index) {
        let cords = positionItems[index];

        let particles = [];

        if(cords.top - top >= 0 && cords.top - top <= height) {
            particles.push({
                top: cords.top - top,
                left: cords.left
            });
        }

        if(cords.left - left >= 0 && cords.left - left <= width) {
            particles.push({
                top: cords.top,
                left: cords.left - left
            });
        }

        if(cords.top + top >= 0 && cords.top + top <= height) {
            particles.push({
                top: cords.top + top,
                left: cords.left
            });
        }

        if(cords.left + left >= 0 && cords.left + left <= width) {
            particles.push({
                top: cords.top,
                left: cords.left + left
            });
        }

        return particles;
    };

    /**
     * @param items
     * @param particles
     * @returns {undefined|*}
     */
    function getIndexForStep(items, particles) {
        let len = particles.length;

        let pos = particles[Math.floor(Math.random() * len)];

        let itemIndex = null;

        for(let [index, item] of items.entries()) {

            let itemTop = parseFloat(item.getAttribute('data-top'));
            let itemLeft = parseFloat(item.getAttribute('data-left'));

            if(parseFloat(pos.top) === itemTop && parseFloat(pos.left) === itemLeft) {
                itemIndex = index;
                return item;
            }
        }

        if(itemIndex === null) {
            return getIndexForStep(items, particles);
        }
    }

    /**
     * @param items
     */
    function itemsPositioning(items) {
        for(let [index, pos] of positionItems.entries()) {
            for(let item of items) {
                if(parseFloat(item.getAttribute('data-left')) === parseFloat(pos.left) && parseFloat(item.getAttribute('data-top')) === parseFloat(pos.top)) {
                    item.setAttribute("data-index", index);
                }
            }
        }
    }

    /**
     * @param step
     * @param steps
     */
    function replacePositionItem(step = 0, steps = null) {

        if(steps === null) {
            steps = Math.round(Math.random() * (300 - 150) + 150);
        }

        let items = parent.querySelectorAll('.item');
        let elem = getEmptyItem(items);

        let particles = getFreeParticles(items, elem.index);

        let oneItem = getIndexForStep(items, particles);

        oneItem.setAttribute('data-top', elem.item.top);
        oneItem.setAttribute('data-left', elem.item.left);

        oneItem.style.top = elem.item.top + "px";
        oneItem.style.left = elem.item.left + "px";
        if(step < steps) {
            replacePositionItem(++step, steps);
        }else {
            itemsPositioning(items);
            emptyItem = getEmptyItem(items).index;
        }
    };

    function start() {
        if(sound) {
            headling.play();
        }

        counter = 0;
        win = false;
        if(timer !== null) {
            timer.end();
        }

        positionItems = [];
        
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

        let moves = game.createElement("div");
        moves.classList.add("moves");

        let movesCounter = game.createElement("span");
        movesCounter.classList.add("moves-counter");
        movesCounter.innerText = "Moves " + counter;

        let btnStart = game.createElement("button");
        btnStart.type = "button";
        btnStart.innerText = "Restart";

        btnStart.addEventListener("click", start);

        let btnSound = game.createElement("button");
        btnSound.type = "button";
        btnSound.classList.add('btn-sound-on-of');
        btnSound.innerHTML = sound ? soundOf.outerHTML : soundOn.outerHTML;

        btnSound.addEventListener('click', soundOnOf);

        moves.appendChild(movesCounter);
        moves.appendChild(btnSound);
        moves.appendChild(btnStart);

        let content = game.createElement("div");
        content.style.width = width + "px";
        content.style.height = height + "px";
        content.style.position = "relative";

        for(let index = 0; index < itemCount - 1; index++) {
            let div = game.createElement("div");
            div.classList.add("item");
            div.setAttribute("data-left", positionItems[index].left);
            div.setAttribute("data-top", positionItems[index].top);
            div.setAttribute("item-count", numbersItems[index]);
            div.style.top = positionItems[index].top + "px";
            div.style.left = positionItems[index].left + "px";
            div.style.width = top + "px";
            div.style.height = left + "px";
            div.addEventListener("click", replacePosition);
            content.appendChild(div);
        }

        let gameFooter = game.createElement("div");
        gameFooter.classList.add("game-footer");

        let btnHome = game.createElement("button");
        btnHome.type = "button";
        btnHome.innerText = "Home";

        let timerShow = game.createElement("span");
        timerShow.setAttribute('class', 'show-timer');

        timer = new Timer(timerShow);

        timer.start();

        btnHome.addEventListener("click", function(e) {
            if(sound) {
                headling.play();
            }
            
            init(selector, itemCount);
            timer.end();
        });

        gameFooter.appendChild(btnHome);
        gameFooter.appendChild(timerShow);

        parent.appendChild(moves);
        parent.appendChild(content);

        replacePositionItem();

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
                time: timer.get(),
                dateStr: dateStr
            }
        ];
        if(recordes === null) {
            recordes = rec;
        }else {
            rec = JSON.parse(recordes);
            rec.push({
                count: counter,
                time: timer.get(),
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

            if(len > 5) {
                recordes.length = 5;
            }
        }

        storage.setItem("armfifteenrecordes", JSON.stringify(recordes));
    };

    function getRecordes() {
        if(sound) {
            headling.play();
        }

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
            if(sound) {
                headling.play();
            }

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

                let recordesData = game.createElement("span");
                recordesData.innerText = item.dateStr;

                let recordesTime = game.createElement("span");
                recordesTime.innerText = item.time;

                let recordesCount= game.createElement("span");
                recordesCount.innerText = item.count;

                recordesText.appendChild(recordesData);
                recordesText.appendChild(recordesTime);
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
        timer.pause();

        if(sound) {
            audioWin.play();
        }

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
            if(sound) {
                headling.play();
            }

            init(selector, itemCount);
        });

        popupBody.appendChild(btnStart);
        popupBody.appendChild(btnHome);

        popupParent.appendChild(popupBody);

        parent.appendChild(popupParent);

        setRecordes();

        timer.end();
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

    /**
     * @param elemPos
     * @param emptyItemPos
     * @returns {boolean}
     */
    function equalPos(elemPos, emptyItemPos) {
        if(elemPos.startX === emptyItemPos.startX && elemPos.endX === emptyItemPos.endX && elemPos.startY + top === emptyItemPos.startY) return true;
        if(elemPos.startX === emptyItemPos.startX && elemPos.endX === emptyItemPos.endX && elemPos.startY - top === emptyItemPos.startY) return true;
        if(elemPos.startY === emptyItemPos.startY && elemPos.endY === emptyItemPos.endY && elemPos.startX + left === emptyItemPos.startX) return true;
        if(elemPos.startY === emptyItemPos.startY && elemPos.endY === emptyItemPos.endY && elemPos.startX - left === emptyItemPos.startX) return true;

        return false;
    };

    /**
     * @param target
     */
    function replacePosition(event) {
        if(win) {
            return;
        }

        let elem = event.target;
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
            if(sound) {
                audoClick.play();
            }

            counter++;
            let moves = game.querySelector(".moves-counter");
            moves.innerText = "Moves " + counter;
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

    /**
     * @type {{init: init}}
     */
    let ArmFifteen = {
        init: init
    };

    /**
     * @type {{init: init}}
     */
    window.ArmFifteen = ArmFifteen;
    
})(document);