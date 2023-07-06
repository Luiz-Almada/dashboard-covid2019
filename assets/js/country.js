window.addEventListener('DOMContentLoaded', (event) => {
  //Função para preencher os selects do index, recebe id do select e um set com os valores
  preencheSelectComDadosSet = (id, set)=>{
    let arrayOrdenado = Array.from(set).sort();
    let select = document.getElementById(id);
    let valorPadrao = "Brazil"; // Defina o valor padrão que você deseja
    //Preenche o select (combo)
    for(let item of arrayOrdenado){
      if(item != null)
        select.innerHTML += `<option value="${item}">${item}</option>`;
    }

    //Seta o valor default (Brazil)
     for (let i = 0; i < select.options.length; i++) {
       if (select.options[i].value === valorPadrao) {
         select.selectedIndex = i;
         break;
       }   
     }  
  }

  function carregaDados(result) {
    fullData = result;
    filteredData = filtrar(fullData)
    getTotaisKPIs(filteredData);
  }

  function getTotaisKPIs(result) {
    let kpiconfirmed = document.getElementById('kpiconfirmed');
    let kpideaths = document.getElementById('kpideaths');
    let kpirecovered = document.getElementById('kpirecovered');

    kpiconfirmed.textContent = getTotalItens("confirmed", result).toLocaleString('pt-BR');
    kpideaths.textContent = getTotalItens("deaths", result).toLocaleString('pt-BR');
    kpirecovered.textContent = getTotalItens("recovered", result).toLocaleString('pt-BR');

  }

  function getTotalItens(item, data) {
    const pais = document.getElementById('cmbCountry');
    return data.reduce(function (total, current) {
      if (current.Status.toUpperCase() === item.toUpperCase() 
          && current.Country.toUpperCase() === pais.value.toUpperCase()) 
      {
        return total = current.Cases;
      }
      return total;
    }, 0);    
  }

  function filtrar(data){
    let pais = document.getElementById("cmbCountry");
    
    if(pais.options[pais.selectedIndex].value != ""){
      result = (data.Countries.filter(item => {
        if(item.Country != null){
          return item.Country.toUpperCase().trim() == pais.value.toUpperCase().trim();
        }
      return false;
      }));
    }

    
    // if(nome.value != ""){
    //   resultado = resultado.filter(item => {
    //     if(item.name != null){
    //       return item.name.toUpperCase().trim() == nome.value.toUpperCase().trim()
    //     }
    //     return false;
    //   });
    // }
    
    
    if(result.length == 0){
      return null;
    } else {
      return result;
    }  
  }

  requisicao = async () => { 
    //let resAll = await fetch("http://localhost:3001/all", {method: 'GET', redirect: 'follow'})
    let resAll = await (await fetch("data/all.json"));
    let json = await resAll.json();

    const elPais = document.getElementById("cmbCountry");

    if(elPais.length == 0) {
      const pais = Array.from(new Set(json.Countries.map(item => item.Country)));
      preencheSelectComDadosSet("cmbCountry", pais);
    }

    carregaDados(json);
  }

  document.getElementById("cmbCountry").addEventListener("change", (e)=>{
    requisicao();
  })

  document.getElementById("filtro").addEventListener("click", (e)=>{
    requisicao();;
  })

  

  let linhas = new Chart(document.getElementById("linhas"), {
    type: 'line',
    data: {
      labels: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      datasets: [
        {
          data: [1123, 1109, 1008, 1208, 1423, 1114, 1036],
          label: "Casos confirmados",
          borderColor: "rgb(60,286,159)",
          backgroundColor: "rgb(60,286,159,0.1)"
        },
        {
          data: [143, 109, 208, 210, 113, 114, 203],
          label: "Número de Óbitos",
          borderColor: "rgb(255,140,13)",
          backgroundColor: "rgb(255,140,13,0.1)"
        }
      ]    
    },
    options: {  
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'left', //top, bottom, left, rigth 
        },
        title: {
          display: true,
          text: 'Curva de COVID'
        },
        layout: {
          padding: {
            left: 100,
            rigth: 100,
            top: 50,
            bottom: 10
          }
        }
      }
    }
  });

})