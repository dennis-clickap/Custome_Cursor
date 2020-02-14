/**
 * @author blife
 * @email blife450@gmail.com
 *
 * This code is written on the knee. Do not judge strictly. And better not climb here.
 *
 * Copyright 2016-2020 Blife Authors
 * https://custom-cursor.com
 */
var ticks_labels = [];
var maxSize = 128;
var parser = new UAParser();
var result = parser.getResult();

if (result.os.name == "Linux" || result.os.name == 'Chromium OS' || result.os.name == 'macOS') {
    maxSize = 128;
}


if (result.os.name == "Windows") {
    switch (result.os.version) {
        case "10":
            maxSize = 128;
            break;
        case "8.1":
            maxSize = 64;
            break;
        case "8":
            maxSize = 64;
            break;
        case "7":
            maxSize = 64;
            break;
        default:
            maxSize = 64;
            break;
    }
}
if (maxSize == 128) {
    ticks_labels = [
        chrome.i18n.getMessage("cursor_size_small"),
        chrome.i18n.getMessage("cursor_size_24x24"),
        chrome.i18n.getMessage("cursor_size_32x32"),
        chrome.i18n.getMessage("cursor_size_48x48"),
        chrome.i18n.getMessage("cursor_size_64x64"),
        chrome.i18n.getMessage("cursor_size_80x80"),
        chrome.i18n.getMessage("cursor_size_96x96"),
        chrome.i18n.getMessage("cursor_size_large"),
    ];
    $("#inputSlider").append(`
      <input id="ex21" type="text" name="size_cursor" style="display: none"
            data-slider-tooltip="hide"
            data-slider-ticks="[1, 2, 3, 4, 5, 6, 7, 8]"
            data-slider-ticks-labels='["small", ".", ".", ".", ".",  ".", ".", "large"]'
            data-slider-min="1"
            data-slider-max="8"
            data-slider-step="1"
            data-slider-value="8"
            value="2"/>   
    `)
}
if (maxSize == 64) {
    ticks_labels = [
        chrome.i18n.getMessage("cursor_size_small"),
        chrome.i18n.getMessage("cursor_size_24x24"),
        chrome.i18n.getMessage("cursor_size_32x32"),
        chrome.i18n.getMessage("cursor_size_48x48"),
        chrome.i18n.getMessage("cursor_size_large"),
    ];
    $("#inputSlider").append(`
      <input id="ex21" type="text" name="size_cursor" style="display: none"
            data-slider-tooltip="hide"
            data-slider-ticks="[1, 2, 3, 4, 5]"
            data-slider-ticks-labels='["small",  ".", ".", ".", "large"]'
            data-slider-min="1"
            data-slider-max="5"
            data-slider-step="1"
            data-slider-value="5"
            value="2"/>   
    `)
}
;


chrome.storage.local.get('size', function (data) {
    $("#ex21")
        .slider({value: data.size, focus: true, ticks_labels: ticks_labels})
        .on("change", function (item) {
            chrome.storage.local.set({size: item.value.newValue});
        });
})

chrome.storage.local.get(null, function (items) {
    var CONFIG = items;
    try {
        if (CONFIG.favorites.length == 0) {
            $("#bf").attr('disabled', "disabled");
            $("#rotator_status").attr('disabled', "disabled");
            CONFIG.rotator.status = "off";
            saveRotator();
        }    
    } catch (e) {
        
    }
    

    if (!CONFIG.favorites) {
        CONFIG.favorites = [];
    }

    var wrapFiles = $('.files-wr');

    if (CONFIG.rotator.type == "time") {
        $("#rotator_type_count").val(CONFIG.rotator.time)

    } else if (CONFIG.rotator.type == "request") {
        $("#rotator_type").attr('checked', 'checked');
        $("#rotator_type_count").val(CONFIG.rotator.request)
    }


    let f = `<ul>`;
    if (CONFIG.collection) {
        for (let i in CONFIG.collection) {
            var collection = `
                <div class="col-4 collection-card mt-1" data-id="${i}">
                    <div class="card card-collection">
                        <h5 class="card-title">${CONFIG.collection[i].name}</h5>
                        <a href="#" data-toggle="modal" data-target="#${CONFIG.collection[i].slug}" class="show">
                            <img src="${CONFIG.collection[i].image}" class="card-img-top img-fluid" alt="img">
                        </a>          
                        <div class="card-body row">      
                        <div class="col text-left">
                            <a class="btn btn-danger card-link delete" href="#" data-id="${i}">${chrome.i18n.getMessage("delete")}</a>
                        </div>                     
                        <div class="col text-right">                              
                            <a href="#" data-toggle="modal" data-target="#${CONFIG.collection[i].slug}" class="btn  btn-info card-link">${chrome.i18n.getMessage('nav_manage')}</a></div>                        
                        </div>
                    </div>
                </div>`;

            let list = `<ul>`;
            for (let y in CONFIG.collection[i].items) {
                let pack = CONFIG.collection[i].items[y];
                if (pack == null)
                    continue;
                list += `<li class="text-left" id="pack${pack.id}"><img src="${pack.image}" style="width: 60px"><span class="pack-name">${pack.name}</span> <a href="#" data-pack-id="${pack.id}" data-collection-slug="${CONFIG.collection[i].slug}" class="delete-pack">${chrome.i18n.getMessage("delete")}</a></li>`;
                if (CONFIG.favorites.indexOf(pack.id) !== -1) {
                    f += `<li class="text-left" data-pack-id="${pack.id}"><img src="${pack.image}" style="width: 60px"><span class="pack-name">${pack.name}</span> <a href="#" data-pack-id="${pack.id}" data-is-favorite="1" data-collection-slug="${CONFIG.collection[i].slug}" class="delete-pack-favorite">${chrome.i18n.getMessage("delete")}</a></li>`;
                }
            }
            list += "</ol>"

            let packs = `                               
                <div class="modal fade" id="${CONFIG.collection[i].slug}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">${CONFIG.collection[i].name}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body">
                             ${list}
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                          </div>
                        </div>
                      </div>
                    </div>`;

            $("#dialogs").append(packs)
            wrapFiles.prepend(collection);
        }


        let fpacks = `                               
                <div class="modal fade" id="favorites" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Favorites</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body">
                             ${f}
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                          </div>
                        </div>
                      </div>
                    </div>`;

        if (CONFIG.favorites.length != 0) {
            $("#favorites1").append(fpacks)
        }


        if (items.rotator.status == "on") {
            $("#rotator_status").attr('checked', 'checked')
            onRotator();
        } else {
            offRotator();
        }


    }

    $(".delete-pack").on('click', function (e) {
        var packId = $(this).data('pack-id'),
            collection = $(this).data('collection-slug'),
            tmp = [];
        $(`#pack${packId}`).remove();
        for (var i in CONFIG.collection[collection].items) {
            var item = CONFIG.collection[collection].items[i];
            if (item.id == packId) {
            } else {
                tmp.push(item)
            }
        }
        if (tmp.length == 0) {
            delete CONFIG.collection[collection];
            $(`#${collection}`).modal("hide");
            $(`[data-id=${collection}]`).remove()
        } else {
            CONFIG.collection[collection].items = tmp;
        }
        chrome.storage.local.set({collection: CONFIG.collection});
        CONFIG.favorites = arrayRemove(CONFIG.favorites, packId);
        chrome.storage.local.set({favorites: CONFIG.favorites});

        e.preventDefault();
    });


    function arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele != value;
        });

    }


    $('.delete-pack-favorite').on('click', function (e) {
        var id = $(this).data('pack-id');

        CONFIG.favorites = arrayRemove(CONFIG.favorites, id);

        chrome.storage.local.set({favorites: CONFIG.favorites});


        setTimeout(function () {
            $(`#favorites li[data-pack-id="${id}"]`).hide();
            $(`#favorites li[data-pack-id="${id}"]`).remove();
        }, 200);

        if (CONFIG.favorites.length == 0) {
            $(`#favorites`).modal("hide");
            $(`[data-id=9999999999999999999999999]`).remove();


            $("#bf").attr('disabled', "disabled");
            $("#rotator_status").attr('disabled', "disabled");
            $("#rotator_type").attr('disabled', "disabled");


            CONFIG.rotator.status = "off";
            saveRotator();

        }
        e.preventDefault();
    });

    $(".delete").on('click', function (e) {
        var id = $(this).data('id'),
            tmp = CONFIG.collection[id];
        delete CONFIG.collection[id];

        chrome.storage.local.set({collection: CONFIG.collection});
        chrome.storage.local.remove(tmp.slug);

        setTimeout(function () {
            $(`div[data-id="${id}"]`).hide();
            $(`div[data-id="${id}"]`).remove();
        }, 200);
        e.preventDefault()
    });


    $("#rotator_status").on('change', function (e) {
        if ($(this).is(':checked')) {
            onRotator()
        } else {
            offRotator()
        }
    });

    $('#rotator_type').on('change', function () {
        if ($(this).is(':checked')) {
            CONFIG.rotator.type = "request";
            CONFIG.rotator.status = "on";

            $('#rotator_type_count').val(CONFIG.rotator.request);
        } else {
            CONFIG.rotator.type = "time";
            CONFIG.rotator.status = "on";

            $('#rotator_type_count').val(CONFIG.rotator.time);

        }
        saveRotator();

    });

    function sendTo(data) {
        data.data = CONFIG.rotator;
        chrome.runtime.sendMessage(data, (r) => {
            if (r) console.log()
        })
    }

    function offRotator() {
        $('#rotator_type')
            .attr('disabled', 'disabled');
        $('#rotator_type_count')
            .attr('disabled', 'disabled');

        CONFIG.rotator.status = "off";

        saveRotator();

    }

    function onRotator() {
        $('#rotator_type').removeAttr('disabled')
        $('#rotator_type_count').removeAttr('disabled');

        CONFIG.rotator.status = "on";

        if ($('#rotator_type').is(':checked')) {
            CONFIG.rotator.type = "request";
        } else {
            CONFIG.rotator.type = "time";
        }

        saveRotator();


    }

    $('#rotator_type_count').on('change', function (e) {
        if ($("#rotator_type").is(':checked')) {
            CONFIG.rotator.request = $(this).val();
        } else {
            if($(this).val()< 10) {
                alert("Min value 10")
                return;
            }
            CONFIG.rotator.time = $(this).val();
        }
        saveRotator();
    });

    function saveRotator() {

        if (CONFIG.favorites.length <= 1) {
            CONFIG.rotator.status = "off";
            console.log("Ошибка")
        }
        sendTo({action: 'rotator'});

        chrome.storage.local.set({"rotator": CONFIG.rotator});
    }

    $('.modal-body').css({
        'max-height': ($(window).height() - 200)
    })
    window.onresize = () => {
        $('.modal-body').css({
            'max-height': ($(window).height() - 200)
        })
    }



    (new Localize()).init();


});