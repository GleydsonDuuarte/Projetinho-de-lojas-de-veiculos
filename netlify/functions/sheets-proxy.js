<<<<<<< HEAD
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Configuração de CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Responder a requisições OPTIONS (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // ID da sua planilha
  const SHEET_ID = '1oLi9rBgMJmQxnluvO65RypDo6nD3zUxWDSdN6eQJoTs';
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

  try {
    console.log('Fetching data from Google Sheets...');
    
    const response = await fetch(SHEET_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    
    // Processar resposta do Google Sheets
    const jsonData = JSON.parse(text.substring(47).slice(0, -2));
    
    // Estruturar os dados
    const vehicles = parseSheetData(jsonData);
    
    console.log(`Successfully loaded ${vehicles.length} vehicles`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: vehicles,
        count: vehicles.length,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Erro ao carregar dados da planilha',
        message: error.message
      })
    };
  }
};

// Função para processar os dados da planilha
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

// Funções auxiliares
function parseGallery(galleryString) {
  if (!galleryString) return [];
  return galleryString.split(';').map(url => url.trim()).filter(url => url);
}

function parseFeatures(featuresString) {
  if (!featuresString) return [];
  return featuresString.split(';').map(feature => feature.trim()).filter(feature => feature);
}

function formatPrice(price) {
  // Se já estiver formatado, manter
  if (typeof price === 'string' && price.includes(',')) {
    return price;
  }
  
  // Converter número para formato brasileiro
  const num = parseFloat(price);
  if (isNaN(num)) return price;
  
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatKM(km) {
  if (!km) return '0';
  
  // Se já estiver formatado, manter
  if (typeof km === 'string' && km.includes('.')) {
    return km;
  }
  
  // Converter número para formato brasileiro
  const num = parseInt(km);
  if (isNaN(num)) return km;
  
  return num.toLocaleString('pt-BR');
}
=======
﻿// sheets-proxy.js - Netlify Function
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Function funcionando' })
    };
};
>>>>>>> a23cc1c99ff3d2c20ba42de4282a8f012b38e4d0
