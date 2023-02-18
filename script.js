const NOTES = {
    'c-4' : 261.63,
    'c#4' : 277.18,
    'd-4' : 293.67,
    'd#4' : 311.13,
    'e-4' : 329.63,
    'f-4' : 349.23,
    'f#4' : 370.23,
    'g-4' : 392.00,
    'g#4' : 415.30,
    'a-4' : 440.00,
    'a#4' : 466.16,
    'b-4' : 493.88,
    'c-5' : 523.25,
    'c#5' : 554.37,
    'd-5' : 587.33,
    'd#5' : 622.25,
    'e-5' : 659.26,
}

const actx = new (AudioContext || webkitAudioContext)();
if(!actx) throw 'Not Supported';

let osc;

document.querySelectorAll('div[data-note]').forEach((button) => {
    button.addEventListener('mousedown', () => {
        osc = actx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = NOTES[button.dataset.note];
        osc.connect(actx.destination);
        osc.start();

    })

    button.addEventListener('mouseup', () => {osc.stop()});
})




