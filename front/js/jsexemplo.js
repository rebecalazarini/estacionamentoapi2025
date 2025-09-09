var receitas = [];
const api = 'https://estacionamentorebecacrislene.vercel.app/veiculos';
const main = document.querySelector('main');

function listarVeiculos() {
    const options = {
        method: 'GET',
        headers: { 'user-Agent':'insomnia/2024.6.2'}
    };
}
fetch(api, options)
    .then(response => response.json())
    .then(response => estacionamento = response)
    .then(() => mostrarVeiculos())
    .catch(err => console.error(err));

    function mostrarVeiculos() {
        listarVeiculos.forEach(veiculo => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h3>${veiculo.marca} ${veiculo.modelo}</h3>
                <p>Ano: ${veiculo.ano}</p>
                <p>Cor: ${veiculo.cor}</p>
            `;
            main.appendChild(card);
        });
    }

listarVeiculos();



















document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('vehicle-form');
  const vehicleList = document.getElementById('vehicle-list');
  
  const apiUrl = "https://estacionamentorebecacrislene.vercel.app/veiculos"; // Coloque a URL correta da sua API

  // Função para pegar e exibir os veículos
  const fetchVehicles = () => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        vehicleList.innerHTML = ''; // Limpa a lista antes de adicionar os novos veículos
        data.forEach(vehicle => {
          const vehicleCard = document.createElement('div');
          vehicleCard.classList.add('vehicle-card');
          
          vehicleCard.innerHTML = `
            <h4>${vehicle.owner_name} - ${vehicle.vehicle_type}</h4>
            <p>Placa: ${vehicle.license_plate}</p>
            <p>Modelo: ${vehicle.vehicle_model}</p>
            <p>Telefone: ${vehicle.phone}</p>
            <p>Ano: ${vehicle.year}</p>
            <p>Cor: ${vehicle.color}</p>
          `;
          vehicleList.appendChild(vehicleCard);
        });
      })
      .catch(error => {
        console.error("Erro ao carregar os veículos:", error);
      });
  };

  // Chama a função para exibir os veículos logo que a página carregar
  fetchVehicles();

  // Função para enviar os dados do formulário via POST
  const submitForm = (event) => {
    event.preventDefault(); // Previne o comportamento padrão do form

    const formData = new FormData(form);
    const data = {
      owner_name: formData.get('owner-name'),
      vehicle_type: formData.get('vehicle-type'),
      license_plate: formData.get('license-plate'),
      vehicle_model: formData.get('vehicle-model'),
      phone: formData.get('phone'),
      year: formData.get('ano'),
      color: formData.get('color')
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao cadastrar veículo');
        }
        return response.json();
      })
      .then(responseData => {
        console.log('Veículo cadastrado com sucesso!', responseData);
        fetchVehicles(); // Atualiza a lista de veículos após o cadastro
        form.reset(); // Limpa o formulário
      })
      .catch(error => {
        console.error("Erro ao cadastrar o veículo:", error);
      });
  };

  form.addEventListener('submit', submitForm);
});
