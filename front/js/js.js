const API_URL = 'https://estacionamentorebecacrislene.vercel.app/veiculos';
const ESTADIAS_URL = 'https://estacionamentorebecacrislene.vercel.app/estadias';

const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

const menuNovos = document.getElementById('menu-novos');
const menuEditar = document.getElementById('menu-editar');
const menuRelatorios = document.getElementById('menu-relatorios');

const editAlert = document.getElementById('edit-alert');
const closeAlert = document.getElementById('close-alert');

const vehicleForm = document.getElementById('vehicle-form');
const vehicleList = document.getElementById('vehicle-list');

// Controle de exibição de seções
const formSection = document.querySelector('.form-container');
const listSection = document.querySelector('.vehicle-list');
const relatorioSection = document.querySelector('.relatorio-estadias'); // ⬅ nova seção

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

// Menu - Novos Veículos
menuNovos.addEventListener('click', (e) => {
  e.preventDefault();
  hideAllSections();
  formSection.style.display = 'block';
  editAlert.classList.add('hidden');
  menu.classList.add('hidden');
});

// Menu - Editar Veículos
menuEditar.addEventListener('click', (e) => {
  e.preventDefault();
  hideAllSections();
  listSection.style.display = 'block';
  editAlert.classList.remove('hidden');
  menu.classList.add('hidden');
});

// Menu - Relatórios de Estadias
menuRelatorios.addEventListener('click', (e) => {
  e.preventDefault();
  hideAllSections();
  relatorioSection.style.display = 'block';
  editAlert.classList.add('hidden');
  menu.classList.add('hidden');
  fetchRelatorioEstadias(); // ⬅ chamada para relatório
});

// Esconder todas as seções
function hideAllSections() {
  formSection.style.display = 'none';
  listSection.style.display = 'none';
  relatorioSection.style.display = 'none';
  editAlert.classList.add('hidden');
}

// Carrega os veículos ao iniciar
window.onload = () => {
  hideAllSections();
  formSection.style.display = 'block';
  fetchVehicles();
};

// Buscar veículos (GET)
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

// Renderizar os veículos
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

    card.querySelector('.edit-btn').addEventListener('click', () => {
      editMode = true;
      editingPlaca = vehicle.placa;
      fillForm(vehicle);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      editAlert.classList.add('hidden');
      hideAllSections();
      formSection.style.display = 'block';
    });

    card.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm(`Deseja realmente excluir o veículo da placa ${vehicle.placa}?`)) {
        deleteVehicle(vehicle.placa);
      }
    });

    vehicleList.appendChild(card);
  });
}

// Preencher formulário com dados do veículo
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

// Submissão do formulário
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

    hideAllSections();
    listSection.style.display = 'block';
    fetchVehicles();

  } catch (error) {
    console.error('Erro ao salvar veículo:', error);
  }
});

// Excluir veículo
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

function fetchRelatorioEstadias() {
  fetch(ESTADIAS_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'insomnia/11.5.0'
    }
  })
    .then(res => res.json())
    .then(estadias => {
      const container = document.getElementById('relatorio-container');
      container.innerHTML = '';

      if (estadias.length === 0) {
        container.innerHTML = '<p>Nenhuma estadia registrada.</p>';
        return;
      }

      estadias.forEach(estadia => {
        const card = document.createElement('div');
        card.classList.add('relatorio-card');

        const entrada = new Date(estadia.entrada);
        const saida = estadia.saida ? new Date(estadia.saida) : null;
        const agora = new Date();
        const fim = saida || agora;

        const horas = Math.floor((fim - entrada) / (1000 * 60 * 60));

        card.innerHTML = `
          <h3>Placa: ${estadia.placa}</h3>
          <p><strong>Entrada:</strong> ${entrada.toLocaleString()}</p>
          <p><strong>Saída:</strong> ${saida ? saida.toLocaleString() : 'Ainda no estacionamento'}</p>
          <p><strong>Tempo de estadia:</strong> ${horas} hora(s)</p>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Erro ao buscar estadias:', err);
      const container = document.getElementById('relatorio-container');
      container.innerHTML = '<p>Erro ao carregar relatório de estadias.</p>';
    });
}

const estadiaForm = document.getElementById('estadia-form');

estadiaForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const entradaRaw = document.getElementById('estadia-entrada').value;
  const saidaRaw = document.getElementById('estadia-saida').value;

  const novaEstadia = {
    placa: document.getElementById('estadia-placa').value.trim(),
    entrada: new Date(entradaRaw).toISOString(),
    saida: saidaRaw ? new Date(saidaRaw).toISOString() : null,
    valorHora: 10
  };

  try {
    const response = await fetch(ESTADIAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/11.5.0'
      },
      body: JSON.stringify(novaEstadia)
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`Erro ao registrar estadia: ${msg}`);
    }

    estadiaForm.reset();
    fetchRelatorioEstadias();
  } catch (error) {
    console.error('Erro ao enviar estadia:', error);
  }
});
