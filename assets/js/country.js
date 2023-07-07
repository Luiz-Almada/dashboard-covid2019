import { formatDate } from '../../Utils/funcoes.js';

let json;
let jsonDiseaseHistoricalAll;
let canvasLinhas = null; 
let cmbData;
let country;

//async function carregarJsonAsync() {  // outra Sintaxy
async function carregarJsonAsync() {
    //let resAll = await fetch("http://localhost:3001/all", {method: 'GET', redirect: 'follow'})

    // jsonDiseaseHistoricalAll = await (await fetch('data/diseaseHistoricalAll.json', { mode: 'no-cors' })).json();
    jsonDiseaseHistoricalAll = await (await fetch('https://disease.sh/v3/covid-19/historical')).json();
    
    carregarCombos();

    const country = document.getElementById("cmbCountry").options[document.getElementById("cmbCountry").selectedIndex].value

    json = await (await fetch(`https://disease.sh/v3/covid-19/historical/${country}/?lastdays=all`)).json();

    aplicarFiltroDeDatas();
    criarGraficoLinhas();
    carregarDados(json);
};

criarEventosDom();
carregarJsonAsync();

function carregarCombos(){
  const cmbCountry = document.getElementById("cmbCountry");
  if(cmbCountry.length == 0) {
    const setPais = Array.from(    new Set(jsonDiseaseHistoricalAll.map((item) => item.country))   );
    preencherSelectComDadosSet("cmbCountry", setPais);
  }

}


function criarEventosDom(){
  document.getElementById("cmbCountry").addEventListener("change", (e) => {
    carregarJsonAsync();
    // carregarDados();
  });

  document.getElementById("cmbData").addEventListener("change", (e) => {
    carregarJsonAsync();
    // carregarDados();
  });

  document.getElementById("filtro").addEventListener("click", (e) => {
    carregarJsonAsync();
    // carregarDados();
  });

  document.getElementById("date_start").addEventListener("change", (e) => {
    carregarJsonAsync();
    // carregarDados();
  });

  document.getElementById("date_end").addEventListener("change", (e) => {
    carregarJsonAsync();
    // carregarDados();
  });
}

function carregarDados() {
  getTotaisKPIs(json);
}


function getTotaisKPIs(result) {
  let kpiconfirmed = document.getElementById("kpiconfirmed");
  let kpideaths = document.getElementById("kpideaths");
  let kpirecovered = document.getElementById("kpirecovered");

  kpiconfirmed.textContent = getTotalItens(result.timeline.cases).toLocaleString("pt-BR");
  kpideaths.textContent = getTotalItens(result.timeline.deaths).toLocaleString("pt-BR");
  kpirecovered.textContent = getTotalItens(result.timeline.recovered).toLocaleString("pt-BR");
}

function getTotalItens(data) {
  const cmbCountry = document.getElementById("cmbCountry");

  // Converter o objeto em um array de pares chave-valor
  const arrayDados = Object.entries(data);

  // Ordenar o array com base nas chaves (datas)
  //arrayDados.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  arrayDados.sort((a, b) => new Date(b[0]) - new Date(a[0]));

  // Reconstruir o objeto com base no array ordenado
  //const dadosOrdenados = Object.fromEntries(arrayDados);

  const valorMaiorData = arrayDados[0][1];
  return valorMaiorData;
}

function preencherSelectComDadosSet(idCombo, setDataCombo) {
  let arrayOrdenado = Array.from(setDataCombo).sort();

  let select = document.getElementById(idCombo);
  //Preenche o select (combo)
  for (let item of arrayOrdenado) {
    if (item != null)
      select.innerHTML += `<option value="${item}">${item}</option>`;
  }

  //Seta o valor default (Brazil)
  let valorPadrao = "Brazil"; // Defina o valor padrão que você deseja
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === valorPadrao) {
      select.selectedIndex = i;
      break;
    }
  }
};

function criarGraficoLinhas(){

  //Tipo de dados
  // cmbData = document.getElementById("cmbData").options[document.getElementById("cmbData").selectedIndex].value.toLowerCase();
  const elemSelecionado = document.getElementById("cmbData");
  const opcaoSelecionada = elemSelecionado.selectedOptions[0];
  const textoOpcaoSelecionada = opcaoSelecionada.textContent;

  let arrLabels = Object.keys(eval(`json.timeline.${cmbData}`))
  let arrValues = Object.values(eval(`json.timeline.${cmbData}`))
  
  //criar dados da linha média
  const soma = arrValues.reduce((acc, valor) => acc + valor, 0);
  const media = soma / arrValues.length;
  const arrMedia = Array.from(arrValues, () => media);

  
  // Verificar se o gráfico já existe e destruí-lo, se necessário
  if (canvasLinhas) {
    canvasLinhas.destroy();
  }
  canvasLinhas = new Chart(document.getElementById("linhas"), {
    type: "line",
    data: {
      labels: arrLabels,
      datasets: [
        {
          data: arrValues,
          label: textoOpcaoSelecionada,
          borderColor: "rgb(60,286,159)",
          backgroundColor: "rgb(60,286,159,0.1)",
        },
        {
          data: arrMedia,
          label: "Média",
          borderColor: "rgb(255,140,13)",
          backgroundColor: "rgb(255,140,13,0.1)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "left", //top, bottom, left, rigth
        },
        title: {
          display: true,
          text: "Curva diária de Covid-19",
        },
        layout: {
          padding: {
            left: 100,
            rigth: 100,
            top: 50,
            bottom: 10,
          },
        },
      },
    },
  });
}

function aplicarFiltroDeDatas(){
  const [mes_start, dia_start, ano_start] = document.getElementById("date_start").value.split('-');
  const dataInicio  = new Date(`${mes_start}/${dia_start}/${ano_start}`);
  const [mes_end, dia_end, ano_end] = document.getElementById("date_end").value.split('-');
  const dataFim  = new Date(`${mes_end}/${dia_end}/${ano_end}`);


  cmbData = document.getElementById("cmbData").options[document.getElementById("cmbData").selectedIndex].value.toLowerCase();

  //const casos = json.timeline.cases;
  const casos = eval(`json.timeline.${cmbData}`);
  // console.log(casos);
  const casosFiltrados = {};

  for (const data in casos) {
    const [mes, dia, ano] = data.split('/'); // Divide a string da data em três partes: mês, dia e ano

    const dataFormatada = new Date(`${mes}/${dia}/${ano}`); // Cria o objeto Date com o formato correto

    const dataInicioFormatada = new Date(dataInicio);
    const dataFimFormatada = new Date(dataFim);

    if (dataFormatada >= dataInicioFormatada && dataFormatada <= dataFimFormatada) {
      casosFiltrados[data] = casos[data];
    }
  }

  // console.log(casosFiltrados);
  //Previsão de Ajuste: 
  //eval(`json.timeline.${cmbData}`)= casosFiltrados;
  // json.timeline.cases = casosFiltrados;

  switch (cmbData) {
    case "cases":
      json.timeline.cases = casosFiltrados;
      break;
    case "deaths":
      json.timeline.deaths = casosFiltrados;
      break;
    case "recovered":
      json.timeline.recovered = casosFiltrados;
      break;
  }

}