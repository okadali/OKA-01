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
const WAVEFORMS = [
    "sine",
    "square",
    "sawtooth",
    "triangle"
]
const WAVEFORMS_SHORT = [
    "sin",
    "sqr",
    "swt",
    "tri"
]

let volumeLevel = 0.3;
let waveformType = 2;
let unisonWidthSlider = 0.026;
let lowpassFrqSlider = 0.5;
let lowpassQSlider = 0.2;
let echo = {
    time: 0,
    feedback: 0,
}


const maxDuration = 2;
const maxFilterFreq = actx.sampleRate / 2;
const oscBank = new Array(3);

const createOscillators = (freq,detune) => {    
    osc = actx.createOscillator();
    osc.type = WAVEFORMS[waveformType];
    osc.frequency.value = freq;
    osc.detune.value = detune;

    const filter = actx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = lowpassFrqSlider * maxFilterFreq;
    filter.Q.value = lowpassQSlider * 30;

    const volumeLevelNode = actx.createGain();
    volumeLevelNode.gain.value = volumeLevel;
    osc.connect(volumeLevelNode);
    volumeLevelNode.connect(filter)
    
    
    const delayNode = actx.createDelay();
    delayNode.delayTime.value = echo.time * maxDuration;   
    delayNode.connect(actx.destination);

    const gainNode = actx.createGain();
    gainNode.gain.value = echo.feedback;

    filter.connect(delayNode)
    delayNode.connect(gainNode);
    gainNode.connect(delayNode);


    osc.start();
    return osc;
}
const noteOn = (note) => {
    const freq = NOTES[note];
    oscBank[0] = createOscillators(freq,0);
    oscBank[1] = createOscillators(freq, -unisonWidthSlider * 261.63);
    oscBank[2] = createOscillators(freq, unisonWidthSlider * 261.63);
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
    unisonWidthSlider = e.target.value;
})
document.getElementById("lowpassFrqRange").addEventListener('input',(e) => {
    lowpassFrqSlider = e.target.value;
})
document.getElementById("lowpassQRange").addEventListener('input',(e) => {
    console.log(e.target.value);
    lowpassQSlider = e.target.value;
})
document.getElementById("echoTimeRange").addEventListener('input',(e) => {
    echo.time = e.target.value;
})
document.getElementById("echoFdbkRange").addEventListener('input',(e) => {
    echo.feedback = e.target.value;
})
document.getElementById("wawTypeRange").addEventListener('input',(e) => {
    waveformType = e.target.value;
    document.getElementById("wawTypeSpan").innerText = WAVEFORMS_SHORT[waveformType].toUpperCase();
})
document.getElementById("volRange").addEventListener('input',(e) => {
    volumeLevel = e.target.value;
})