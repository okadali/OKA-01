const actx = new (AudioContext || webkitAudioContext)();
if(!actx) throw 'Not Supported';

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
    'f-5' : 698.46,
    'f#5' : 739.99,
    'g-5' : 783.99,
    'g#5' : 830.61,
    'a-5' : 880.00,
    'a#5' : 932.33,
    'b-5' : 987.77,
}

let unisonWidth = 10;



let oscBank = new Array(3);
const createOscillators = (freq,detune) => {
    osc = actx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    osc.detune.value = detune;
    osc.connect(actx.destination);
    osc.start();
    return osc;
}
const noteOn = (note) => {
    const freq = NOTES[note];
    oscBank[0] = createOscillators(freq,0);
    oscBank[1] = createOscillators(freq, -unisonWidth);
    oscBank[2] = createOscillators(freq, unisonWidth);
}

document.querySelectorAll('div[data-note]').forEach((button) => {
    const stopOsc = () => {
        oscBank.forEach((item) => {
            item.stop();
        })
    }

    button.addEventListener('mousedown', () => {
        noteOn(button.dataset.note);
    })

    button.addEventListener('mouseup', stopOsc);
    button.addEventListener('mouseleave', stopOsc);
})


document.getElementById("unisonWidthRange").addEventListener('input',(e) => {
    unisonWidth = e.target.value;
})



