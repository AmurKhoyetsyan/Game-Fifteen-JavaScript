/**
 * Copyright (c) Amur 2020
 *
 * Timer
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @param elem
 * @constructor
 */
 function Timer(elem = null) {
    this.name = 'Timer';
    this.sec = 0;
    this.min = 0;
    this.hour = 0;
    this.time = "00:00:00";
    this.timerStart = null;
    this.elem = elem;

    this.start = function() {
        this.sec++;
        if(this.sec !== 0) {
            this.min += Math.floor(this.sec / 60);
        }

        if(this.sec > 59) {
            this.sec = 0; 
        }
    
        if(this.min !== 0) {
            this.hour += Math.floor(this.min / 60);
        }

        if(this.min > 59) {
            this.min = 0; 
        }
    
        if(this.hour !== 0) {
            this.day += Math.floor(this.min / 24);
        }

        if(this.hour > 24) {
            this.hour = this.hour - (this.day * 24);  
        }
    
        let sec = this.sec > 9 ? this.sec : `0${this.sec}`;
        let min = this.min > 9 ? this.min : `0${this.min}`;
        let hour = this.hour > 9 ? this.hour : `0${this.hour}`;
    
        this.time = `${hour}:${min}:${sec}`;

        if(this.elem !== null) {
            this.elem.innerText = this.time;
        }
    
        this.timerStart = setTimeout(() => this.start(), 1000);
    };

    this.end = function() {
        if(this.timerStart !== null) {
            clearInterval(this.timerStart);
            this.sec = 0;
            this.min = 0;
            this.hour = 0;
            this.time = "00:00:00";
            this.timerStart = null;
        }
    };

    this.pause = function() {
        if(this.timerStart === null) {
            clearInterval(this.timerStart);
        }
    };

    /**
     * @returns {*}
     */
    this.get = function() {
        return this.time;
    };
};