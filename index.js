// Animation
import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";

const animation_1 = new DotLottie({
    canvas: document.getElementById('dotLottie-canvas_1'),
    src: '../assets/animation/lock_1.json',
    loop: false,
    autoplay: false,
    speed: 2.5,
    segment: [0, 80]
});

document.getElementById('entry-button_1').addEventListener('click', () => {
    animation_1.play();
})

animation_1.addEventListener('complete', () => {
    setTimeout(() => {
        animation_1.setFrame(0);
    }, 5000)
})


const animation_3 = new DotLottie({
    canvas: document.getElementById('dotLottie-canvas_3'),
    src: '../assets/animation/lock_3.json',
    loop: false,
    autoplay: false,
});

document.getElementById('entry-button_3').addEventListener('click', () => {
    animation_3.play();
})

animation_3.addEventListener('complete', () => {
    setTimeout(() => {
        animation_3.setFrame(0);
    }, 5000)
})


const animation_4 = new DotLottie({
    canvas: document.getElementById('dotLottie-canvas_4'),
    src: '../assets/animation/door_9.json',
    loop: false,
    autoplay: false,
    speed: 2.5,
});

document.getElementById('entry-button_4').addEventListener('click', () => {
    animation_4.play();
})

animation_4.addEventListener('complete', () => {
    setTimeout(() => {
        animation_4.setFrame(0);
    }, 3000)
})


window.addEventListener('resize', () => {
    animation_1.resize();
    animation_3.resize();
    animation_4.resize();
})


//EditBox
EditBox.init();
const editBoxes = EditBox.instances;

const forms = document.querySelectorAll('.form');
forms.forEach(form => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        editBoxes.forEach(function(editBox) {
            if (form.contains(editBox.getRootNode())) {
                editBox.verify();
            }
        })
    })
})


//Modal
const modalRootNode = document.querySelector('.modal');
const modal = new Modal({rootNode: modalRootNode});
modal.focus(modalRootNode.querySelector('.input-name'));

const openModalButton = document.getElementById('open-modal');
openModalButton.addEventListener('click', () => {
    modal.open();
})

const modalEditBoxes = editBoxes?.filter((editBox) => modalRootNode.contains(editBox.getRootNode()));
const modalForm = document.querySelector('.modal .form');

modal.onClose(clearForm);
function clearForm() {
    modalEditBoxes.forEach((modalEditBox) => {
        modalEditBox.reset();
    })
}


// Table
Table.init();


//Handling focus when tab is pressed
const focusableEls = document.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])');
let lastPressedKey = null;
let lastFocusEl = null;

document.addEventListener('keydown', (event) => {
    lastPressedKey = event.code.toLocaleLowerCase();
})

document.addEventListener('mousedown', (event) => {
    lastPressedKey = null;
})

focusableEls.forEach((el) => {
    el.addEventListener('focus', (event) => {
        lastFocusEl ? lastFocusEl.classList.remove('tabFocus') : null;

        if (lastPressedKey === 'tab') {
            el.classList.add('tabFocus');
            lastFocusEl = el;
        }
    })
})


