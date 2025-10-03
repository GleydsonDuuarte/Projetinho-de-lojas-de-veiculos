<<<<<<< HEAD
// Configuração - URLs da API
const LOCAL_SHEETS_URL = '/.netlify/functions/sheets-proxy';
const FALLBACK_SHEETS_URL = `https://docs.google.com/spreadsheets/d/1oLi9rBgMJmQxnluvO65RypDo6nD3zUxWDSdN6eQJoTs/gviz/tq?tqx=out:json`;

// Cache para os dados
let vehiclesCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Variáveis globais para a galeria
let currentModelIndex = 0;
let currentImageIndex = 0;
let currentGalleryImages = [];

// Função para buscar dados da planilha
async function fetchVehiclesFromSheet() {
    // Verificar cache
    if (vehiclesCache && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_DURATION) {
        return vehiclesCache;
    }

    try {
        showLoadingState();
        
        // Tentar primeiro a função Netlify (mais confiável)
        let response = await fetch(LOCAL_SHEETS_URL);
        
        if (!response.ok) {
            // Se falhar, tentar diretamente do Google Sheets
            console.warn('Netlify Function failed, trying direct Google Sheets...');
            response = await fetch(FALLBACK_SHEETS_URL);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const text = await response.text();
            const json = JSON.parse(text.substring(47).slice(0, -2));
            const vehicles = parseSheetData(json);
            
            vehiclesCache = vehicles;
            lastFetchTime = Date.now();
            hideLoadingState();
            return vehicles;
        }
        
        // Processar resposta da Netlify Function
        const data = await response.json();
        
        if (data.success) {
            vehiclesCache = data.data;
            lastFetchTime = Date.now();
            hideLoadingState();
            return data.data;
        } else {
            throw new Error(data.error || 'Erro desconhecido');
        }
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showErrorState();
        return [];
    }
}

// Função para processar os dados da planilha (para fallback)
function parseSheetData(jsonData) {
    const vehicles = [];
    const rows = jsonData.table.rows;
    
    // Pular o cabeçalho (primeira linha)
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cell = row.c;
        
        // Verificar se a linha tem dados
        if (!cell || cell.length === 0 || !cell[0] || !cell[0].v) continue;
        
        try {
            const vehicle = {
                id: cell[0]?.v || i,
                name: cell[1]?.v || '',
                price: formatPrice(cell[2]?.v || ''),
                year: cell[3]?.v || '',
                km: formatKM(cell[4]?.v || ''),
                image: cell[5]?.v || '',
                location: cell[6]?.v || 'Rua das Fronteiras N°77',
                category: cell[7]?.v || 'sedan',
                gallery: parseGallery(cell[8]?.v || ''),
                features: parseFeatures(cell[9]?.v || '')
            };
            
            // Validar dados mínimos
            if (vehicle.name && vehicle.price && vehicle.image) {
                vehicles.push(vehicle);
            }
            
        } catch (error) {
            console.warn(`Erro ao processar linha ${i + 1}:`, error);
        }
    }
    
    return vehicles;
}

// Funções auxiliares (mantidas para fallback)
function parseGallery(galleryString) {
    if (!galleryString) return [];
    return galleryString.split(';').map(url => url.trim()).filter(url => url);
}

function parseFeatures(featuresString) {
    if (!featuresString) return [];
    return featuresString.split(';').map(feature => feature.trim()).filter(feature => feature);
}

function formatPrice(price) {
    if (typeof price === 'string' && price.includes(',')) {
        return price;
    }
    
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    
    return num.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatKM(km) {
    if (!km) return '0';
    
    if (typeof km === 'string' && km.includes('.')) {
        return km;
    }
    
    const num = parseInt(km);
    if (isNaN(num)) return km;
    
    return num.toLocaleString('pt-BR');
}

// Estados de carregamento
function showLoadingState() {
    const loading = document.getElementById('loadingMessage');
    const grid = document.getElementById('modelsGrid');
    const error = document.getElementById('errorMessage');
    
    if (loading) loading.style.display = 'block';
    if (grid) grid.style.display = 'none';
    if (error) error.style.display = 'none';
}

function hideLoadingState() {
    const loading = document.getElementById('loadingMessage');
    const grid = document.getElementById('modelsGrid');
    
    if (loading) loading.style.display = 'none';
    if (grid) grid.style.display = 'grid';
}

function showErrorState() {
    const loading = document.getElementById('loadingMessage');
    const grid = document.getElementById('modelsGrid');
    const error = document.getElementById('errorMessage');
    
    if (loading) loading.style.display = 'none';
    if (grid) grid.style.display = 'none';
    if (error) error.style.display = 'block';
}

// Função para carregar a seção de modelos
async function loadModelsSection() {
    const modelsGrid = document.getElementById('modelsGrid');
    const vehicleSelect = document.getElementById('veiculo');
    
    if (!modelsGrid) return;
    
    showLoadingState();
    
    try {
        const vehicles = await fetchVehiclesFromSheet();
        
        // Limpar grid
        modelsGrid.innerHTML = '';
        
        if (vehicles.length === 0) {
            modelsGrid.innerHTML = `
                <div class="no-vehicles">
                    <i class="fas fa-car"></i>
                    <h3>Nenhum veículo disponível no momento</h3>
                    <p>Volte em breve para conferir nossa seleção.</p>
                </div>
            `;
            return;
        }
        
        // Adicionar modelos ao grid
        vehicles.forEach((model, index) => {
            const modelCard = createModelCard(model, index);
            modelsGrid.appendChild(modelCard);
        });
        
        // Atualizar select do formulário
        updateVehicleSelect(vehicles);
        
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        showErrorState();
    }
}

// Função para atualizar o select do formulário
function updateVehicleSelect(vehicles) {
    const vehicleSelect = document.getElementById('veiculo');
    if (!vehicleSelect) return;
    
    // Limpar opções existentes (exceto a primeira)
    while (vehicleSelect.options.length > 1) {
        vehicleSelect.remove(1);
    }
    
    // Adicionar novos veículos
    vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.id;
        option.textContent = `${vehicle.name} - R$ ${vehicle.price}`;
        vehicleSelect.appendChild(option);
    });
}

// Função para criar card do modelo
function createModelCard(model, index) {
    const card = document.createElement('div');
    card.className = 'model-card';
    
    const hasGallery = model.gallery && model.gallery.length > 0;
    const galleryCount = hasGallery ? model.gallery.length : 0;
    
    card.innerHTML = `
        ${hasGallery ? `
            <div class="gallery-badge">
                <i class="fas fa-images"></i> ${galleryCount} foto${galleryCount > 1 ? 's' : ''}
            </div>
        ` : ''}
        
        <img src="${model.image}" alt="${model.name}" class="model-image" onerror="this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'">
        
        <div class="model-info">
            <h3 class="model-name">${model.name}</h3>
            <div class="model-price">R$ ${model.price}</div>
            
            <div class="model-details">
                <span><i class="fas fa-calendar"></i> ${model.year}</span>
                <span><i class="fas fa-tachometer-alt"></i> ${model.km} km</span>
                ${model.category ? `<span><i class="fas fa-car"></i> ${model.category}</span>` : ''}
            </div>
            
            ${model.features && model.features.length > 0 ? `
                <div class="model-features">
                    ${model.features.map(feature => `<span>${feature}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="model-location">
                <i class="fas fa-map-marker-alt"></i> 
                <a href="https://maps.google.com/?q=Rua+das+Fronteiras+77+Caucaia+CE" target="_blank" class="address-link">${model.location}</a>
            </div>
            
            ${hasGallery ? `
                <div class="view-gallery">
                    <i class="fas fa-expand"></i> Ver Galeria
                </div>
            ` : ''}
            
            <a href="#contato" class="btn btn-interest" data-vehicle="${model.name}" style="margin-top: 15px; display: block; text-align: center;">
                Tenho Interesse
            </a>
        </div>
    `;
    
    // Evento para abrir galeria - apenas no card, não no botão
    if (hasGallery) {
        card.addEventListener('click', (e) => {
            // Não abrir galeria se clicar no botão "Tenho Interesse"
            if (!e.target.closest('.btn-interest')) {
                openGallery(model, index);
            }
        });
    }
    
    return card;
}

// Função para abrir galeria
function openGallery(model, index) {
    currentModelIndex = index;
    currentImageIndex = 0;
    
    const modal = document.getElementById('galleryModal');
    const modalCarName = document.getElementById('modalCarName');
    const mainImage = document.getElementById('mainImage');
    
    modalCarName.textContent = model.name;
    
    currentGalleryImages = model.gallery && model.gallery.length > 0 ? model.gallery : [model.image];
    mainImage.src = currentGalleryImages[0];
    
    loadThumbnails(currentGalleryImages, model.name);
    updateImageCounter();
    updateNavigationButtons();
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Funções da galeria
function loadThumbnails(images, modelName) {
    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';
    
    images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `Foto ${index + 1} do ${modelName}`;
        thumbnail.className = `thumbnail ${index === currentImageIndex ? 'active' : ''}`;
        thumbnail.onclick = () => changeImage(index);
        thumbnail.onerror = function() {
            this.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';
        };
        
        thumbnailsContainer.appendChild(thumbnail);
    });
}

function changeImage(index) {
    currentImageIndex = index;
    const mainImage = document.getElementById('mainImage');
    
    mainImage.src = currentGalleryImages[index];
    updateImageCounter();
    updateThumbnails();
    updateNavigationButtons();
}

function prevImage() {
    if (currentImageIndex > 0) {
        changeImage(currentImageIndex - 1);
    }
}

function nextImage() {
    if (currentImageIndex < currentGalleryImages.length - 1) {
        changeImage(currentImageIndex + 1);
    }
}

function updateImageCounter() {
    const imageCounter = document.getElementById('imageCounter');
    imageCounter.textContent = `${currentImageIndex + 1} / ${currentGalleryImages.length}`;
}

function updateThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentImageIndex === 0;
    nextBtn.disabled = currentImageIndex === currentGalleryImages.length - 1;
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    loadModelsSection();
    
    // Configurar botão de tentar novamente
    const retryButton = document.getElementById('retryButton');
    if (retryButton) {
        retryButton.addEventListener('click', loadModelsSection);
    }
});
=======
﻿// sheets-loader.js - Carrega dados do Google Sheets
console.log('sheets-loader.js carregado');
>>>>>>> a23cc1c99ff3d2c20ba42de4282a8f012b38e4d0
