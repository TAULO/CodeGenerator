const {v4: uuidv4} = require('uuid');
const path = require('path');



const subirArhivo = ( files, extensionPermitidas = ["png", "jpg", "jpeg", "gif"], carpeta = '') => {
    
    return new Promise((resolve, reject) => {
        // console.log('req.files >>>', req.files); // eslint-disable-line

        const { archivo } = files;
        const nombreArr = archivo.name.split("."); //['nombre', 'extension']
        const extension = nombreArr[nombreArr.length - 1]; //"extension"

        //validar extension
        if (!extensionPermitidas.includes(extension)) {
            return reject( `La extension .${extension} no es permitida, las permitidas son ${extensionPermitidas}`);
        }

        //renombrar y mover archivo
        const nombreTemp = uuidv4() + "." + extension;
        const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
        if (err) {
            return  reject( err );
        }
        resolve( nombreTemp );
        });
    });
};

module.exports = {
  subirArhivo,
};
