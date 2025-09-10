const API_URL = 'https://estacionamentorebecacrislene.vercel.app/veiculos';

const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

const menuNovos = document.getElementById('menu-novos');
const menuEditar = document.getElementById('menu-editar');
const menuRelatorios = document.getElementById('menu-relatorios');

const editAlert = document.getElementById('edit-alert');
const closeAlert = document.getElementById('close-alert');

const vehicleForm = document.getElementById('vehicle-form');
const vehicleList = document.getElementById('vehicle-list');

// Controle de exibição de seções (caso queira implementar navegação)
const formSection = document.querySelector('.form-container');
const listSection = document.querySelector('.vehicle-list');

// Editar controle
let editMode = false;
let editingPlaca = null;

// Mostrar/esconder menu hamburger
hamburger.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

// Botão Fechar alerta de edição
closeAlert.addEventListener('click', () => {
  editAlert.classList.add('hidden');
});

// Menu - Novos Veículos (exemplo: mostra form)
menuNovos.addEventListener('click', (e) => {
  e.preventDefault();
  hideAllSections();
  formSection.style.display = 'block';
  editAlert.classList.add('hidden');
  menu.classList.add('hidden');
});

// Menu - Editar Veículos (mostrar alerta)
menuEditar.addEventListener('click', (e) => {
  e.preventDefault();
  hideAllSections();
  listSection.style.display = 'block';
  editAlert.classList.remove('hidden');
  menu.classList.add('hidden');

  // Se quiser, pode esconder automaticamente depois de 5 segundos:
  // setTimeout(() => editAlert.classList.add('hidden'), 5000);
});

// Menu - Relatórios de Estadias (aqui só esconde tudo para exemplo)
menuRelatorios.addEventListener('click', (e) => {
  e.preventDefault();
  hideAllSections();
  editAlert.classList.add('hidden');
  menu.classList.add('hidden');
  // Coloque aqui o código para mostrar relatório se tiver
});

// Função para esconder tudo antes de mostrar algo
function hideAllSections() {
  formSection.style.display = 'none';
  listSection.style.display = 'none';
  editAlert.classList.add('hidden');
}

// Carrega os veículos ao iniciar
window.onload = () => {
  hideAllSections();
  formSection.style.display = 'block';
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
      <p><strong>Marca:</strong> ${vehicle.marca}</p>
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
      editAlert.classList.add('hidden'); // Oculta alerta se estiver aberto
      hideAllSections();
      formSection.style.display = 'block';
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
  vehicleForm['vehicle-brand'].value = vehicle.marca;
}

// Submissão do formulário (POST ou PATCH)
vehicleForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const novoVeiculo = {
    proprietario: vehicleForm['owner-name'].value.trim(),
    tipo: vehicleForm['vehicle-type'].value.trim().toUpperCase(),
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

// Mostrar os cards após cadastro
hideAllSections();
listSection.style.display = 'block';
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
