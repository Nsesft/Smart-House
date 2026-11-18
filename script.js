
const SUPABASE_URL = "https://rbsxnxmmondbvdcjwixd.supabase.co";
const SUPABASE_KEY = "sb_publishable_cqYc9Qoy0VPw6H-4jeXbCQ_w4J5qiUX";

const TABLE = "sensor_data";

const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");
const statusElement = document.getElementById("status");
const updatedElement = document.getElementById("updated");
const chart = document.getElementById("chart");

async function getSensorData() {
	try {
		const response = await fetch(
			`${SUPABASE_URL}/rest/v1/${TABLE}?select=*&order=created_at.desc&limit=60`,
			{
				headers: {
					"apikey": SUPABASE_KEY,
					"Authorization": `Bearer ${SUPABASE_KEY}`
				}
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const data = await response.json();

		if (data.length === 0) {
			statusElement.textContent = "● NO DATA";
			return;
		}

		const latest = data[0];

		temperatureElement.textContent =
			Number(latest.temperature).toFixed(1);

		humidityElement.textContent =
			Number(latest.humidity).toFixed(1);

		statusElement.textContent = "● CONNECTED";

		updatedElement.textContent =
			"Last update: " + new Date(latest.created_at).toLocaleTimeString();

		drawChart(data.reverse());

	} catch (error) {
		console.error("Supabase error:", error);
		statusElement.textContent = "● CONNECTION ERROR";
	}
}

function drawChart(data) {
	const ctx = chart.getContext("2d");

	const width = chart.clientWidth;
	const height = 220;
	const dpr = window.devicePixelRatio || 1;

	chart.width = width * dpr;
	chart.height = height * dpr;

	ctx.scale(dpr, dpr);
	ctx.clearRect(0, 0, width, height);

	const values = data.map(item =>
		Number(item.temperature)
	);

	const min = Math.min(...values) - 2;
	const max = Math.max(...values) + 2;

	const padding = 25;
	const graphWidth = width - padding * 2;
	const graphHeight = height - padding * 2;

	ctx.strokeStyle = "#334155";
	ctx.lineWidth = 1;

	for (let i = 0; i < 4; i++) {
		const y = padding + (graphHeight / 3) * i;

		ctx.beginPath();
		ctx.moveTo(padding, y);
		ctx.lineTo(width - padding, y);
		ctx.stroke();
	}

	if (values.length < 2) return;

	ctx.beginPath();

	values.forEach((value, index) => {
		const x = padding +
			(index / (values.length - 1)) * graphWidth;

		const y = padding +
			((max - value) / (max - min)) * graphHeight;

		if (index === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	});

	ctx.strokeStyle = "#38bdf8";
	ctx.lineWidth = 3;
	ctx.stroke();
}

getSensorData();

setInterval(getSensorData, 5000);

window.addEventListener("resize", getSensorData);

