/**
 * @author blife
 * @email blife450@gmail.com
 *
 * This code is written on the knee. Do not judge strictly. And better not climb here.
 *
 * Copyright 2016-2019 Blife Authors
 * https://custom-cursor.com
 */
class Popup {
    constructor() {
        this.collection = {};
        this.myCollection = {};
        this.siteCollection = {};
        this.favorites = [];
        this.favorites_ids = [];
        this.size = 3;

        this.CONFIG = null;

        chrome.storage.local.get(null, function (items) {

            this.CONFIG = items;

            this.myCollection = items.myCollection;
            this.siteCollection = items.collection;

            this.size = items.size;
            this.favorites_ids = items.favorites;

            for (let index in this.siteCollection) {
                let collection = this.siteCollection[index];
                this.collection[collection.slug] = collection;
            }
debugger;
            chrome.storage.local.get('selected', function (data) {
                this.selected = items.selected;
            }.bind(this));

            this.init();
            this.localize();
        }.bind(this));
        (new Localize()).init();
    }

    replace_i18n(obj, tag) {
        let msg = tag.replace(/__MSG_(\w+)__/g, function (match, v1) {
            return v1 ? chrome.i18n.getMessage(v1) : '';
        });
        if (msg != tag) {
            obj.innerHTML = msg;
        }
    }

    localize() {
        let data = document.querySelectorAll('[data-i18n]');
        for (let i in data)
            if (data.hasOwnProperty(i)) {
                let obj = data[i],
                    tag = obj.getAttribute('data-i18n').toString();
                this.replace_i18n(obj, tag);
            }
        let page = document.getElementsByTagName('html');
        for (let j = 0; j < page.length; j++) {
            let obj = page[j],
                tag = obj.innerHTML.toString();
            this.replace_i18n(obj, tag);
        }
    }

    init() {
        $("#listCategory").html("");

        let categoryNode = $("#listCategory");

        let fav_html = $(`<div class="icons-category nature normal skin-1" data-index="-1" id="favorites"><h1 name="favorits"><a name="Favorites">Favorites</a></h1></div>`);
        categoryNode.append(fav_html);

        let cat = $(`<div class="icons-category nature normal skin-1" data-index="-1" id="myCollection"><h1 name="myCollection"><a name="myCollection">My collection</a></h1></div>`);


        for (let image in this.myCollection) {
            let elem = null, item = this.myCollection[image];
            if (item.cursor.path) {
                elem = $(`<div class="icon">
                <img class="icon-img button cursor" data-id="${image}"  data-index="${image}"  data-cat="-1" data-category="-1" src="${item.cursor.path}"></div>`);
            } else {
                elem = $(`<div class="icon" >
                <img class="icon-img button cursor" data-id="${image}"  data-index="${image}" data-cat="-1" data-category="-1" src="${item.pointer.path}"></div>`);
            }
            cat.append(elem);
        }
        categoryNode.append(cat);


        for (let index in this.collection) {
            if (!this.collection[index]) {
                return;
            }
            let item = this.collection[index],
                cat = $(`<div class="icons-category nature normal skin-1" data-index="${index}">
                            <h1 name="${item.slug}">${item.name}</h1>
                        </div>`);
            let curIndex = index;

            //try {
            item.items.forEach(function (image, i) {
                var elem = $(`<div class="icon">
                        <img class="icon-img button lazyload cursor"
                            data-id="${i}" data-index="${i}" title="${image.name}" data-cat="${curIndex}" data-category="${item.id}"  data-src="${image.cursor.path}"
                            src="/assets/icons/loading.gif">                
                        </div>`);


                if (this.favorites_ids) {
                    if (this.favorites_ids.indexOf(image.id) !== -1) {
                        this.favorites.push(image);
                        $('#favorites').append(`<div class="icon">
                        <img class="icon-img button lazyload cursor"
                            data-id="${i}" data-index="${i}" title="${image.name}" data-cat="${curIndex}" data-category="${item.id}"  data-src="${image.cursor.path}"
                            src="/assets/icons/loading.gif">                
                        </div>`)
                    }
                }

                cat.append(elem);
            }.bind(this));
            /*} catch (e) {
            }*/
            categoryNode.append(cat);
        }


        $(".b-menu-icon__item.m-menu-icon-item-middle, .b-menu-icon").on("click", function () {
            chrome.runtime.openOptionsPage();
        });

        $(".btn-settings").on('click', function () {
            chrome.runtime.openOptionsPage();
        });

        $("#defaultCursor").on("click", function () {
            chrome.storage.local.set({"selected": null, selected_type: 'none'});
            this.CONFIG.rotator.status = 'off';
            chrome.storage.local.set({
                rotator: this.CONFIG.rotator
            });

            chrome.runtime.sendMessage({action: 'rotator', data: this.CONFIG.rotator}, (r) => {
                if (r) console.log()
            });


            this.reload()
            this.clear();
        }.bind(this));

        $("img.cursor").on('click', function (e) {

            this.CONFIG.rotator.status = "off";


            chrome.storage.local.set({"rotator": this.CONFIG.rotator});
            chrome.runtime.sendMessage({"action": "rotator", data: this.CONFIG.rotator});


            let dataId = $(e.target).data('cat'),
                id = $(e.target).data('index'), item;


            if (dataId == -1) {
                item = this.myCollection[id];
                item.type = item.type;
            } else {
                item = this.collection[dataId].items[id]
                item.type = 'system';
            }

            if (typeof (item.type) == 'undefined') {
                item.type = 'custom';
            }

            let settings = {
                maxWidth: 24,
                maxHeight: 24
            };
            switch (this.size) {
                case 1:
                    settings = {
                        maxWidth: 16, maxHeight: 16
                    };
                    break;
                case 2:
                    settings = {
                        maxWidth: 24, maxHeight: 24
                    };
                    break;
                case 3:
                    settings = {
                        maxWidth: 32, maxHeight: 32
                    };
                    break;
                case 4:
                    settings = {
                        maxWidth: 48, maxHeight: 48
                    };
                    break;
                case 5:
                    settings = {
                        maxWidth: 64, maxHeight: 64
                    };
                    break;
                case 6:
                    settings = {
                        maxWidth: 80, maxHeight: 80
                    };
                    break;
                case 7:
                    settings = {
                        maxWidth: 96, maxHeight: 96
                    };
                    break;
                case 8:
                    settings = {
                        maxWidth: 128, maxHeight: 128
                    };
                    break;
                default: {
                    settings = {
                        maxWidth: 24, maxHeight: 24
                    };
                }
            }


            if (item.pointer.path) {
                if (!item.pointer.original) {
                    item.pointer.original = item.pointer.path.replace('https://cdn.custom-cursor.com', "");
                    item.pointer.original = item.pointer.path.replace('chrome-extension://ogdlpmhglpejoiomcodnpjnfgcpmgale', "");
                }
            }


            if (item.cursor.path) {
                if (!item.cursor.original) {
                    item.cursor.original = item.cursor.path.replace('https://cdn.custom-cursor.com', "");
                    item.cursor.original = item.cursor.path.replace('chrome-extension://ogdlpmhglpejoiomcodnpjnfgcpmgale', "");
                }
            }

            item.render_size = this.size;

            if (item.type == 'custom') {
                chrome.storage.local.set({selected: item, selected_type: 'local'});
            }

            let cursor, pointer;

            if (item.pointer.path) {
                if (!item.pointer.original) {
                    item.pointer.original = item.pointer.path;
                }
                pointer = this.resizedataURL(item.pointer.original, settings.maxWidth, settings.maxHeight, 'pointer')
            }

            if (item.cursor.path) {
                if (!item.cursor.original) {
                    item.cursor.original = item.cursor.path;
                }
                cursor = this.resizedataURL(item.cursor.original, settings.maxWidth, settings.maxHeight, 'cursor')
            }

            Promise.all([cursor, pointer]).then((values) => {
                for (let i in values) {
                    if (values[i].type == 'pointer') {
                        item.pointer.path = values[i].data
                    }
                    if (values[i].type == 'cursor') {
                        item.cursor.path = values[i].data
                    }
                }
                chrome.storage.local.set({selected: item, selected_type: 'system'});
            });

            this.reload()
        }.bind(this));
        $(".lazyload").lazyload();

        if(this.CONFIG.favorites.length == 0){
            $("#favorites").css('display', 'none');
        }


    }

    clear() {
        let message = {action: 'clear'};

        chrome.storage.local.set({selected: null, selected_type: 'none'});
        chrome.runtime.sendMessage(message);
    }

    reload() {
        chrome.tabs.query({}, function (tabs) {
            for (let i = 0; i < tabs.length; ++i) {
                chrome.tabs.sendMessage(tabs[i].id, {action: 'update'});
            }
        });
    }

    resizedataURL(datas, wantedWidth, wantedHeight, type) {
        return new Promise(function (resolve, reject) {
            let img = document.createElement('img');
            img.onload = function () {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
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
}

(function () {
    new Popup();
})()