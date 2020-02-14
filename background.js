/**
 * @author blife
 * @email blife450@gmail.com
 *
 * This code is written on the knee. Do not judge strictly. And better not climb here.
 *
 * Copyright 2016-2020 Blife Authors
 * https://custom-cursor.com
 */

Array.prototype.current = 0;

Array.prototype.next = function () {
    return this[++this.current];
};
Array.prototype.prev = function () {
    return this[--this.current];
};


const Browser = chrome;

class background {
    constructor() {
        this.initListeners();
        this.collection = {};
        this.id = null;
        this.config_sync = {};
        this.data = {};
        chrome.storage.sync.get(null, function (items) {
            this.config_sync = items;
            this.uid = items.uid;
        }.bind(this));


        chrome.storage.local.get(null, function (items) {
            this.data = items;

            if (!items.collection) {

            } else {
                try {
                    this.collection = items.collection;
                } catch (e) {
                }
            }

            try {
                if (this.data.rotator.status == "on") {
                    if (this.data.rotator.type == "time") {
                        if (this.intErval != null) {
                            clearInterval(this.intErval);
                            this.intErval = null;
                        }
                        let run = function () {
                            this.cT++;
                            this.autoChange();
                        };
                        this.intErval = setInterval(run.bind(this), this.data.rotator.time * 1000);
                    }

                }
            }
            catch (e) {

            }


        }.bind(this));


        this.sec = 0;

        chrome.tabs.onCreated.addListener(this.rotatorReq.bind(this));
        chrome.tabs.onUpdated.addListener(this.rotatorReq.bind(this));
        chrome.browserAction.onClicked.addListener(function () {})

        chrome.storage.onChanged.addListener(function (changes, area) {
            if (changes.size || changes.selected) {
                chrome.storage.local.get(null, function (selected) {
                    this.data = selected;
                    this.changeCursor(selected.selected)
                }.bind(this))
            }

            chrome.storage.sync.get(null, function (items) {
                this.config_sync = items;
                this.uid = items.uid;
            }.bind(this));


            chrome.storage.local.get(null, function (items) {
                this.data = items;

                if (!items.collection) {

                } else {
                    try {
                        this.collection = items.collection;
                    } catch (e) {
                        console.log(e)
                    }
                }
            }.bind(this));
        }.bind(this));
        setTimeout(this.authSync.bind(this), 1000 * 120);//1000*60
    }

    rotatorReq(tabId, changeInfo, tab) {
        try {
            if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
                if (!this.data.tabs_opened) {
                    this.data.tabs_opened = 1;
                }
                chrome.storage.local.set({
                    tabs_opened: this.data.tabs_opened + 1
                });

                if (this.data.rotator.status == "on" && this.data.rotator.type == "request") {

                    if (parseInt(this.data.rotator.request) <= parseInt(this.data.tabs_opened)) {
                        this.data.tabs_opened = 1;
                        chrome.storage.local.set({tabs_opened: 1});
                        this.autoChange()
                    }
                }
            }
        } catch (e) {

        }

    }

    resizedataURL(datas, wantedWidth, wantedHeight, type) {
        return new Promise(function (resolve, reject) {
            let img = document.createElement('img');
            img.onload = function () {
                let canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d');
                canvas.width = wantedWidth;
                canvas.height = wantedHeight;
                ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);
                let dataURI = canvas.toDataURL('image/png', 1);
                resolve({
                    type: type,
                    data: dataURI
                });
                img = null;
                canvas = null;
            };
            img.src = datas;


        })
    }

    onInstall() {
        chrome.tabs.query({}, function (tabs) {
                for (let i = 0; i < tabs.length; i++) {
                    if (tabs[i].url.indexOf('http') != -1) {
                        try {
                            chrome.tabs.executeScript(tabs[i].id, {file: "libs/cursor.js"}, function (result) {
                                let lastErr = chrome.runtime.lastError;
                                if (lastErr) console.log('tab: %s', tabs[i].url);
                            });
                        } catch (e) {
                            console.log('error execute code')
                        }
                    }
                }
            }
        );
        chrome.tabs.create({url: `https://custom-cursor.com/successful_installation?utm_source=ext&utm_medium=install&utm_campaign=install_succesful`});

        chrome.storage.sync.set({
            di: (new Date()).getTime(),
            uid: this.getUserUid(),
        });
        chrome.storage.local.set({
            domain: 'https://custom-cursor.com/',
            collection: Collection,
            size: 4,
            myCollection: {},
            "version": chrome.runtime.getManifest().version,
            "favorites": [],
            "rotator": {
                "status": "off",
                "type": 'request',
                "time": 30,
                "request": 10
            }

        });
    }

    getSync() {
        chrome.storage.sync.get(null, function (data) {
            if (data.size) {
                chrome.storage.local.set({size: data.size})
            }
            if(data.favorites){
                chrome.storage.local.set({favorites: data.favorites});
            }
            if(data.rotator){
                chrome.storage.local.set({rotator: data.rotator});
            }
            if (data.packs) {
                $.ajax({
                    url: 'https://custom-cursor.com/api/packs',
                    data: {
                        packs: data.packs
                    },
                    method: 'post'
                }).done(function (response) {
                    for (let i in response) {
                        let data = response[i];
                        this.collection = Collection;
                        this.collection[data.slug] = data;
                    }
                    chrome.storage.local.set({collection: this.collection});
                }.bind(this));

            }
        }.bind(this));
    }

    initListeners() {
        chrome.runtime.onInstalled.addListener(function (details) {
            if (details.reason == "install") {
                this.onInstall()
                this.getSync()
            } else if (details.reason == "update") {
                if(!this.data) {
                    this.data.rotator = {
                        "status": "off",
                        "type": 'request',
                        "time": 30,
                        "request": 10
                    };
                    this.data.favorites = [];
                }
                if(!this.data.rotator){
                    this.data.rotator = {
                        "status": "off",
                        "type": 'request',
                        "time": 30,
                        "request": 10
                    }
                }
                if(!this.data.favorites){
                    this.data.favorites = [];
                }
                if(this.data.size == 3){
                    chrome.storage.local.set({
                        size: 4
                    })
                }
                chrome.storage.local.set({
                    "du": (new Date()).getTime(),
                    "favorites": this.data.favorites,
                    "version": chrome.runtime.getManifest().version,
                    "rotator": this.data.rotator

                });

            }
        }.bind(this));
        this.cT = 0;
        this.intErval = null;

        chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
            switch (request.action) {
                case "getInstalled": {
                    sendResponse({
                        collections: this.collection,
                        ver: chrome.runtime.getManifest().version,
                        uid: this.uid,
                        action: 'get_installed_collection'
                    });
                    break;
                }
                case "install_collection": {
                    let data = {},
                        res = {
                            status: true,
                            version: chrome.runtime.getManifest().version,
                            uid: this.uid,
                            action: 'install_collection'
                        };
                    sendResponse(res);
                    data = request;

                    chrome.storage.local.get(null, function (items) {
                        this.collection = items.collection;
                        this.collection[data.slug] = data.collection;
                        chrome.storage.local.set({collection: this.collection});
                        return sendResponse(res);
                    }.bind(this));
                    break;
                }
                case "get_config": {
                    chrome.storage.local.get(null, function (items) {
                        sendResponse(items);
                    }.bind(this));
                    break;
                }
                case "set_config": {
                    if(request.data.selected){
                        this.stopRotator();
                    }
                    chrome.storage.local.set(request.data);
                    sendResponse({status: true});
                    break;
                }
                case "set_config_sync": {
                    chrome.storage.sync.set(request.data);
                    sendResponse({status: true});
                    break;
                }
                case "get_config_sync": {
                    sendResponse(this.config_sync);
                    break;
                }
            }
        }.bind(this));

        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.action == 'rotator') {
                    if (request.data.status == 'on') {
                        if (request.data.type == 'time') {
                            if (this.intErval != null) {
                                clearInterval(this.intErval);
                                this.intErval = null;
                            }
                            let run = function () {
                                this.cT++;
                                this.autoChange();

                            };
                            this.intErval = setInterval(run.bind(this), request.data.time * 1000);
                        }
                        if (request.data.type == 'request') {
                            if (this.intErval != null) {
                                clearInterval(this.intErval);
                                this.intErval = null;
                            }
                        }
                    }
                    if (request.data.status == 'off') {
                        if (this.intErval != null) {
                            clearInterval(this.intErval);
                            this.intErval = null;
                        }
                    }
                }
                sendResponse({status: true});
            }.bind(this));

    }
    stopRotator(){
        this.data.rotator.status = 'off';
        clearInterval(this.intErval);
        chrome.storage.local.set({rotator: this.data.rotator});

    }

    getUserUid() {
        let buf = new Uint32Array(4),
            idx = -1;
        window.crypto.getRandomValues(buf);
        let uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            idx++;
            let r = (buf[idx >> 3] >> ((idx % 8) * 4)) & 15, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }.bind(this));
        return uid;
    }

    authSync() {
        chrome.storage.local.get(function (data) {
            let packMap = new Map(),
                packs = [];

            chrome.storage.sync.set({'size': data.size});

            for (let i in data.collection) {
                let collection = data.collection[i];
                for (let y in collection.items) {
                    packs.push(collection.items[y].id);
                    packMap.set(collection.items[y].id, true)
                }
            }
            chrome.storage.sync.set({'packs': packs});

            if(data.favorites) {
                chrome.storage.sync.set({favorites: data.favorites});
            }
            if(data.rotator){
                chrome.storage.sync.set({rotator: data.rotator});
            }


        });
        setTimeout(this.authSync.bind(this), 120000);
    }

    changeCursor(item) {
        if(!item) return;
        item.type = 'system';
        let size = this.data.size;

        let settings = {maxWidth: 24, maxHeight: 24};
        switch (size) {
            case 1:
                settings = {maxWidth: 16, maxHeight: 16};
                break;
            case 2:
                settings = {maxWidth: 24, maxHeight: 24};
                break;
            case 3:
                settings = {maxWidth: 32, maxHeight: 32};
                break;
            case 4:
                settings = {maxWidth: 48, maxHeight: 48};
                break;
            case 5:
                settings = {maxWidth: 64, maxHeight: 64};
                break;
            case 6:
                settings = {maxWidth: 80, maxHeight: 80};
                break;
            case 7:
                settings = {maxWidth: 96, maxHeight: 96};
                break;
            case 8:
                settings = {maxWidth: 128, maxHeight: 128};
                break;
            default:
                settings = {maxWidth: 24, maxHeight: 24};
        }

        let cursor, pointer;
        if (item.pointer.path) {
            if (!item.pointer.original) {
                item.pointer.original = item.pointer.path;
            }
            pointer = this.resizedataURL(item.pointer.original, settings.maxWidth, settings.maxHeight, 'pointer');
        }

        if (item.cursor.path) {
            if (!item.cursor.original) {
                item.cursor.original = item.cursor.path;
            }
            cursor = this.resizedataURL(item.cursor.original, settings.maxWidth, settings.maxHeight, 'cursor');
        }



        Promise.all([cursor, pointer]).then((values) => {

            for (let i in values) {
                if (values[i] && values[i].type == 'pointer') {
                    item.pointer.path = values[i].data
                }
                if (values[i] && values[i].type == 'cursor') {
                    item.cursor.path = values[i].data
                }
            }
            chrome.storage.local.set({selected: item, selected_type: 'system'});
        })

    }

    autoChange() {
        let x = this.data.favorites.indexOf(this.data.selected.id);
        this.data.favorites.current = x;
        let nf = this.data.favorites.next();
        var xn = false;
        if (nf == undefined) {
            nf = this.data.favorites[0];
        }

        let xf;
        for (let i in this.data.collection) {
            xf = this.data.collection[i].items.filter(function (item) {
                if (item.id == nf) return item;
            }.bind(this));
            if (xf[0]) {
                this.changeCursor(xf[0]);
                xn = true;
                break;
            } else {

            }
        }
        if (xn == false) {
            this.autoChange();
        }
    }
}

(function () {
    new background();
})();