const API_URL = 'https://estacionamentorebecacrislene.vercel.app/veiculos';

const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
hamburger.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

const vehicleForm = document.getElementById('vehicle-form');
const vehicleList = document.getElementById('vehicle-list');

// Editar controle
let editMode = false;
let editingPlaca = null;

// Carrega os veículos ao iniciar
window.onload = () => {
  fetchVehicles();
};

// Buscar todos os veículos (GET)
async function fetchVehicles() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/11.5.0'
      }
    });
    const data = await response.json();
    renderVehicles(data);
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
  }
}

// Renderizar os veículos no HTML
function renderVehicles(vehicles) {
  vehicleList.innerHTML = '';

  if (vehicles.length === 0) {
    vehicleList.innerHTML = '<p>Nenhum veículo cadastrado.</p>';
    return;
  }

  vehicles.forEach(vehicle => {
    const card = document.createElement('div');
    card.classList.add('vehicle-card');

    card.innerHTML = `
      <h3>${vehicle.marca} ${vehicle.modelo}</h3>
      <p><strong>Proprietário:</strong> ${vehicle.proprietario}</p>
      <p><strong>Placa:</strong> ${vehicle.placa}</p>
      <p><strong>Tipo:</strong> ${vehicle.tipo}</p>
      <p><strong>Cor:</strong> ${vehicle.cor}</p>
      <p><strong>Ano:</strong> ${vehicle.ano}</p>
      <p><strong>Telefone:</strong> ${vehicle.telefone}</p>
      <button class="edit-btn">Editar</button>
      <button class="delete-btn">Excluir</button>
    `;

    // Botão Editar
    card.querySelector('.edit-btn').addEventListener('click', () => {
      editMode = true;
      editingPlaca = vehicle.placa;
      fillForm(vehicle);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Botão Excluir
    card.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm(`Deseja realmente excluir o veículo da placa ${vehicle.placa}?`)) {
        deleteVehicle(vehicle.placa);
      }
    });

    vehicleList.appendChild(card);
  });
}

// Preencher o formulário com os dados para edição
function fillForm(vehicle) {
  vehicleForm['owner-name'].value = vehicle.proprietario;
  vehicleForm['vehicle-type'].value = vehicle.tipo;
  vehicleForm['license-plate'].value = vehicle.placa;
  vehicleForm['vehicle-model'].value = vehicle.modelo;
  vehicleForm['phone'].value = vehicle.telefone;
  vehicleForm['ano'].value = vehicle.ano;
  vehicleForm['color'].value = vehicle.cor;
}

// Submissão do formulário (POST ou PUT)
vehicleForm.addEventListener('submit', async (e) => {
  e.preventDefault();
const novoVeiculo = {
  proprietario: vehicleForm['owner-name'].value.trim(),
  tipo: vehicleForm['vehicle-type'].value.trim().toUpperCase(), // <-- CORRIGIDO
  placa: vehicleForm['license-plate'].value.trim(),
  modelo: vehicleForm['vehicle-model'].value.trim(),
  telefone: vehicleForm['phone'].value.trim(),
  ano: parseInt(vehicleForm['ano'].value),
  cor: vehicleForm['color'].value.trim(),
  marca: vehicleForm['vehicle-brand'].value.trim()
};


  try {
    const method = editMode ? 'PATCH' : 'POST';
    const url = editMode ? `${API_URL}/${editingPlaca}` : API_URL;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/11.5.0'
      },
      body: JSON.stringify(novoVeiculo)
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`Erro na API: ${msg}`);
    }

    vehicleForm.reset();
    editMode = false;
    editingPlaca = null;
    fetchVehicles();
  } catch (error) {
    console.error('Erro ao salvar veículo:', error);
  }
});

// Deletar veículo (DELETE)
async function deleteVehicle(placa) {
  try {
    const response = await fetch(`${API_URL}/${placa}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/11.5.0'
      }
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`Erro ao deletar: ${msg}`);
    }

    fetchVehicles();
  } catch (error) {
    console.error(error);
  }
}
