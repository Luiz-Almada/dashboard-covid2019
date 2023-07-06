let confirm = document.getElementById('confirmed');
let death = document.getElementById('death');
let recovered = document.getElementById('recovered');
let date = document.getElementById('date');

let resSummaries;
let summarySorted;
let summaryTop10;

let newConfirmed;
let newDeaths;
let newRecovered;

(async () => {
  //resSummaries = await (await fetch("http://localhost:3001/global")).json()
  resSummaries = await (await fetch("data/summary.json")).json();

  //console.log(resSummaries.Global);

  // atribui o total de confirmados ao elemento 'confirmed'.
  confirm.textContent = resSummaries.Global.TotalConfirmed.toLocaleString('pt-BR');
  newConfirmed = resSummaries.Global.NewConfirmed.toLocaleString('pt-BR');
  
  // atribui o total de mortes ao elemento 'death'.
  death.textContent = resSummaries.Global.TotalDeaths.toLocaleString('pt-BR');
  newDeaths = resSummaries.Global.NewDeaths.toLocaleString('pt-BR');
  
  // atribui o total de recuperados ao elemento 'recovered'.
  recovered.textContent = resSummaries.Global.TotalRecovered.toLocaleString('pt-BR');
  newRecovered = resSummaries.Global.NewRecovered.toLocaleString('pt-BR');
  
  // atribui a data de atualização ao elemento 'date'.
  date.textContent +=  " " + formatDate(resSummaries.Global.Date);

  gerarGraficoPizza();
  ordenarSumario();
  summaryTop10 = summarySorted.slice(0, 10);
  gerarGraficoBarra();
})();



  // Função de comparação para ordenar os países por TotalDeaths em ordem decrescente
  function compareTotalDeaths(a, b) {
    return b.TotalDeaths - a.TotalDeaths;
  }

function ordenarSumario(){
  // Ordenar os países em ordem decrescente com base no número total de mortes (TotalDeaths)
  summarySorted = resSummaries.Countries.sort(compareTotalDeaths);
  // Imprimir os países ordenados
  //resSummaries.Countries.forEach(country => {
  //  console.log(country.Country, country.TotalDeaths);
  //});
}

function gerarGraficoPizza(){
  let pizza = new Chart(document.getElementById("pizza"), {
    type: 'pie',
    data: {
      //nomes
      labels: ['Confirmados', 'Recuperados', 'Mortes'],
      datasets: [
        {
          //valores
          data: [
            // Object.values(resSummaries.Global)[0].toLocaleString('pt-BR'), 
            // Object.values(resSummaries.Global)[4].toLocaleString('pt-BR'), 
            // Object.values(resSummaries.Global)[2].toLocaleString('pt-BR'), 
          
            newConfirmed,
            newDeaths,
            newRecovered
          ],
          backgroundColor: ["#FF6384", "#FFDF94","#36A2EB"]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Distribuição de novos casos'
        }
      }
    }
  });
}

function gerarGraficoBarra(){
  const countryArray = summaryTop10.map(item => item.Country);
  const totalDeaths = summaryTop10.map(item => item.TotalDeaths);  

  let bar = new Chart(document.getElementById("barras"), {
    type: 'bar',
    data: {
      //nomes
      labels: countryArray,
      datasets: [
        {
          //valores
          data: totalDeaths,
          backgroundColor: "#9966FF"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'none'
        },
        title: {
          display: true,  
          text: 'Total de Mortes por país - Top 10'
        }
      }
    }
  }); 
}

function formatDate(dateSource) {
  //Formata a data
  let date = new Date(dateSource); // recebe a data a ser formatada

  let day = date.getDate(); // Obtém o dia do mês
  let month = date.getMonth() + 1; // Obtém o mês (os meses são indexados a partir de 0)
  let year = date.getFullYear(); // Obtém o ano
  let hour = date.getHours(); //Obtém a hora
  let minute = date.getMinutes(); //Obtém o minuto

  // Formata a data no formato dd.mm.aaaa hh:mm
  let dateFormatted = day.toString().padStart(2, '0') + '.' + 
                      month.toString().padStart(2, '0') + '.'+ 
                      year + ' ' + 
                      hour + ':' + 
                      minute.toString().padStart(2, '0');

  return dateFormatted;
};