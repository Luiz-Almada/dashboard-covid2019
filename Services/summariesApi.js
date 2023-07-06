import axios from 'axios';

const apiSummaries = axios.create({
  //baseURL: "https://web.archive.org/web/20200314212829/https://api.covid19api.com/"
  baseURL: "http://localhost:3001/"
});

async function getSummaries() {
  let res = await apiSummaries.get("global");
  return res.data;
}

export { getSummaries };
