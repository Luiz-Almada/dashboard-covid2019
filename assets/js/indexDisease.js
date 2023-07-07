import { formatDate } from '../../Utils/funcoes.js';

let confirm = document.getElementById('confirmed');
let death = document.getElementById('death');
let recovered = document.getElementById('recovered');
let date = document.getElementById('date');

let resSummaries;
let resGlobal;
let summarySorted;
let summaryTop10;

let newConfirmed;
let newDeaths;
let newRecovered;

const image = new Image(15, 15);

(async () => {
  resSummaries = await (await fetch("data/diseaseCountries.json")).json();
  resGlobal = await (await fetch("data/diseaseAll.json")).json();

  // atribui o total de confirmados ao elemento 'confirmed'.
  confirm.textContent = resGlobal.cases.toLocaleString('pt-BR');
  newConfirmed = resGlobal.todayCases.toLocaleString('pt-BR');
  // atribui o total de mortes ao elemento 'death'.
  death.textContent = resGlobal.deaths.toLocaleString('pt-BR');
  newDeaths = resGlobal.todayDeaths.toLocaleString('pt-BR');
  // atribui o total de recuperados ao elemento 'recovered'.
  recovered.textContent = resGlobal.recovered.toLocaleString('pt-BR');
  newRecovered = resGlobal.todayRecovered.toLocaleString('pt-BR');
  
  // atribui a data de atualização ao elemento 'date'.
  date.textContent +=  " " + formatDate(resGlobal.updated);

  gerarGraficoPizza();
  ordenarSumario();
  summaryTop10 = summarySorted.slice(0, 10);
  gerarGraficoBarra();
})();

  // Função de comparação para ordenar os países por TotalDeaths em ordem decrescente
  function compareTotalDeaths(a, b) {
    return b.deaths - a.deaths;
  }

function ordenarSumario(){
  // Ordenar os países em ordem decrescente com base no número total de mortes (TotalDeaths)
  summarySorted = resSummaries.sort(compareTotalDeaths);
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
  const countryArray = summaryTop10.map(item => item.country);
  const totalDeaths = summaryTop10.map(item => item.deaths);  

  //const image = new Image(15, 15);
  // const imagePath = summaryTop10.map(item => item.countryInfo.flag);
  // image.src = imagePath[value.dataIndex];   
  //image.src = summaryTop10.map(item => item.countryInfo.flag);   

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
        },
        tooltip: {
          usePointStyle: true,
          callbacks: {
            labelPointStyle: (context) => {
              // const image = new Image(15, 15);
              // const imagePath = summaryTop10.map(item => item.countryInfo.flag)
              // image.src = imagePath[context.dataIndex]
              image.src = '/assets/img/flags/' + summaryTop10[context.dataIndex].countryInfo.iso2 + '.png'
              return {
                pointStyle: image
              }
            }
          }
        }
      }
    }
  }); 
}