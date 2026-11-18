* {
    box-sizing: border-box;
}

body {
    margin: 0;
    background: #0b1220;
    color: #f1f5f9;
    font-family: Arial, sans-serif;
}

.container {
    max-width: 850px;
    margin: auto;
    padding: 25px 18px;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
}

h1 {
    margin: 0;
    font-size: 25px;
}

header p, .description {
    color: #94a3b8;
    font-size: 13px;
}

.status {
    color: #34d399;
    font-size: 12px;
    font-weight: bold;
}

.card {
    background: #172338;
    padding: 25px;
    border-radius: 18px;
    border: 1px solid #25354c;
    margin-bottom: 18px;
}

.label {
    color: #94a3b8;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
}

.main-card {
    padding: 32px;
}

.temperature {
    font-size: clamp(60px, 12vw, 85px);
    font-weight: bold;
    color: #38bdf8;
    margin: 15px 0;
}

.unit {
    font-size: 35px;
}

.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
}

.small-value {
    font-size: 36px;
    font-weight: bold;
    color: #38bdf8;
    margin: 20px 0 5px;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.chart-header h2 {
    font-size: 18px;
}

.chart-header span {
    font-size: 11px;
    color: #94a3b8;
}

canvas {
    display: block;
    width: 100%;
    height: 220px;
}

footer {
    color: #64748b;
    text-align: center;
    font-size: 12px;
    padding: 20px;
}

@media(max-width: 480px) {
    .grid {
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }

    .card {
        padding: 18px;
    }

    header {
        align-items: flex-start;
    }
}

