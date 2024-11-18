let amplitude1 = 50;
let amplitude2 = 50;
let time = 0;
let running = true;

const fullData1 = [];
const fullData2 = [];
let displayData1 = [];
let displayData2 = [];

const amplitudeSlider1 = document.getElementById('amplitudeSlider1');
const amplitudeInput1 = document.getElementById('amplitudeInput1');
const amplitudeSlider2 = document.getElementById('amplitudeSlider2');
const amplitudeInput2 = document.getElementById('amplitudeInput2');
const showGraph1Checkbox = document.getElementById('showGraph1');
const showGraph2Checkbox = document.getElementById('showGraph2');
const stopButton = document.getElementById('stopButton');
const minAmplitude1 = document.getElementById('minAmplitude1');
const maxAmplitude1 = document.getElementById('maxAmplitude1');
const minAmplitude2 = document.getElementById('minAmplitude2');
const maxAmplitude2 = document.getElementById('maxAmplitude2');
const confirmButton = document.getElementById('confirmButton');
const initialSettings = document.getElementById('initialSettings');
const controlPanel = document.getElementById('controlPanel');
const dataGraph = document.getElementById('dataGraph');

const data = {
    labels: Array.from({ length: 100 }, (_, i) => i),
    datasets: [
        {
            label: 'Graph 1 (Sinus)',
            data: displayData1,
            borderColor: 'blue',
            borderWidth: 2,
            hidden: !showGraph1Checkbox.checked,
        },
        {
            label: 'Graph 2 (Cosinus)',
            data: displayData2,
            borderColor: 'red',
            borderWidth: 2,
            hidden: !showGraph2Checkbox.checked,
        }
    ]
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: 'Time' }},
            y: { title: { display: true, text: 'Amplitude' }}
        }
    }
};

const myChart = new Chart(dataGraph, config);

confirmButton.addEventListener('click', () => {
    const min1 = parseInt(minAmplitude1.value);
    const max1 = parseInt(maxAmplitude1.value);
    const min2 = parseInt(minAmplitude2.value);
    const max2 = parseInt(maxAmplitude2.value);

    if (isNaN(min1) || isNaN(max1) || isNaN(min2) || isNaN(max2) || min1 >= max1 || min2 >= max2) {
        alert("Please enter valid minimum and maximum values for both amplitudes.");
        return;
    }

    if (min1 < 1 || max1 > 200 || min2 < 1 || max2 > 200) {
        alert("Minimum and maximum values must be within the range of 1 to 200.");
        return;
    }

    amplitudeSlider1.min = min1;
    amplitudeSlider1.max = max1;
    amplitudeSlider1.value = min1;
    amplitudeInput1.min = min1;
    amplitudeInput1.max = max1;
    amplitudeInput1.value = min1;
    amplitudeSlider2.min = min2;
    amplitudeSlider2.max = max2;
    amplitudeSlider2.value = min2;
    amplitudeInput2.min = min2;
    amplitudeInput2.max = max2;
    amplitudeInput2.value = min2;

    initialSettings.style.display = 'none';
    controlPanel.style.display = 'flex';
    dataGraph.style.display = 'block';

    amplitude1 = min1;
    amplitude2 = min2;
    let tooltip1 = document.getElementById("tooltip1");
    let tooltip2 = document.getElementById("tooltip2");
    tooltip1.textContent = amplitudeSlider1.value;
    tooltip2.textContent = amplitudeSlider2.value;
    updateChartData();
});

function updateAmplitude() {
    amplitude1 = parseInt(amplitudeSlider1.value);
    amplitude2 = parseInt(amplitudeSlider2.value);
    amplitudeInput1.value = amplitude1;
    amplitudeInput2.value = amplitude2;
}

function updateGraphVisibility() {
    data.datasets[0].hidden = !showGraph1Checkbox.checked;
    data.datasets[1].hidden = !showGraph2Checkbox.checked;
    myChart.update();
}

showGraph1Checkbox.addEventListener('change', updateGraphVisibility);
showGraph2Checkbox.addEventListener('change', updateGraphVisibility);

amplitudeSlider1.addEventListener('input', updateAmplitude);
amplitudeInput1.addEventListener('input', (e) => {
    amplitudeSlider1.value = e.target.value;
    updateAmplitude();
});
amplitudeSlider2.addEventListener('input', updateAmplitude);
amplitudeInput2.addEventListener('input', (e) => {
    amplitudeSlider2.value = e.target.value;
    updateAmplitude();
});

function updateChartData() {
    if (!running) return;

    const newPoint1 = Math.sin(time * 0.1) * amplitude1;
    const newPoint2 = Math.cos(time * 0.1) * amplitude2;
    time++;

    fullData1.push(newPoint1);
    fullData2.push(newPoint2);

    if (fullData1.length > 100) {
        displayData1 = fullData1.slice(-100);
        displayData2 = fullData2.slice(-100);
    } else {
        displayData1 = fullData1.slice();
        displayData2 = fullData2.slice();
    }

    data.labels = Array.from({ length: displayData1.length }, (_, i) => time - displayData1.length + i);
    data.datasets[0].data = displayData1;
    data.datasets[1].data = displayData2;

    myChart.update();

    requestAnimationFrame(updateChartData);
}

stopButton.addEventListener('click', () => {
    running = false;
    data.labels = Array.from({ length: fullData1.length }, (_, i) => i);
    data.datasets[0].data = fullData1;
    data.datasets[1].data = fullData2;
    myChart.update();
});

document.addEventListener("DOMContentLoaded", function() {
    const sliders = [
        { slider: document.getElementById("amplitudeSlider1"), tooltip: document.getElementById("tooltip1") },
        { slider: document.getElementById("amplitudeSlider2"), tooltip: document.getElementById("tooltip2") },
    ];

    sliders.forEach(({ slider, tooltip }) => {
        updateTooltipPosition(slider, tooltip);
        slider.addEventListener("input", () => updateTooltipPosition(slider, tooltip));
    });

    function updateTooltipPosition(slider, tooltip) {
        tooltip.textContent = slider.value;
        const sliderRange = slider.max - slider.min;
        const sliderPosition = ((slider.value - slider.min) / sliderRange) * 100;
        tooltip.style.left = `${sliderPosition}%`;
    }
});

