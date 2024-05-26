import { $ } from "./src/utility";

(async function () {
    $('.main-paste').addEventListener('paste', function (evt) {
        console.log(evt);
    });

    let pinMoving;
    document.addEventListener('mousedown', function (evt) {
        if(!evt.target.classList.contains('pin-move')) return;
        pinMoving = evt.target.parentElement;
    });

    document.addEventListener('mousemove', function (evt) {
        if(pinMoving) {
            pinMoving.style.left = `${evt.clientX}px`;
        }
    });

    document.addEventListener('mouseup', function (evt) {
        pinMoving = null;
    });

    $('button').addEventListener('click', function () {
        const img = $('.main-paste').querySelector("img");

        const icw = img.clientWidth;
        const ich = img.clientHeight;

        const object = {
            url: img.src,
            name: decodeURI(img.src.match(/.*\/(.*)\//)[1] || ''),
            title: decodeURI(img.src.match(/.*\/.*\/([^[.]*)/)[1] || '').trim(),
            clamps: [
                $('#pin-0').getBoundingClientRect().x * 100 / icw,
                $('#pin-1').getBoundingClientRect().x * 100 / icw,
                $('#pin-2').getBoundingClientRect().x * 100 / icw
            ]
        }

        console.log(JSON.stringify(object));
    });
})();