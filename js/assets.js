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

Assets.files = {},

Assets.filesAssets = [];

/**
 * @param count
 * @returns {Promise<unknown>}
 */
Assets.loadFile = function(count = 0) {
    return new Promise((resolve, reject) => {
        fetch(Assets.filesAssets[count].file).then(function(response) {
            return response.blob();
        }).then(function(blob) {
            let _self = window.webkitURL || window.URL;
            let objectURL = _self.createObjectURL(blob);
            Assets.files[Assets.filesAssets[count].name] = objectURL;
            count++;
            if(Assets.filesAssets.length > count) {
                resolve(Assets.loadFile(count));
            }else {
                resolve(Assets.files);
            }
        }).catch(err => reject(err));
    });  
};