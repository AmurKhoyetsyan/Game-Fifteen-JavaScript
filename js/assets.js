/**
 * Copyright (c) Amur 2020
 *
 * Timer
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @type {{name: string}}
 */
let Assets = {
    name: 'Assets'
};

Assets.files = {
    images: [],
    audios: []
},

    Assets.filesAssets = {
        images: [],
        audios: []
    };

/**
 * @param count
 * @returns {Promise<unknown>}
 */
Assets.loadImages = function (count = 0) {
    return new Promise((resolve, reject) => {
        if (Assets.filesAssets.images.length > 0) {
            fetch(Assets.filesAssets.images[count].file).then(function (response) {
                return response.blob();
            }).then(function (blob) {
                let _self = window.webkitURL || window.URL;
                let objectURL = _self.createObjectURL(blob);

                Assets.files.images[Assets.filesAssets.images[count].name] = objectURL;
                count++;

                if (Assets.filesAssets.images.length > count) {
                    resolve(Assets.loadImages(count));
                } else {
                    resolve(Assets.files);
                }
            }).catch(err => reject(err));
        } else {
            resolve(Assets.files);
        }
    });
};

/**
 * @param count
 * @returns {Promise<unknown>}
 */
Assets.loadAudios = function (count = 0) {
    return new Promise((resolve, reject) => {
        if (Assets.filesAssets.audios.length > 0) {
            let audio = new AudioPlayer(Assets.filesAssets.audios[count].file);
            audio.get().then(res => {
                Assets.files.audios[Assets.filesAssets.audios[count].name] = res;
                count++;

                if (Assets.filesAssets.audios.length > count) {
                    resolve(Assets.loadAudios(count));
                } else {
                    resolve(Assets.files);
                }
            }).catch(err => {
                reject(err);
            });
        } else {
            resolve(Assets.files);
        }
    });
};

/**
 * @returns {Promise<unknown>}
 */
Assets.load = function () {
    return new Promise((resolve, reject) => {
        Assets.loadImages().then(resImage => {
            Assets.loadAudios().then(resAudio => {
                resolve(Assets.files);
            }).catch(err => {
                reject(err);
            })
        }).catch(err => {
            reject(err);
        });
    });
}