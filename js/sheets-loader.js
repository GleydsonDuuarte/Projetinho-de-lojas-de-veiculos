// sheets-loader.js - Sistema com Google Sheets
console.log('Carregando sistema Google Sheets...');

// Função básica para testar
async function loadModelsSection() {
    console.log('Função loadModelsSection carregada');
    const grid = document.getElementById('modelsGrid');
    if (grid) {
        grid.innerHTML = '<p>Carregando veículos da planilha...</p>';
    }
}

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', loadModelsSection);
