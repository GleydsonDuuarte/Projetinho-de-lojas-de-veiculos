<<<<<<< HEAD
// Configurações iniciais e funções de UI
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
        const modal = document.getElementById('galleryModal');
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        }
    });
}

function closeGallery() {
    const modal = document.getElementById('galleryModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Configuração do formulário Netlify
function setupForm() {
    const form = document.querySelector('form[name="contato"]');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Validação básica
            const nome = document.getElementById('nome').value;
            const telefone = document.getElementById('telefone').value;
            
            if (!nome || !telefone) {
                e.preventDefault();
                alert('Por favor, preencha pelo menos o nome e telefone.');
                return;
            }
            
            console.log('Formulário sendo enviado para Netlify...');
        });
    }
}

// Função para inicializar o site
function init() {
    // Configurar eventos da galeria
    setupGalleryEvents();
    
    // Configurar formulário
    setupForm();
    
    // Menu Mobile
    document.querySelector('.mobile-menu').addEventListener('click', function() {
        document.querySelector('nav ul').classList.toggle('show');
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
    
    // Atualizar ano atual e anos de tradição
    updateFooterInfo();
}

// Função para atualizar informações do rodapé
function updateFooterInfo() {
    // Atualiza o ano atual no rodapé
    document.getElementById("year").textContent = new Date().getFullYear();

    // Calcula anos de tradição
    const anoAtual = new Date().getFullYear();
    const anosTradicao = anoAtual - 1999;

    // Atualiza em todos os locais
    const ids = [
        "anos-tradicao-hero",
        "anos-tradicao-sobre",
        "anos-tradicao-contato",
        "anos-tradicao-footer",
        "anos-tradicao-footer-text"
    ];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = anosTradicao;
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);
=======
﻿// scripts.js - Funcionalidades do site
console.log('scripts.js carregado');
>>>>>>> a23cc1c99ff3d2c20ba42de4282a8f012b38e4d0
