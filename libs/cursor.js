/**
 * @author blife
 * @email blife450@gmail.com
 *
 * This code is written on the knee. Do not judge strictly. And better not climb here.
 *
 * Copyright 2016-2019 Blife Authors
 * https://custom-cursor.com
 */
class Cursors {
    constructor() {
        this.size = 4;
        this.cssPointer = `.cc_pointer,[type="search"]::-webkit-search-cancel-button, [type="search"]::-webkit-search-decoration, .paper-button, .ytp-progress-bar-container, input[type=submit], :link, :visited, a > *, img, button, ::-webkit-scrollbar-button, .ogdlpmhglpejoiomcodnpjnfgcpmgale_pointer, ::-webkit-file-upload-button, button, .ytp-volume-panel, #myogdlpmhglpejoiomcodnpjnfgcpmgale .icon { cursor: url("#pointer#") #pointerOffsetX# #pointerOffsetY#, auto !important; } `;
        this.cssCursor = `.cc_cursor, body, .ogdlpmhglpejoiomcodnpjnfgcpmgale_default, body, html, input[type="date"], input[type="time"], input[type="datetime-local"], input[type="month"], input::-webkit-contacts-auto-fill-button, input:read-only {cursor: url("#cursor#") #cursorOffsetX# #cursorOffsetY# , auto !important; }`;
        this.sheet = (function () {let el = document.createElement('style');el.appendChild(document.createTextNode(''));el.type = 'text/css';el.rel = 'stylesheet';document.head.appendChild(el);return el;})();
        /* this.sheet:
        (function() {
            let el = document.createElement('style');
            el.appendChild(document.createTextNode(''));
            el.type = 'text/css';
            el.rel = 'stylesheet';
            document.head.appendChild(el);
            return el;
        })()
        */
        this.animElm = null;

        chrome.storage.onChanged.addListener(function (changes, area) {
            if (area == 'local') {
                this.getSelected();
            }
        }.bind(this));

        this.getSelected();

        chrome.extension.onMessage.addListener(function (request, sender, sendResponseParam) {
            if (request.action == "update") {
                this.getSelected()
            }
            if (request.action == "clear") {
                this.sheet.innerHTML = "";
            }
        }.bind(this))

    }

    getSelected() {
        chrome.storage.local.get(null, function (item) {
            if (item.selected_type == 'none') {
                this.sheet.innerHTML = "";
            }
            this.selected = item.selected;
            this.size = item.size;
            this.init();


        }.bind(this))
    }

    init() {
        if (this.selected) {
            let percentOffset = 4;
            switch (this.size) {
                case 1:percentOffset = 8;break;
                case 2:percentOffset = 5.33;break;
                case 3:percentOffset = 4;break;
                case 4:percentOffset = 2.66;break;
                case 5:percentOffset = 2;break;
                case 6:percentOffset = 1.6;break;
                case 7:percentOffset = 1.33;break;
                case 8:percentOffset = 1;break;
                default:percentOffset = 4;
            }


            if (!this.selected.pointer.offsetX) {
                this.selected.pointer.offsetX = 0;
                this.selected.pointer.offsetY = 0;
                this.selected.cursor.offsetX = 0;
                this.selected.cursor.offsetY = 0;
            }

            this.selected.pointer.offsetX = Math.floor(this.selected.pointer.offsetX / percentOffset);
            this.selected.pointer.offsetY = Math.floor(this.selected.pointer.offsetY / percentOffset);
            this.selected.cursor.offsetX = Math.floor(this.selected.cursor.offsetX / percentOffset);
            this.selected.cursor.offsetY = Math.floor(this.selected.cursor.offsetY / percentOffset);

            let csCursors = JSON.parse(localStorage.getItem('csCursors')), csPointers = JSON.parse(localStorage.getItem('csPointers'));
            if (csCursors == null) csCursors = [];
            if (csPointers == null) csPointers = [];
            let cs_pointers = (csPointers.length > 0) ? csPointers.join(', ') + ', ' : '',
                cs_cursors = (csCursors.length > 0) ? csCursors.join(', ') + ', ' : '';

            this.tmpPointer = '';
            this.tmpCursor = '';
            if (typeof (this.selected.pointer.path) != "undefined") {
                this.tmpPointer = this.cssPointer;
                this.tmpPointer = this.tmpPointer.replace(/#pointer#/g, this.selected.pointer.path);
                this.tmpPointer = this.tmpPointer.replace(/#pointerOffsetX#/g, this.selected.pointer.offsetX);
                this.tmpPointer = this.tmpPointer.replace(/#pointerOffsetY#/g, this.selected.pointer.offsetY);
                this.tmpPointer = cs_pointers + this.tmpPointer;
            }
            if (typeof (this.selected.cursor.path) != "undefined") {
                this.tmpCursor = this.cssCursor;
                this.tmpCursor = this.tmpCursor.replace(/#cursor#/g, this.selected.cursor.path);
                this.tmpCursor = this.tmpCursor.replace(/#cursorOffsetX#/g, this.selected.cursor.offsetX);
                this.tmpCursor = this.tmpCursor.replace(/#cursorOffsetY#/g, this.selected.cursor.offsetY);
                this.tmpCursor = cs_cursors + this.tmpCursor;
            }
            this.sheet.innerHTML = this.tmpCursor + this.tmpPointer;
        } else {
            this.sheet.innerHTML = "";
        }
    }
}

(function () {
    let c = new Cursors();
    let csCursors = JSON.parse(localStorage.getItem('csCursors')),
        csPointers = JSON.parse(localStorage.getItem('csPointers'));
    if (csCursors == null) {csCursors = [];}
    if (csPointers == null) {csPointers = [];}
    document.onmousemove = function (event) {
        try {
            let cs_elementMouseIsOver = document.elementFromPoint(event.clientX, event.clientY),
                cs_cls_name = (cs_elementMouseIsOver.className.trim()).split(' ');
            cs_cls_name.forEach(function (cs_e, i) {  cs_e = cs_e.charAt(0); if (cs_e <= '9' && cs_e >= '0') {cs_cls_name.splice(i, 1);}});
            cs_cls_name = '.' + cs_cls_name.join('.', cs_cls_name);
            cs_cls_name = cs_cls_name.replace('..', '.');
            if ((!csPointers.includes(cs_cls_name)) && (!csCursors.includes(cs_cls_name)) && (cs_cls_name.length > 2)) {
                if ((getComputedStyle(cs_elementMouseIsOver).cursor == 'pointer')) {
                    if (!cs_elementMouseIsOver.classList.contains('cc_pointer')) {cs_elementMouseIsOver.classList.add('cc_pointer');}
                    //if (!cs_elementMouseIsOver.id) {cs_elementMouseIsOver.id = 'css_cc_pointer';}
                    csPointers.push(cs_cls_name);
                    localStorage.setItem('csPointers', JSON.stringify(csPointers));
                } else {
                    if (getComputedStyle(cs_elementMouseIsOver).hasOwnProperty('cursor')) {
                        if (getComputedStyle(cs_elementMouseIsOver).cursor.search('url') == -1) {
                            if (!cs_elementMouseIsOver.classList.contains('cc_cursor')) {cs_elementMouseIsOver.classList.add('cc_cursor');}
                            //if (!cs_elementMouseIsOver.id){cs_elementMouseIsOver.id = 'css_cc_pointer';}
                            csCursors.push(cs_cls_name);
                            localStorage.setItem('csCursors', JSON.stringify(csCursors));
                        }
                    }
                }
            } else {

            }
        } catch (e) {
        }





    }

})();




