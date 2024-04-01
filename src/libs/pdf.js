const { PDFDocument, StandardFonts, rgb } = require('pdf-lib')
const { capitalizeFirstLetter } = require('./utils')
const fs  = require('fs')
const Path = require('path')

async function createPdf(data) {
    const pdfDoc = await PDFDocument.create();
    //FUENTE
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
    //COLOR DE TEXTO y DOCUMENTO
    const documentColor = rgb(0,0.6,0.6)

    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()
    const fontSize = 20
    const textFontSize = 14
    const xInitialPosition = 50
    const yInitialPosition = height - 4 * fontSize
    const yDisplacement = 46
    const textDisplacement = 240
    let yRelativePosition = yInitialPosition - 80;
    if(data.tipo.toString().toUpperCase() === 'MANTENIMIENTO'){
        yRelativePosition = yInitialPosition - 65;
    }
    const keyToTxt = (key, index) => {
        page.drawText(key.toString().toUpperCase(), {
            x: xInitialPosition + textDisplacement,
            y: yRelativePosition - yDisplacement * index,
            size: textFontSize,
            font: helveticaBold,
        })
    }
    
    const renderProperty = () => {
        let index = 0
        for (let [key, value] of Object.entries(data.content)) {
            //subtitle
            switch (key){
                case "usuario":
                    keyToTxt("Solicitado por:", index);
                    break;
                case "elementoSolicitado":
                    if(data.tipo.toString().toUpperCase() === 'CONSUMIBLE'){
                        keyToTxt("Consumible", index)
                        break;
                    }
                    if(data.tipo.toString().toUpperCase() === 'CAPACITACIÓN'){
                        keyToTxt("Capacitación", index)
                        break;
                    }
                    keyToTxt("Equipo médico", index);
                    break;
                case "prioridad":
                    keyToTxt("Nivel de Prioridad", index);
                    break;
                case "area":
                    keyToTxt("Área", index);
                    break;
                case "falloReportado":
                    if(data.tipo.toString().toUpperCase() === 'MANTENIMIENTO'){
                        keyToTxt("Fallo reportado", index);
                        break;
                    }
                    break;
                case "estado":
                    if(data.tipo.toString().toUpperCase() === 'MANTENIMIENTO'){
                        keyToTxt("Estado", index);
                        break;
                    }
                    break;
                default:
                    keyToTxt(key, index);
                    break;
            }

            function prioridadColor(p){
                page.drawText(value.toString().toLocaleLowerCase(), {
                    x: xInitialPosition + textDisplacement,
                    y: yRelativePosition - yDisplacement * index - 20,
                    size: textFontSize,
                    font: helveticaBold,
                    color: () => { if(value.toString() === 'ALTA') return rgb(1,0,0)
                    else if(value.toString() === 'MEDIA') {rgb(0.7, 0.3, 0)} else {
                        return documentColor
                    }}
                })
            }

            if(!(data.tipo.toString().toUpperCase() === 'MANTENIMIENTO')){
                if(key === "falloReportado" || key === "estado"){
                    value = " "
                }
            }

            page.drawText(capitalizeFirstLetter(value), {
                x: xInitialPosition + textDisplacement,
                y: yRelativePosition - yDisplacement * index - 20,
                size: textFontSize,
                font: helvetica,
            })
            index++;
        }
    }

    //images constants

    //logo
    const logoPath = Path.join(process.cwd(),"/public/logo.png")
    const embedLogoPNG = fs.readFileSync(logoPath)
    const logoImage = await pdfDoc.embedPng(embedLogoPNG)

    //hospital logo
    const hospitalLogoPath = Path.join(process.cwd(),"/public/hospital_logo.png")
    const embedHospitalLogoPNG = fs.readFileSync(hospitalLogoPath)
    const hospitalLogoImage = await pdfDoc.embedPng(embedHospitalLogoPNG)


    //REPORT TITLE
    const title = (type) => {
        page.drawText('SOLICITUD DE',{
            x: xInitialPosition,
            y: yInitialPosition + 20,
            size: 20,
            font: helveticaBold,
            color: documentColor
        })

        page.drawText(type.toUpperCase(), {
            x:xInitialPosition,
            y: yInitialPosition - 10,
            size: 20,
            font: helveticaBold,
            color: documentColor
        })



        page.drawImage(logoImage,{
            x:xInitialPosition + 180,
            y: yInitialPosition - 30,
            width: 100, height: 100
        })
        page.drawImage(hospitalLogoImage,{
            x:xInitialPosition + 300,
            y: yInitialPosition - 10,
            width: 200, height: 50
        })
    }
    title(data.tipo)

    //image
    if (data.icon){
        const image = await pdfDoc.embedPng(data.icon.path);
        page.drawImage(image,{
            x:xInitialPosition,
            y: yInitialPosition - 260,
            width: 200, 
            height: 200
        })
        
    } else {
        page.drawSquare({
            color: documentColor,
            x: xInitialPosition,
            y: yInitialPosition - 260,
            size: 200,
        })
    }

    //TEXTOS VARIABLES
    if(data.content) {
        renderProperty()
    }
    else {
        page.drawText('No hay reportes...', {
            x: xInitialPosition + 120,
            y: yInitialPosition - yDisplacement,
            size: fontSize,
            font: helveticaBold,
        })
    }

    if(data.description){
        let index = 0
        const verticalDisplacement = 220

        for (let [key, value] of Object.entries(data.description)) {
            //subtitle
            if(key === 'descripcion'){
                key = 'Descripción'
            }

            if(data.tipo.toString().toUpperCase() === 'MANTENIMIENTO'){
                page.drawText(key.toString().toUpperCase(), {
                    x: xInitialPosition,
                    y: (yRelativePosition - verticalDisplacement) - 140 * index - 35,
                    size: textFontSize,
                    font: helveticaBold,
                })

                page.drawText(capitalizeFirstLetter(value.toString()), {
                    x: xInitialPosition,
                    y: (yRelativePosition - verticalDisplacement) - 30 - 60 * index - 35,
                    size: textFontSize,
                    font: helvetica
                })
            } else {
                page.drawText(key.toString().toUpperCase(), {
                    x: xInitialPosition,
                    y: (yRelativePosition - verticalDisplacement) - 140 * index,
                    size: textFontSize,
                    font: helveticaBold,
                })

                page.drawText(capitalizeFirstLetter(value.toString()), {
                    x: xInitialPosition,
                    y: (yRelativePosition - verticalDisplacement) - 30 - 60 * index,
                    size: textFontSize,
                    font: helvetica
                })
            }

            index++;
        }

        let descriptionHeightSpace = 115;
        let observationsHeightSpace = 15;

        if(data.tipo.toString().toUpperCase() === 'MANTENIMIENTO'){
            descriptionHeightSpace = 77;
            observationsHeightSpace = 50;
        }

        //lineas para la descripcion
        for(let i = 0; i<5; i++){
            page.drawLine({
                start: { x: xInitialPosition, y: (yRelativePosition - verticalDisplacement) - 30 - 60 * index + descriptionHeightSpace - i*19 },
                end: { x: xInitialPosition + 500, y: (yRelativePosition - verticalDisplacement) - 30 - 60 * index + descriptionHeightSpace - i*19 },
                thickness: 1,
                color: rgb(0, 0, 0),
            });
        }


        let linesQuantity = 7;

        if(data.tipo.toString().toUpperCase() === 'MANTENIMIENTO'){
            linesQuantity = 6;
        }

        //lineas para las observaciones
        for(let i = 0; i<linesQuantity; i++){
            page.drawLine({
                start: { x: xInitialPosition, y: (yRelativePosition - verticalDisplacement) - 30 - 60 * index - observationsHeightSpace - i*19 },
                end: { x: xInitialPosition + 500, y: (yRelativePosition - verticalDisplacement) - 30 - 60 * index - observationsHeightSpace - i*19 },
                thickness: 1,
                color: rgb(0, 0, 0),
            });
        }
    }

    //footer
    page.drawRectangle({
        x:xInitialPosition,
        y: yInitialPosition - 700,
        width: 500,
        color: documentColor,
        opacity: 0.3
    })
    page.drawText("NOMBRE Y FIRMA", {
        x: xInitialPosition + 200,
        y: yInitialPosition - 672,
        font: helveticaBold,
        size: 14
    })
    page.drawText("DEPARTAMENTO DE INGENIERÍA BIOMÉDICA", {
        x: xInitialPosition + 100,
        y: yInitialPosition - 690,
        font: helveticaBold,
        size: 14
    })

    //SAVE
    return pdfDoc.save()
}

module.exports = { createPdf }