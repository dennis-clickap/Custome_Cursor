/**
 * @author blife
 * @email blife450@gmail.com
 *
 * This code is written on the knee. Do not judge strictly. And better not climb here.
 *
 * Copyright 2016-2019 Blife Authors
 * https://custom-cursor.com
 */
class Options {
    constructor() {
        this.collectionId = null;
        this.uploadType = 'cursor';
        this.collection = {};
        this.template = `<div class="col-2 card" id="template" data-id="0">

                        <div class="cursor" data-id="0">
                            <span>${chrome.i18n.getMessage('item_cursor')}</span>
                            <a href="#" class="upload" data-id="0" data-type="cursor">+</a>
                            <a class="cbg element hidden" data-id="0" href="#"></a>
                            <a href="#" class="remove hidden" data-id="0" data-type="cursor" title="Remove cursor"></a>
                        </div>
                        <div class="pointer" data-id="0">
                            <span>${chrome.i18n.getMessage('item_pointer')}</span>
                            <a href="#" class="upload"  data-id="0" data-type="pointer">+</a>
                            <a class="pbg element hidden" data-id="0" href="#"></a>
                            <a href="#" class="remove hidden" data-id="0" data-type="pointer" title="Remove cursor"></a>
                        </div>
                    </div>`;
        this.current = null;

        chrome.storage.local.get('size', function (items) {
            $(`option[value='${items.size}']`).attr('selected', 'selected');
        });

        chrome.storage.local.get(null, function (items) {
            this.renderCollection(items.myCollection);
            this.collection = items.myCollection;

        }.bind(this));
        this.init();


    }

    init() {
        $("#linkrate").attr("href", `https://chrome.google.com/webstore/detail/${chrome.runtime.id}/reviews?utm_source=popup`);

        $("#size").on('change', function (item) {
            chrome.storage.local.set({'size': $("#size").val()});
        }.bind(this));


        $("#version").text(`version: ${chrome.runtime.getManifest().version}`);

        $("#upload").on('change', function (event) {
            let $this = $("#upload"),
                valText = $this.val(),
                fileName = valText.split(/(\\|\/)/g).pop(),
                fileItem = $this.siblings('.file-item'),
                beginSlice = fileName.lastIndexOf('.') + 1,
                typeFile = fileName.slice(beginSlice);
            fileItem.find('.file-name').text(fileName);


            let tmppath = URL.createObjectURL(event.target.files[0]),
                reader = new FileReader();
            reader.onload = async function (event) {
                let name = this.collectionId,
                    newElemtn = $(`div.card[data-id=${this.collectionId}]`),
                    item = this.current;

                if (!item) {
                    item = {pointer: {}, cursor: {}}
                }
                var im = new Image();
                im.src = event.target.result;

                if (this.uploadType == 'cursor') {
                    im.onload = await function () {
                        item.cursor.width = im.width;
                        item.cursor.height = im.height;

                        if (im.width > 256 || im.height > 256) {
                            alert("Don't use pictures more than 128x128 pixels;");
                            return;
                        }
                        item.cursor.path = event.target.result;
                        item.cursor.name = fileName;
                        item.cursor.size = event.loaded; 
                        newElemtn.find(".cbg").removeClass('hidden').css({
                            "background-image": `url(${item.cursor.path})`
                        });
                        newElemtn.find('.cursor .upload').addClass('hidden');
                        newElemtn.find('.cursor .remove').removeClass('hidden');

                        this.collection[this.collectionId] = item;
                        chrome.storage.local.set({myCollection: this.collection})
                    }.bind(this);
                } else if (this.uploadType == 'pointer') {


                    im.onload = await function () {
                        item.pointer.width = im.width;
                        item.pointer.height = im.height;
                        if (im.width > 256 || im.height > 256) {
                            alert("Don't use pictures more than 128x128 pixels;");
                            return;
                        }
                        item.pointer.path = event.target.result;
                        item.pointer.name = fileName;
                        item.pointer.size = event.loaded;
                        newElemtn.find(".pbg").removeClass('hidden').css({
                            "background-image": `url(${item.pointer.path})`
                        });

                        newElemtn.find('.pointer .upload').addClass('hidden');
                        newElemtn.find('.pointer .remove').removeClass('hidden');
                        this.collection[this.collectionId] = item;
                        chrome.storage.local.set({myCollection: this.collection})
                    }.bind(this);
                }

                //chrome.storage.local.set({myCollection: this.collection})

            }.bind(this);
            reader.readAsDataURL(event.target.files[0]);

        }.bind(this));
    }

    deleteItem(e) {
        let id = $(e.target).attr('data-id'),
            type = $(e.target).attr('data-type');
        let item = this.collection[id];


        this.collection[id][type] = {};
        if (item.cursor.path == undefined && item.pointer.path == undefined) {
            delete this.collection[id];
            $(`.card[data-id=${id}]`).remove();
        }
        if (type == 'cursor') {
            $(`a.cbg[data-id=${id}]`).css({"background-image": ""}).addClass('hidden');
            $(`.upload[data-id=${id}][data-type=cursor]`).removeClass('hidden')
            $(`.remove[data-id=${id}][data-type=cursor]`).addClass('hidden')
        }
        else {
            $(`a.pbg[data-id=${id}]`).css({"background-image": ""}).addClass('hidden')
            $(`.upload[data-id=${id}][data-type=pointer]`).removeClass('hidden')
            $(`.remove[data-id=${id}][data-type=pointer]`).addClass('hidden')
        }
        chrome.storage.local.set({myCollection: this.collection});
    }

    isEmpty(obj) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }


    renderCollection(collection) {
        $("#addNew").on('click', function (e) {
            let newElement = $(this.template),
                name = (new Date()).getTime();
            newElement.attr('data-id', name);

            $("#mycollection").append(newElement);

            newElement.find('[data-id]').each((index, item) => {
                $(item).attr("data-id", name);
            });

            $(`[data-id=${name}] .upload`).on('click', this.uploadClick.bind(this));
            $(`[data-id=${name}] .remove`).on('click', this.deleteItem.bind(this));
            e.preventDefault();
        }.bind(this));

        for (let item in collection) {
            let el = $(`<div class="col-2 card" id="template" data-id="${item}"  >
                        <div class="cursor" data-id="${item}">
                            <span>${chrome.i18n.getMessage('item_cursor')}</span>
                            <a href="#" class="upload" data-id="${item}" data-type="cursor">+</a>
                            <a class="cbg element hidden" data-id="${item}" href="#"></a>
                            <a href="#" class="remove hidden" data-id="${item}" data-type="cursor" title="Remove cursor"></a>
                        </div>
                        <div class="pointer" data-id="${item}">
                            <span>${chrome.i18n.getMessage('item_pointer')}</span>
                            <a href="#" class="upload" data-id="${item}" data-type="pointer">+</a>
                            <a class="pbg element hidden" data-id="${item}" href="#"></a>
                            <a href="#" class="remove hidden" data-id="${item}" data-type="pointer" title="Remove cursor"></a>
                        </div>
                    </div>`);
            let cursor = collection[item];
            if (cursor == null) {

            } else {
                if (this.isEmpty(cursor.pointer) == false) {
                    el.find(".pbg").removeClass('hidden').css({
                        "background-image": `url(${cursor.pointer.path})`
                    });
                    el.find(".pointer .upload").addClass('hidden')
                    el.find(".pointer .remove").removeClass('hidden');
                }
                if (cursor.cursor.path) {
                    el.find(".cbg").removeClass('hidden').css({
                        "background-image": `url(${cursor.cursor.path})`
                    });
                    el.find(".cursor .upload").addClass('hidden')
                    el.find(".cursor .remove").removeClass('hidden');
                }
                $("#mycollection").append(el);
                $(`div[data-id=${item}] .upload`).on('click', this.uploadClick.bind(this));
                $(`div[data-id=${item}] .remove`).on('click', this.deleteItem.bind(this))
            }

        }
    }

    uploadClick(e) {
        this.uploadType = $(e.target).data('type');
        this.collectionId = $(e.target).attr('data-id');
        if (typeof (this.collection[this.collectionId]) == undefined) {
            this.collection[this.collectionId] = {}
        }
        this.current = this.collection[this.collectionId];

        $("#upload").click();
    }

}

new Options();
$(function () {

    $('.container-upload').css({
        'min-height': ($(window).height() - 300)
    })
    window.onresize = () => {
        $('.container-upload').css({
            'min-height': ($(window).height() - 200)
        })
    }



    (new Localize()).init();
});