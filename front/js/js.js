const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

hamburger.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});
// Lista inicial de veículos
var vehicles = [
  { id: 1, marca: 'Fiat', modelo: 'Uno', ano: 2020, cor: 'Vermelho' },
  { id: 2, marca: 'Volkswagen', modelo: 'Gol', ano: 2019, cor: 'Azul' }
];

// Próximo id para novos veículos
var nextId = 3;

// Variáveis para controle de edição
var editMode = false;
var editingId = null;

// Pega elementos do DOM
var menuToggle = document.getElementById('menu-toggle');
var menuOverlay = document.getElementById('menu-overlay');
var addFormSection = document.getElementById('add-form');
var vehicleForm = document.getElementById('vehicle-form');
var vehicleList = document.getElementById('vehicle-list');


// Mostra o formulário para adicionar veículo
function showAddForm() {
  addFormSection.classList.add('open');
  menuOverlay.classList.remove('open');
  menuToggle.classList.remove('open');
  editMode = false;
  editingId = null;
  vehicleForm.reset();
}

// Ativa o modo edição
function enableEditMode() {
  editMode = true;
  alert('Modo de edição ativado. Clique em "Editar" em um veículo.');
  menuOverlay.classList.remove('open');
  menuToggle.classList.remove('open');
}

// Limpa a lista de veículos
function clearAll() {
  vehicles = [];
  renderVehicles();
  menuOverlay.classList.remove('open');
  menuToggle.classList.remove('open');
}

// Quando o formulário for enviado
vehicleForm.addEventListener('submit', function(event) {
  event.preventDefault();

  var marca = vehicleForm.marca.value.trim();
  var modelo = vehicleForm.modelo.value.trim();
  var ano = parseInt(vehicleForm.ano.value);
  var cor = vehicleForm.cor.value.trim();

  if (editMode && editingId !== null) {
    // Atualiza veículo existente
    for (var i = 0; i < vehicles.length; i++) {
      if (vehicles[i].id === editingId) {
        vehicles[i].marca = marca;
        vehicles[i].modelo = modelo;
        vehicles[i].ano = ano;
        vehicles[i].cor = cor;
        break;
      }
    }
  } else {
    // Adiciona novo veículo
    vehicles.push({
      id: nextId,
      marca: marca,
      modelo: modelo,
      ano: ano,
      cor: cor
    });
    nextId++;
  }

  renderVehicles();
  vehicleForm.reset();
  addFormSection.classList.remove('open');
  editMode = false;
  editingId = null;
});

// Função para renderizar a lista de veículos
function renderVehicles() {
  vehicleList.innerHTML = '';

  if (vehicles.length === 0) {
    vehicleList.innerHTML = '<p class="text-center text-gray-500">Nenhum veículo cadastrado.</p>';
    return;
  }

  for (var i = 0; i < vehicles.length; i++) {
    var vehicle = vehicles[i];

    var card = document.createElement('div');
    card.className = 'vehicle-card';

    var img = document.createElement('img');
    img.src = 'https://placehold.co/300x200/' + vehicle.cor.toLowerCase() + '/white?text=Veículo';
    img.alt = 'Imagem ilustrativa de um veículo ' + vehicle.cor;
    img.className = 'vehicle-image';

    var title = document.createElement('h4');
    title.className = 'vehicle-title';
    title.textContent = vehicle.marca + ' ' + vehicle.modelo;

    var info = document.createElement('p');
    info.className = 'vehicle-info';
    info.textContent = 'Ano: ' + vehicle.ano + ' | Cor: ' + vehicle.cor;

    var btnContainer = document.createElement('div');
    btnContainer.className = 'button-container';

    var editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'edit-btn btn';

    editBtn.addEventListener('click', (function(v) {
      return function() {
        vehicleForm.marca.value = v.marca;
        vehicleForm.modelo.value = v.modelo;
        vehicleForm.ano.value = v.ano;
        vehicleForm.cor.value = v.cor;
        editingId = v.id;
        editMode = true;
        addFormSection.classList.add('open');
        window.scrollTo(0, 0);
      };
    })(vehicle));

    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Excluir';
    deleteBtn.className = 'delete-btn btn';

    deleteBtn.addEventListener('click', (function(id) {
      return function() {
        vehicles = vehicles.filter(function(v) {
          return v.id !== id;
        });
        renderVehicles();
      };
    })(vehicle.id));

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(info);
    card.appendChild(btnContainer);

    vehicleList.appendChild(card);
  }
}

// Renderiza a lista inicial ao carregar a página
renderVehicles();
