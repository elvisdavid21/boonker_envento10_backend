const { format, parse } = require('date-fns');
const { es } = require('date-fns/locale');
const nodemailer = require("nodemailer");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const QRCode = require('qrcode');

const sendMessage = async (datos) => {
  console.log(datos)
  const infoCliente = datos.split(",");
  
  const nombre = infoCliente[0].split(":")[1];
  
  const correo = infoCliente[1].split(":")[1];
 
  const constructora = infoCliente[2].split(":")[1];
  
  const telefono = infoCliente[3].split(":")[1].trim().replace(/^0+/, '');
  const telefonoCodigo = `+593${telefono}`;
  const fechaHora = (infoCliente[4] + infoCliente[5] + infoCliente[6]).split("Agenda tu visita:")[1];
  const fechaHoraLimpia = fechaHora.split(" ").slice(0, 6).join(" ").split("-")[0].trim();

  const formatoFecha = parse(fechaHoraLimpia, "EEEE MMM dd yyyy hh:mm a", new Date());
  const fechaHoraFormateada = format(formatoFecha, "eeee dd/MM/yyyy HH:mm", { locale: es });
  const fechaFinal = fechaHoraFormateada.split(" ");
  const soloFecha = fechaFinal[0] + ' ' + fechaFinal[1];
  const soloHora = fechaFinal[2];

  // Generar PDF con la información de la cita
  const crearPDF = async (nombre, soloFecha, soloHora) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'portrait',
    });

    const pdfPath = `./invitacion_${nombre}.pdf`;

    // Generar el QR
    const qrData = `Nombre: ${nombre}\nFecha: ${soloFecha}\nHora: ${soloHora}`;
    const qrCodeURL = await QRCode.toDataURL(qrData);

    // Crear el archivo PDF
    doc.pipe(fs.createWriteStream(pdfPath));

    // Establecer una imagen de fondo si tienes una imagen
    const imagenFondo = './src/img/fondoConfirmacion.png'; // Cambiar por la ruta de tu imagen
    doc.image(imagenFondo, 0, 0, { width: doc.page.width, height: doc.page.height });

    // Añadir el texto sobre la imagen
    doc.fontSize(20).fillColor('#000000').text(`Estimado/a ${nombre},`, 100, 262, { align: 'center', valign: 'center' });
    doc.moveDown().text(`${soloFecha}`, 100, 330, { align: 'center' });
    doc.moveDown().text(`${soloHora} horas.`, 100, 536, { align: 'center' });
    doc.rect(178, 605, 239, 18).fill('#000000');
    doc.fontSize(9).moveDown().fillColor('#ffffff').text('FAVOR PRESENTAR ESTA CREDENCIAL AL INGRESAR', 72, 610, {align: 'center'})

    // Añadir el QR
    doc.image(qrCodeURL, 240, 350, { fit: [130, 130], align: 'center', valign: 'center' })

    doc.fontSize(20)

    //Iconos
    const x = 198
    const y = 688
    const texto = '...'; 
    const email = process.env.MAIL_GIO;
    const url = `mailto:${email}`;
    doc.fillColor('#ffffff').text(texto, x, y)
    doc.link(x, y, doc.widthOfString(texto), doc.currentLineHeight(), url);

    const x2 = 267;
    const y2 = 690;
    const texto2 = '...';
    const telefono = process.env.TEL_WHATSAPP;
    const url2 = `https://wa.me/${telefono}`;

    // Añadir el texto
    doc.fillColor('#ffffff').text(texto2, x2, y2)

    // Añadir el enlace en la misma posición
    doc.link(x2, y2, doc.widthOfString(texto2), doc.currentLineHeight(), url2);

    //telefono fijo
    const x3 = 322;
    const y3 = 703;
    const texto3 = '...';
    const telefonoFijo = '+593024760357';
    const url3 = `tel:${telefonoFijo}`;

    // Añadir el texto
    doc.fillColor('#ffffff').text(texto3, x3, y3);

    // Añadir el enlace en la misma posición
    doc.link(x3, y3, doc.widthOfString(texto3), doc.currentLineHeight(), url3);

    //reagendar
    const x4 = 378;
    const y4 = 695;
    const texto4 = '...';
    const url4 = process.env.URL_FRONT;
    doc.fillColor('#ffffff').text(texto4, x4, y4);

    doc.link(x4, y4, doc.widthOfString(texto4), doc.currentLineHeight(), url4);

    doc.end();
    return pdfPath;
  };

  const pdfPath = await crearPDF(nombre, soloFecha, soloHora);

  // Enviar correo
  const transporter = nodemailer.createTransport({
    host: 'vidar.edeinternet.net',
    port: 26,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: correo,
    subject: `Confirmación de cita para ${nombre}`,
    text: `Estimado/a ${nombre}, su cita se agendó para el día ${soloFecha} a las ${soloHora}.`,
    attachments: [
      {
        filename: `invitacion_${nombre}.pdf`,
        path: pdfPath,
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);

    // Elimina el archivo PDF una vez enviado
    fs.unlinkSync(pdfPath);
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
  }
};

export default sendMessage;

