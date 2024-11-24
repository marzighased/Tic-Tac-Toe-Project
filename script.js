let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = 'circle';

let gameOver = false;

function init() {
    render();
}



function generateCircleSVG() {
    return `
      <svg width="70" height="70" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#00B0EF" stroke-width="10" fill="none" />
      </svg>
    `;
}

function generateCrossSVG() {
    return `
      <svg width="70" height="70" viewBox="0 0 100 100">
        <line x1="20" y1="20" x2="80" y2="80" stroke="#FFC000" stroke-width="10" stroke-linecap="round" />
        <line x1="80" y1="20" x2="20" y2="80" stroke="#FFC000" stroke-width="10" stroke-linecap="round" />
      </svg>
    `;
}

function render() {
    const contentDiv = document.getElementById('content');
    let tableHTML = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            tableHTML += `
              <td onclick="handleClick(${index}, this)">
                ${fields[index] === 'circle' ? generateCircleSVG() : fields[index] === 'cross' ? generateCrossSVG() : ''}
              </td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    contentDiv.innerHTML = tableHTML;
}

function handleClick(index, cell) {
    if (fields[index] === null && !gameOver) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        cell.onclick = null;

        const winner = checkWin();
        if (winner) {
            gameOver = true;
            setTimeout(() => drawWinningLine(winner), 500); 
            return;
        }

        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    }
}

function checkWin() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return combination; 
        }
    }

    return null; 
}

function drawWinningLine(winningCombination) {
    const lineContainer = document.getElementById('content');
    const table = lineContainer.querySelector('table');
    const rect = table.getBoundingClientRect();
    const cellSize = rect.width / 3;

    const startX = (winningCombination[0] % 3) * cellSize + cellSize / 2;
    const startY = Math.floor(winningCombination[0] / 3) * cellSize + cellSize / 2;
    const endX = (winningCombination[2] % 3) * cellSize + cellSize / 2;
    const endY = Math.floor(winningCombination[2] / 3) * cellSize + cellSize / 2;

    const lineSVG = `
      <svg class="winning-line" width="100%" height="100%" style="position: absolute; top: 0; left: 0; pointer-events: none; z-index: 10;">
        <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="white" stroke-width="10" stroke-linecap="round" />
      </svg>
    `;
    lineContainer.innerHTML += lineSVG;
}

