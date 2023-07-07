export function formatDate(dateSource) {
  //Formata a data (dateSource)
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

