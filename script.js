let selectedWaveform = 0;


let waveformSlider = document.getElementById("waveformTypeSlider")
waveformSlider.oninput = function() {
    selectedWaveform = this.value;
    document.getElementById("waveformTypeName").innerHTML = WAVEFORMS[selectedWaveform];
}

document.querySelector("#play").addEventListener('click',() => {
    const actx = new (AudioContext || webkitAudioContext)();
    if(!actx) throw 'Not Supported';
    const osc = actx.createOscillator();
    osc.type = WAVEFORMS[selectedWaveform];
    osc.frequency.value = 440; //Hz
    osc.connect(actx.destination);
    osc.start();
    osc.stop(actx.currentTime + 2);
})

const WAVEFORMS = [
    "sine",
    "square",
    "sawtooth",
    "triangle"
]