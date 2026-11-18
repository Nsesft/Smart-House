
// ======================================
// SUPABASE CONFIGURATION
// ======================================

const SUPABASE_URL = "https://rbsxnxmmondbvdcjwixd.supabase.co";

// Paste your sb_publishable key from Supabase here.
// Never use your sb_secret or service_role key.
const SUPABASE_KEY = "sb_publishable_cqYc9Qoy0VPw6H-4jeXbCQ_w4J5qiUX";

const TABLE_URL =
    `${SUPABASE_URL}/rest/v1/sensor_data`;


// ======================================
// HTML ELEMENTS
// ======================================
const distanceElement =
    document.getElementById("distance");

const temperatureElement =
    document.getElementById("temperature");

const humidityElement =
    document.getElementById("humidity");

const statusElement =
    document.getElementById("status");

const updatedElement =
    document.getElementById("updated");

const chartCanvas =
    document.getElementById("chart");

const chartContext =
    chartCanvas.getContext("2d");


// ======================================
// GET DATA FROM SUPABASE
// ======================================

async function loadSensorData() {

    try {

        statusElement.textContent = "● CONNECTING";

        const response = await fetch(
            `${TABLE_URL}?select=*&order=created_at.desc&limit=60`,
            {
                method: "GET",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `HTTP ${response.status}: ${errorText}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("No sensor readings found");
        }

        // Latest reading first from Supabase.
        const latest = data[0];

        console.log("Latest Supabase row:", latest);
        console.log("Distance value:", latest.distance);

        // Update temperature.
        temperatureElement.textContent =
            Number(latest.temperature).toFixed(1);

        // Update humidity.
        humidityElement.textContent =
            Number(latest.humidity).toFixed(1);

        distanceElement.textContent =
            latest.distance != null
                ? Number(latest.distance).toFixed(1)
                : "--";

        // Update connection status.
        statusElement.textContent = "● CONNECTED";

        // Update timestamp.
        updatedElement.textContent =
            "Last updated: " +
            new Date(latest.created_at).toLocaleString();

        // Reverse readings so the chart goes oldest to newest.
        const chartData = [...data].reverse();

        drawChart(chartData);

    } catch (error) {

        console.error("Supabase error:", error);

        statusElement.textContent = "● CONNECTION ERROR";

        updatedElement.textContent =
            "Could not load sensor data. Check the browser console.";
    }
}


// ======================================
// DRAW TEMPERATURE CHART
// ======================================

function drawChart(data) {

    const canvas = chartCanvas;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    chartContext.setTransform(
        pixelRatio, 0, 0, pixelRatio, 0, 0
    );

    chartContext.clearRect(0, 0, width, height);

    const values = data.map(item =>
        Number(item.temperature)
    );

    if (values.length === 0 ||
        values.some(value => !Number.isFinite(value))) {
        return;
    }

    const minimum = Math.min(...values) - 1;
    const maximum = Math.max(...values) + 1;

    const range = maximum - minimum || 1;

    const padding = 30;

    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Draw horizontal grid lines.
    chartContext.strokeStyle = "#25354c";
    chartContext.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {

        const y =
            padding + (chartHeight / 4) * i;

        chartContext.beginPath();
        chartContext.moveTo(padding, y);
        chartContext.lineTo(width - padding, y);
        chartContext.stroke();
    }

    // Draw temperature line.
    chartContext.beginPath();

    values.forEach((value, index) => {

        const x =
            padding +
            (index / Math.max(values.length - 1, 1)) *
            chartWidth;

        const y =
            padding +
            chartHeight -
            ((value - minimum) / range) * chartHeight;

        if (index === 0) {
            chartContext.moveTo(x, y);
        } else {
            chartContext.lineTo(x, y);
        }
    });

    chartContext.strokeStyle = "#38bdf8";
    chartContext.lineWidth = 3;
    chartContext.stroke();

    // Draw points.
    values.forEach((value, index) => {

        const x =
            padding +
            (index / Math.max(values.length - 1, 1)) *
            chartWidth;

        const y =
            padding +
            chartHeight -
            ((value - minimum) / range) * chartHeight;

        chartContext.beginPath();
        chartContext.arc(x, y, 3, 0, Math.PI * 2);

        chartContext.fillStyle = "#38bdf8";
        chartContext.fill();
    });
}


// ======================================
// AUTOMATIC UPDATES
// ======================================

// Load data immediately.
loadSensorData();

// Refresh every 5 seconds.
setInterval(loadSensorData, 5000);

// Redraw chart when window size changes.
window.addEventListener("resize", () => {
    loadSensorData();
});
