// Pokemon emoji mapping
const emojiMap = {
    "エレキ": "⚡",
    "アイス": "❄️",
    "ロック": "🪨",
    "スチル": "🔩",
    "ドラゴ": "🐉"
};

// Color mapping for Pokemon
const colorMap = {
    "エレキ": "bg-blue",
    "アイス": "bg-yellow",
    "ロック": "bg-purple",
    "スチル": "bg-green",
    "ドラゴ": "bg-pink"
};

// Store history data
let historyData = [];

// Initial embedded data (can be overridden by loading a file)
const initialData = `7:00上,7:00下,4:30上,4:30下,3:00上,3:00下
エレキ,ロック,アイス,スチル,エレキ,スチル
アイス,スチル,エレキ,ロック,アイス,ロック
エレキ,スチル,アイス,ロック,エレキ,ロック
ロック,エレキ,アイス,エレキ,ロック,エレキ
アイス,エレキ,エレキ,ロック,ロック,エレキ
エレキ,ロック,エレキ,ロック,ロック,エレキ
スチル,エレキ,ロック,エレキ,スチル,ロック
エレキ,スチル,エレキ,ロック,エレキ,アイス`;

// Get DOM elements
const topSelect = document.getElementById('top-select');
const bottomSelect = document.getElementById('bottom-select');
const predictBtn = document.getElementById('predict-btn');
const resultsDiv = document.getElementById('results');
const predictionsContainer = document.getElementById('predictions-container');
const addDataBtn = document.getElementById('add-data-btn');
const dataForm = document.getElementById('data-form');
const customModal = document.getElementById('custom-modal');
const modalMessage = document.getElementById('modal-message');
const modalOkBtn = document.getElementById('modal-ok-btn');
const resetBtn = document.getElementById('reset-btn');
const historyContainer = document.getElementById('history-container');

// Custom modal dialog function
function showModal(message) {
    modalMessage.textContent = message;
    customModal.classList.remove('hidden');
}

// Close modal when OK is clicked
modalOkBtn.addEventListener('click', () => {
    customModal.classList.add('hidden');
});

// Reset button - hide prediction results
resetBtn.addEventListener('click', () => {
    resultsDiv.classList.add('hidden');
    predictionsContainer.innerHTML = '';
});

// Display history data
function displayHistory() {
    if (historyData.length === 0) {
        historyContainer.innerHTML = '<p class="no-data">まだデータがありません</p>';
        return;
    }

    historyContainer.innerHTML = '';

    // Display in reverse order (newest first)
    const reversedData = [...historyData].reverse();

    reversedData.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';

        item.innerHTML = `
            <div class="history-header">#${historyData.length - index}</div>
            <div class="history-times">
                <div class="history-time">
                    <div class="history-time-label">⏰ 7:00</div>
                    <div class="history-pokemon">
                        <span class="history-pokemon-item ${colorMap[entry["7:00"].top]}">
                            ${emojiMap[entry["7:00"].top]} ${entry["7:00"].top}
                        </span>
                        <span class="history-pokemon-item ${colorMap[entry["7:00"].bottom]}">
                            ${emojiMap[entry["7:00"].bottom]} ${entry["7:00"].bottom}
                        </span>
                    </div>
                </div>
                <div class="history-time">
                    <div class="history-time-label">⏰ 4:30</div>
                    <div class="history-pokemon">
                        <span class="history-pokemon-item ${colorMap[entry["4:30"].top]}">
                            ${emojiMap[entry["4:30"].top]} ${entry["4:30"].top}
                        </span>
                        <span class="history-pokemon-item ${colorMap[entry["4:30"].bottom]}">
                            ${emojiMap[entry["4:30"].bottom]} ${entry["4:30"].bottom}
                        </span>
                    </div>
                </div>
                <div class="history-time">
                    <div class="history-time-label">⏰ 3:00</div>
                    <div class="history-pokemon">
                        <span class="history-pokemon-item ${colorMap[entry["3:00"].top]}">
                            ${emojiMap[entry["3:00"].top]} ${entry["3:00"].top}
                        </span>
                        <span class="history-pokemon-item ${colorMap[entry["3:00"].bottom]}">
                            ${emojiMap[entry["3:00"].bottom]} ${entry["3:00"].bottom}
                        </span>
                    </div>
                </div>
            </div>
        `;

        historyContainer.appendChild(item);
    });
}

// Parse CSV data
function parseHistoryData(csvText) {
    const lines = csvText.trim().split('\n');
    historyData = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length === 6) {
            historyData.push({
                "7:00": { top: parts[0].trim(), bottom: parts[1].trim() },
                "4:30": { top: parts[2].trim(), bottom: parts[3].trim() },
                "3:00": { top: parts[4].trim(), bottom: parts[5].trim() }
            });
        }
    }
}

// Add new data entry
addDataBtn.addEventListener('click', () => {
    const form700Top = document.getElementById('form-700-top').value;
    const form700Bottom = document.getElementById('form-700-bottom').value;
    const form430Top = document.getElementById('form-430-top').value;
    const form430Bottom = document.getElementById('form-430-bottom').value;
    const form300Top = document.getElementById('form-300-top').value;
    const form300Bottom = document.getElementById('form-300-bottom').value;

    if (!form700Top || !form700Bottom || !form430Top || !form430Bottom || !form300Top || !form300Bottom) {
        showModal('⚠️ すべてのポケモンを選んでね！');
        return;
    }

    // Add to history
    historyData.push({
        "7:00": { top: form700Top, bottom: form700Bottom },
        "4:30": { top: form430Top, bottom: form430Bottom },
        "3:00": { top: form300Top, bottom: form300Bottom }
    });

    // Update history display
    displayHistory();

    // Download updated file
    downloadUpdatedHistory();

    showModal('✅ データを追加しました！ファイルをダウンロードして、history.txtに保存してね！');

    // Clear form
    document.getElementById('form-700-top').value = '';
    document.getElementById('form-700-bottom').value = '';
    document.getElementById('form-430-top').value = '';
    document.getElementById('form-430-bottom').value = '';
    document.getElementById('form-300-top').value = '';
    document.getElementById('form-300-bottom').value = '';
    dataForm.classList.add('hidden');
});

// Download updated history file
function downloadUpdatedHistory() {
    // Create CSV content
    let csvContent = '7:00上,7:00下,4:30上,4:30下,3:00上,3:00下\n';
    historyData.forEach(entry => {
        csvContent += `${entry["7:00"].top},${entry["7:00"].bottom},${entry["4:30"].top},${entry["4:30"].bottom},${entry["3:00"].top},${entry["3:00"].bottom}\n`;
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'history.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Predict button click handler
predictBtn.addEventListener('click', () => {
    const topChoice = topSelect.value;
    const bottomChoice = bottomSelect.value;

    if (!topChoice || !bottomChoice) {
        showModal('⚠️ 上と下のポケモンをえらんでね！');
        return;
    }

    if (topChoice === bottomChoice) {
        showModal('⚠️ おなじポケモンはえらべないよ！');
        return;
    }

    if (historyData.length === 0) {
        showModal('⚠️ まずデータを読み込んでね！');
        return;
    }

    // Filter matching patterns
    const matchingPatterns = historyData.filter(entry =>
        entry["7:00"].top === topChoice && entry["7:00"].bottom === bottomChoice
    );

    if (matchingPatterns.length === 0) {
        showModal('❌ そのくみあわせのデータがまだないよ！');
        return;
    }

    // Count frequencies for 4:30 and 3:00
    const freq430 = {};
    const freq300 = {};

    matchingPatterns.forEach(pattern => {
        const key430 = `${pattern["4:30"].top}-${pattern["4:30"].bottom}`;
        const key300 = `${pattern["3:00"].top}-${pattern["3:00"].bottom}`;

        freq430[key430] = (freq430[key430] || 0) + 1;
        freq300[key300] = (freq300[key300] || 0) + 1;
    });

    // Get top 3 for each time
    const top430 = getTop3(freq430, matchingPatterns.length);
    const top300 = getTop3(freq300, matchingPatterns.length);

    // Display results
    displayResults(top430, top300);
});

// Get top 3 most frequent combinations
function getTop3(frequencies, total) {
    const sorted = Object.entries(frequencies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return sorted.map(([key, count]) => {
        const [top, bottom] = key.split('-');
        return {
            top,
            bottom,
            percentage: ((count / total) * 100).toFixed(1)
        };
    });
}

function displayResults(top430, top300) {
    predictionsContainer.innerHTML = `
        <div class="prediction-section">
            <h3 class="time-header">⏰ 4:30 のよそく</h3>
            ${top430.map((pred, index) => createPredictionCard(pred, index, '4:30')).join('')}
        </div>
        
        <div class="prediction-section">
            <h3 class="time-header">⏰ 3:00 のよそく</h3>
            ${top300.map((pred, index) => createPredictionCard(pred, index, '3:00')).join('')}
        </div>
    `;

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function createPredictionCard(prediction, index, time) {
    const rank = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';

    return `
        <div class="prediction-card">
            <div class="rank">${rank} ${index + 1}ばん</div>
            <div class="pokemon-row">
                <div class="pokemon-item ${colorMap[prediction.top]}">
                    ${emojiMap[prediction.top]} ${prediction.top}
                </div>
                <div class="pokemon-item ${colorMap['ドラゴ']}">
                    ${emojiMap['ドラゴ']} ドラゴ
                </div>
                <div class="pokemon-item ${colorMap[prediction.bottom]}">
                    ${emojiMap[prediction.bottom]} ${prediction.bottom}
                </div>
            </div>
            <div class="probability">
                🎯 でてくるかのうせい: ${prediction.percentage}%
            </div>
        </div>
    `;
}

// Load initial data on page load
parseHistoryData(initialData);
console.log('📊 初期データを読み込みました！', historyData.length, '件のデータ');

// Display initial history
displayHistory();
