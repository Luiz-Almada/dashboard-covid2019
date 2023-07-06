import { getSummaries } from '../../../Services/summariesApi.js';
import { getCountries } from '../../../Services/countriesApi.js';

let resSummaries = await getSummaries();

(async () => {

  console.log(resSummaries);
  console.log(resSummaries.TotalConfirmed.toLocaleString('pt-BR'));
  console.log(resSummaries.TotalDeaths.toLocaleString('pt-BR'));
  console.log(resSummaries.TotalRecovered.toLocaleString('pt-BR'));
})();


// let resCountries = await getCountries();
// (() => {console.log(resCountries);})();
