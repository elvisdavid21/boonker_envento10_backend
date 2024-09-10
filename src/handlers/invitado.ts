import Invitados from '../models/invitados.model'
const { format, parse } = require('date-fns');
const { es } = require('date-fns/locale');

export const createInvitado = async (datos) => {
  try {

    const infoCliente = datos.split(",");
  
  const nombre = infoCliente[0].split(":")[1];
  
  const correo = infoCliente[1].split(":")[1];
 
  const constructora = infoCliente[2].split(":")[1];
  
  const telefono = infoCliente[3].split(":")[1].trim().replace(/^0+/, '');
  const fechaHora = (infoCliente[4] + infoCliente[5] + infoCliente[6]).split("Agenda tu visita:")[1];
  const fechaHoraLimpia = fechaHora.split(" ").slice(0, 6).join(" ").split("-")[0].trim();

  const formatoFecha = parse(fechaHoraLimpia, "EEEE MMM dd yyyy hh:mm a", new Date());
  const fechaHoraFormateada = format(formatoFecha, "eeee dd/MM/yyyy HH:mm", { locale: es });

  const datosLimpios = {
    nombre,
    telefono,
    email: correo,
    fecha: fechaHoraFormateada,
    constructora
  }

  //console.log('datos base ', datosLimpios)
  const invitados = new Invitados(datosLimpios)
  const datosSave = await invitados.save()
  return datosSave
    
  } catch (error) {
    console.log(error)
  }
}