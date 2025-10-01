// Variáveis globais para a galeria
let currentModelIndex = 0;
let currentImageIndex = 0;

// Função para carregar os veículos
function loadVehicles() {
    const vehicleGrid = document.getElementById('vehicle-grid');
    const vehicleSelect = document.getElementById('veiculo');
    
    // Limpar grid
    vehicleGrid.innerHTML = '';
    
    // Adicionar veículos ao grid
    vehiclesData.forEach(vehicle => {
        const vehicleCard = createVehicleCard(vehicle);
        vehicleGrid.appendChild(vehicleCard);
        
        // Adicionar opção ao select
        const option = document.createElement('option');
        option.value = vehicle.id;
        option.textContent = `${vehicle.name} - R$ ${vehicle.price}`;
        vehicleSelect.appendChild(option);
    });
}

// Função para criar card de veículo
function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    
    card.innerHTML = `
        <div class="vehicle-image" style="background-image: url('${vehicle.image}')"></div>
        <div class="vehicle-info">
            <h3>${vehicle.name}</h3>
            <div class="vehicle-price">R$ ${vehicle.price}</div>
            <div class="vehicle-details">
                <span><i class="fas fa-calendar"></i> ${vehicle.year}</span>
                <span><i class="fas fa-tachometer-alt"></i> ${vehicle.km} km</span>
                ${vehicle.features ? `<span><i class="fas fa-car"></i> ${vehicle.features.join(', ')}</span>` : ''}
            </div>
            <div class="vehicle-location">
                <i class="fas fa-map-marker-alt"></i> ${vehicle.location}
            </div>
            <a href="#contato" class="btn" data-vehicle="${vehicle.name}">Tenho Interesse</a>
        </div>
    `;
    
    return card;
}

// Função para carregar a seção de modelos
function loadModelsSection() {
    const modelsGrid = document.getElementById('modelsGrid');
    
    vehiclesData.forEach((model, index) => {
        const modelCard = createModelCard(model, index);
        modelsGrid.appendChild(modelCard);
    });
}

// Função para criar card do modelo na seção de modelos
function createModelCard(model, index) {
    const card = document.createElement('div');
    card.className = 'model-card';
    card.onclick = () => openGallery(index);
    
    card.innerHTML = `
        <div class="gallery-badge">
            <i class="fas fa-images"></i> ${model.gallery ? model.gallery.length : '0'} fotos
        </div>
        <img src="${model.image}" alt="${model.name}" class="model-image">
        <div class="model-info">
            <h3 class="model-name">${model.name}</h3>
            <div class="model-price">R$ ${model.price}</div>
            <div class="model-details">
                <span>${model.year} • ${model.km} km</span>
            </div>
            <div class="view-gallery">
                <i class="fas fa-expand"></i> Ver Galeria
            </div>
        </div>
    `;
    
    return card;
}

// Funções da Galeria
function openGallery(modelIndex) {
    currentModelIndex = modelIndex;
    currentImageIndex = 0;
    
    const model = vehiclesData[modelIndex];
    const modal = document.getElementById('galleryModal');
    const modalCarName = document.getElementById('modalCarName');
    const mainImage = document.getElementById('mainImage');
    
    modalCarName.textContent = model.name;
    mainImage.src = model.gallery ? model.gallery[0] : model.image;
    
    loadThumbnails(model);
    updateImageCounter();
    updateNavigationButtons();
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    const modal = document.getElementById('galleryModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function loadThumbnails(model) {
    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';
    
    const images = model.gallery || [model.image];
    
    images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `Foto ${index + 1} do ${model.name}`;
        thumbnail.className = `thumbnail ${index === currentImageIndex ? 'active' : ''}`;
        thumbnail.onclick = () => changeImage(index);
        
        thumbnailsContainer.appendChild(thumbnail);
    });
}

function changeImage(index) {
    currentImageIndex = index;
    const model = vehiclesData[currentModelIndex];
    const mainImage = document.getElementById('mainImage');
    const images = model.gallery || [model.image];
    
    mainImage.src = images[index];
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
    const model = vehiclesData[currentModelIndex];
    const images = model.gallery || [model.image];
    if (currentImageIndex < images.length - 1) {
        changeImage(currentImageIndex + 1);
    }
}

function updateImageCounter() {
    const model = vehiclesData[currentModelIndex];
    const images = model.gallery || [model.image];
    const imageCounter = document.getElementById('imageCounter');
    imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
}

function updateThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
}

function updateNavigationButtons() {
    const model = vehiclesData[currentModelIndex];
    const images = model.gallery || [model.image];
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentImageIndex === 0;
    nextBtn.disabled = currentImageIndex === images.length - 1;
}

function setupGalleryEvents() {
    const modal = document.getElementById('galleryModal');
    const closeBtn = document.getElementById('closeModal');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Fechar modal
    closeBtn.onclick = closeGallery;
    
    // Fechar ao clicar fora
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeGallery();
        }
    };
    
    // Navegação
    prevBtn.onclick = prevImage;
    nextBtn.onclick = nextImage;
    
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        }
    });
}

// Função para inicializar o site
function init() {
    // Carregar veículos
    loadVehicles();
    
    // Carregar seção de modelos
    loadModelsSection();
    
    // Configurar eventos da galeria
    setupGalleryEvents();
    
    // Menu Mobile
    document.querySelector('.mobile-menu').addEventListener('click', function() {
        document.querySelector('nav ul').classList.toggle('show');
    });
    
    // Formulário de Contato
    document.getElementById('form-contato').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            nome: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            veiculo: document.getElementById('veiculo').value,
            mensagem: document.getElementById('mensagem').value
        };
        
        // Aqui você pode enviar os dados para um servidor
        console.log('Dados do formulário:', formData);
        
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        this.reset();
    });
    
    // Navegação suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                document.querySelector('nav ul').classList.remove('show');
            }
        });
    });
    
    // Preencher automaticamente o campo de veículo quando clicar em "Tenho Interesse"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') && e.target.hasAttribute('data-vehicle')) {
            const vehicleName = e.target.getAttribute('data-vehicle');
            const select = document.getElementById('veiculo');
            
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].textContent.includes(vehicleName)) {
                    select.selectedIndex = i;
                    break;
                }
            }
            
            // Rolar até o formulário
            document.getElementById('contato').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);