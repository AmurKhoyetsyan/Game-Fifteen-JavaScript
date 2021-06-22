/**
 * Copyright (c) Amur 2020
 *
 * Timer
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @param audio
 * @constructor
 */
function AudioPlayer(audio) {
    let AudioContext = window.AudioContext || window.webkitAudioContext;

    this.context = new AudioContext();

    this.abuffer;

    this.audio = audio;
};

/**
 * @returns {Promise<unknown>}
 */
AudioPlayer.prototype.get = function () {
    let request = new XMLHttpRequest();
    request.open("GET", this.audio, true);
    request.responseType = "arraybuffer";
    request.send();

    let _self = this;

    return new Promise(function (resolve, reject) {
        request.onload = function (event) {
            _self.context.decodeAudioData(request.response, function (buffer) {
                if (buffer) {
                    _self.abuffer = buffer;
                    resolve(_self);
                }
            });
        }

        request.onerror = function (error) {
            reject(new Error(`Error on audio ::: ${this.audio}`));
        }
    });
};

AudioPlayer.prototype.play = function play() {
    this.src = this.context.createBufferSource();
    this.src.buffer = this.abuffer;
    this.src.connect(this.context.destination);
    this.src.start(0);
};