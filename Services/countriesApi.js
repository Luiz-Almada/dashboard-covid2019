import axios from 'axios';

const apiCountries = axios.create({
  //baseURL: "https://web.archive.org/web/20200314212829/https://api.covid19api.com/"
  baseURL: "http://localhost:3000/"
});

async function getCountries() {
  let res = await apiCountries.get("Countries");
  return res.data;
}
export { getCountries };  