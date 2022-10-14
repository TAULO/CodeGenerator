import router from '@/router';
 
 

export function getValueExtension(extensionesarray, mimetype) {
    let extension = "";

    extensionesarray.forEach(elemento => {

        if (elemento.mimetype == mimetype) {
            extension = elemento.extension;

        }
    });

    return extension;
};



export function xmlToJsonFind(xml, tagBuscar) {

    var convert = require('xml-js');

    console.log("xmltojson 44444443", xml);

    var result = convert.json2xml(json, options);

    return result;
};


export function isObject(o) {
    return typeof o == "object"
};

export function StringToXMLDom(string) {
    var xmlDoc = null;
    var parser = null;
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(string, "text/xml");
    } else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(string);
    }
    return xmlDoc;
}


export function xmlToJson(xml) {

    let resultado = [];

    let texto = "";
    var xmlDoc = StringToXMLDom(xml)
    var x, i;
    console.log(xml);
    // xmlDoc = xml.responseXML;
    texto = "[";
    x = xmlDoc.documentElement.childNodes;
    for (i = 0; i < x.length; i++) {

        if (x[i].nodeType == 1) {

            var nombre = x[i].nodeName;
            var valor = x[i].innerHTML;
            /*
            if (x.length - i > 1)
                texto += '{ "nombre":"' + nombre + '" , "valor":"' + valor + '" },';
            else
				texto += '{ "nombre":"' + nombre + '" , "valor":"' + valor + '" } ';
				*/

        }
        resultado.push({ nombre: nombre, valor: valor })
    }
    texto += ']';
    console.log(texto);
    //resultado = JSON.parse(texto);

    return resultado;
};


export const BDpeticion = [{
    datos: '',
    formato: '',
    dml: '',
    formatoRequest: '',
    credencial: '',
    datosJson: '',
    deserror: '',
    codigoerror: ''
}];

export function diviTimer(milisegundos) {
    var myDate = new Date();
    var ahora = myDate.valueOf();
    console.info('al inicio  ', ahora);
    while (1 == 1) {
        // code block to be executed
        var fechainterna = new Date().valueOf();
        console.info('ahora ya ', fechainterna);

        console.info('llegada  ', parseInt(milisegundos) + parseInt(ahora));
        if (parseInt(fechainterna) > parseInt(milisegundos) + parseInt(ahora)) break;
    }
    return 0;
}

export function filaArraytoStrintg(arrayfilas, addValores) {
    var xmlFilas = '';
    if (arrayfilas.length > 0) {
        xmlFilas = '<Filas>';
        arrayfilas.forEach(function callback(item) {
            if (addValores == 'S') {
                xmlFilas += '<FilaItem><Nombre>' + item.NOMBRE + '</Nombre>';

                if (item.CDATA == 0) {
                    xmlFilas += '<Valor>' + item.VALOR1 + '</Valor>';
                    xmlFilas += '<Valor2>' + item.VALOR2 + '</Valor2>';
                }
                if (item.CDATA == 1)
                    xmlFilas += '<Valor/><Valor2/><Cdata><X> <![CDATA[' + item.VALOR2 + ']]></X></Cdata>';
            } else {
                //xmlFilas += "<FilaItem><Nombre>" + item.NOMBRE + "</Nombre><Valor/><Valor2/><Cdata><X></X></Cdata>";
                if (item.VALOR2 != '')
                    xmlFilas +=
                    '<FilaItem><Nombre>' + item.NOMBRE + '</Nombre><Valor/><Valor2>' + item.VALOR2 + '</Valor2>';
                else xmlFilas += '<FilaItem><Nombre>' + item.NOMBRE + '</Nombre><Valor/><Valor2/>';
            }

            xmlFilas += '</FilaItem>';
        });
    }

    if (arrayfilas.length > 0) xmlFilas += '</Filas>';
    else xmlFilas = null;

    return xmlFilas;
}

export function paramArraytoStrintg(arrayParam) {
    var xmlParametros = '<Param>';
    if (arrayParam.length > 0) {
        arrayParam.forEach(function callback(item) {
            if (item.OPERADOR == '')
                xmlParametros += '<ParamItem><Nombre>' + item.NOMBRE + '</Nombre>' + '<Operador>IGUAL</Operador>';
            else
                xmlParametros +=
                '<ParamItem><Nombre>' + item.NOMBRE + '</Nombre>' + '<Operador>' + item.OPERADOR + '</Operador>';

            if (item.CDATA == 0) xmlParametros += '<Valor1>' + item.VALOR1 + '</Valor1>';

            if (item.CDATA == 1)
                xmlParametros += '<Valor1/><Valor2/><Cdata><X> <![CDATA[' + item.VALOR1 + ']]></X></Cdata>';

            if (item.VALOR2 != '') xmlParametros += '<Valor2>' + item.VALOR2 + '</Valor2>';

            xmlParametros += '</ParamItem>' + String.fromCharCode(13);
        });
    } else xmlParametros = '<ParamItem/>';

    if (arrayParam.length > 0) xmlParametros += '</Param>';

    return xmlParametros;
}

//// ACCCION
export function GetHeaderString(header) {
    var xmlHeader = '';
    xmlHeader = '<HeaderItem><Nombre>' + 'OBJECTID' + '</Nombre><Valor>' + header.OBJECTID + '</Valor></HeaderItem>';
    xmlHeader += '<HeaderItem><Nombre>' + 'MODO' + '</Nombre><Valor>' + header.MODO + '</Valor></HeaderItem>';

    if (header.USERNAME > '')
        xmlHeader +=
        '<HeaderItem><Nombre>' + 'USERNAME' + '</Nombre><Valor>' + header.USERNAME + '</Valor></HeaderItem>';

    if (header.CREDENCIAL > '')
        xmlHeader +=
        '<HeaderItem><Nombre>' + 'CREDENCIAL' + '</Nombre><Valor>' + header.CREDENCIAL + '</Valor></HeaderItem>';

    if (header.DATEFORMAT > '')
        xmlHeader +=
        '<HeaderItem><Nombre>' + 'DATEFORMAT' + '</Nombre><Valor>' + header.DATEFORMAT + '</Valor></HeaderItem>';

    if (header.NUMBERFORMAT > '')
        xmlHeader +=
        '<HeaderItem><Nombre>' +
        'NUMBERFORMAT' +
        '</Nombre><Valor>' +
        header.NUMBERFORMAT +
        '</Valor></HeaderItem>';

    if (header.REGISTROSXPAGINA > '')
        xmlHeader +=
        '<HeaderItem><Nombre>' +
        'REGISTROSXPAGINA' +
        '</Nombre><Valor>' +
        header.REGISTROSXPAGINA +
        '</Valor></HeaderItem>';

    if (header.PAGINA > '')
        xmlHeader += '<HeaderItem><Nombre>' + 'PAGINA' + '</Nombre><Valor>' + header.PAGINA + '</Valor></HeaderItem>';

    if (header.ORDERBY > '')
        xmlHeader += '<HeaderItem><Nombre>' + 'ORDERBY' + '</Nombre><Valor>' + header.ORDERBY + '</Valor></HeaderItem>';

    if (header.SUPERVISOR > '')
        xmlHeader +=
        '<HeaderItem><Nombre>' + 'SUPERVISOR' + '</Nombre><Valor>' + header.SUPERVISOR + '</Valor></HeaderItem>';

    if (header.OBJECTMETODO > '')
        xmlHeader +=
        '<HeaderItem><Nombre>' + 'METODO' + '</Nombre><Valor>' + header.OBJECTMETODO + '</Valor></HeaderItem>';

    xmlHeader = ' <Header>' + xmlHeader + '</Header>';

    return xmlHeader;
}


//LOGIN PROFILE
export const profile = [{
    nombre: "",
    credencial: "",
    username: "",
}]

//profile SdtLogin
export function GetSdtLoginString(sdtLogin) {

    var xmlLog = "<SdtLogin><Header>";

    xmlLog += "<Action>" + sdtLogin.action + "</Action>";
    xmlLog += "<Username>" + sdtLogin.username + "</Username>";
    xmlLog += "<Password>" + sdtLogin.password + "</Password>";
    xmlLog += "<PasswordOld>" + sdtLogin.passwordOld + "</PasswordOld>";
    xmlLog += "<KeySecurity>" + sdtLogin.keySecurity + "</KeySecurity>";
    xmlLog += "<Celular>" + sdtLogin.celular + "</Celular>";
    xmlLog += "<Empresa>" + sdtLogin.empresa + "</Empresa>";
    xmlLog += "<Email>" + sdtLogin.email + "</Email>";
    xmlLog += "<Nombre>" + sdtLogin.nombre + "</Nombre>";
    xmlLog += "<DireccionIP>" + sdtLogin.direccionIP + "</DireccionIP>";
    xmlLog += "<conexionADM>" + sdtLogin.conexionADM + "</conexionADM>";
    xmlLog += "<Credencial>" + sdtLogin.credencial + "</Credencial>";
    xmlLog += "<Firma><Cdata><X>ABRECDATACIERRACDATA</X></Cdata></Firma>"; //corregir 
    xmlLog += "</Header></SdtLogin>";
    return xmlLog;
}

/*
export const CMSpeticionCrud = "<SOA_Xml>" +
    "<Header>" +
    "<HeaderItem><Nombre>OBJECTID</Nombre><Valor>8105</Valor></HeaderItem>" +
    "<HeaderItem><Nombre>MODO</Nombre><Valor>I</Valor></HeaderItem>" +
    "<HeaderItem><Nombre>USERNAME</Nombre><Valor>ROOT</Valor></HeaderItem>" +
    "<HeaderItem><Nombre>CREDENCIAL</Nombre><Valor>503a25c17727f1640a8bd8a5a0f45132</Valor></HeaderItem>" +
    "<HeaderItem><Nombre>REGISTROSXPAGINA</Nombre><Valor>1</Valor></HeaderItem>" +
    "<HeaderItem><Nombre>PAGINA</Nombre><Valor>1</Valor></HeaderItem>" +
    "</Header>" +
    "REPLACEPARAMETROS" +
    "REPLACEFILASDATA" +
    "</SOA_Xml>";
*/
//// MULTIMEDIA CMS  SECTION

export const CMSpeticion = [{
    Credencial: '0',
    CodCia: "1",
    num_publicacion: 0,
    datos: "",
    insertarBd: "",
    dml: "FILE",
    formato: "N",
    formatoRequest: "N",
    referencia: "REPLACEREFERENCIA", //AUI DEBE CONSEGUIRLA ANTES O UN AUTOINCREMENT  
    ruta: "imagebank",
    documenttype: "",
    lote: "0",
    extension: "",
    ObjectId: "8105"
}];

/// RESPUESTA CUANDO SE INGRESA  UN DOCUMENTO 
export const CMSRespuestaIN = [{
    CodCia: '1',
    Repositorio: '',
    RutaOrigen: '',
    ExtensionFinal: '',
    NuevoNombre: '',
    RutaDestino: '',
    EntidadCodigo: '',
    LlaveExterna: '0',
    RutaDestino: '',
    NumDoc: '0',
    ReferenciaPadre: "0",
    Referencia: "0",
    ReferenciaPersonalizada: "0",
    NumNivel: '',
    FormatoImagen: '',
    DirectorioSeparatorOrigen: '',
    NombreObjeto: '',
    Descripcion: '',
    FormatoArchivoDestino: '',
    hashDoc: '',
    DocumentoMimeType: '',
    Size: 0,
    DescripcionDoc: '',
    deserror: '',
    codigoerror: ''
}];

export const CMSMimeToExtension = [{
        "mimetype": "application/java-archive",
        "extension": ".jar"
    },
    {
        "mimetype": "application/javascript",
        "extension": ".js"
    },
    {
        "mimetype": "application/java-vm",
        "extension": ".class"
    },
    {
        "mimetype": "application/json",
        "extension": ".json"
    },
    {
        "mimetype": "application/mp4",
        "extension": ".mp4s"
    },
    {
        "mimetype": "application/msword",
        "extension": ".doc"
    },
    {
        "mimetype": "application/msword",
        "extension": ".dot"
    },
    {
        "mimetype": "application/pdf",
        "extension": ".pdf"
    },
    {
        "mimetype": "application/pgp-encrypted",
        "extension": ".pgp"
    },
    {
        "mimetype": "application/pkcs10",
        "extension": ".p10"
    },
    {
        "mimetype": "application/pkcs7-mime",
        "extension": ".p7c"
    },
    {
        "mimetype": "application/pkcs7-mime",
        "extension": ".p7m"
    },
    {
        "mimetype": "application/pkcs7-signature",
        "extension": ".p7s"
    },
    {
        "mimetype": "application/pkix-cert",
        "extension": ".cer"
    },
    {
        "mimetype": "application/pkixcmp",
        "extension": ".pki"
    },
    {
        "mimetype": "application/pkix-crl",
        "extension": ".crl"
    },
    {
        "mimetype": "application/pkix-pkipath",
        "extension": ".pkipath"
    },
    {
        "mimetype": "application/pls+xml",
        "extension": ".pls"
    },
    {
        "mimetype": "application/postscript",
        "extension": ".ai"
    },
    {
        "mimetype": "application/postscript",
        "extension": ".eps"
    },
    {
        "mimetype": "application/vnd.llamagraphics.life-balance.desktop",
        "extension": ".lbd"
    },
    {
        "mimetype": "application/vnd.llamagraphics.life-balance.exchange+xml",
        "extension": ".lbe"
    },
    {
        "mimetype": "application/vnd.mfer",
        "extension": ".mwf"
    },
    {
        "mimetype": "application/vnd.mfmp",
        "extension": ".mfm"
    },
    {
        "mimetype": "application/vnd.micrografx.flo",
        "extension": ".flo"
    },
    {
        "mimetype": "application/vnd.micrografx.igx",
        "extension": ".igx"
    },
    {
        "mimetype": "application/vnd.mif",
        "extension": ".mif"
    },
    {
        "mimetype": "application/vnd.mobius.daf",
        "extension": ".daf"
    },
    {
        "mimetype": "application/vnd.mobius.dis",
        "extension": ".dis"
    },
    {
        "mimetype": "application/vnd.mobius.mbk",
        "extension": ".mbk"
    },
    {
        "mimetype": "application/vnd.mobius.mqy",
        "extension": ".mqy"
    },
    {
        "mimetype": "application/vnd.mobius.msl",
        "extension": ".msl"
    },
    {
        "mimetype": "application/vnd.mobius.plc",
        "extension": ".plc"
    },
    {
        "mimetype": "application/vnd.mobius.txf",
        "extension": ".txf"
    },
    {
        "mimetype": "application/vnd.mophun.application",
        "extension": ".mpn"
    },
    {
        "mimetype": "application/vnd.mophun.certificate",
        "extension": ".mpc"
    },
    {
        "mimetype": "application/vnd.mozilla.xul+xml",
        "extension": ".xul"
    },
    {
        "mimetype": "application/vnd.ms-artgalry",
        "extension": ".cil"
    },
    {
        "mimetype": "application/vnd.ms-cab-compressed",
        "extension": ".cab"
    },
    {
        "mimetype": "application/vnd.mseq",
        "extension": ".mseq"
    },
    {
        "mimetype": "application/vnd.ms-excel",
        "extension": ".xla"
    },
    {
        "mimetype": "application/vnd.ms-excel",
        "extension": ".xlb"
    },
    {
        "mimetype": "application/vnd.ms-excel",
        "extension": ".xlc"
    },
    {
        "mimetype": "application/vnd.ms-excel",
        "extension": ".xlm"
    },
    {
        "mimetype": "application/vnd.ms-excel",
        "extension": ".xls"
    },
    {
        "mimetype": "application/vnd.ms-excel",
        "extension": ".xlt"
    },
    {
        "mimetype": "application/vnd.ms-excel",
        "extension": ".xlw"
    },
    {
        "mimetype": "application/vnd.ms-excel.addin.macroenabled.12",
        "extension": ".xlam"
    },
    {
        "mimetype": "application/vnd.ms-excel.sheet.binary.macroenabled.12",
        "extension": ".xlsb"
    },
    {
        "mimetype": "application/vnd.ms-excel.sheet.macroenabled.12",
        "extension": ".xlsm"
    },
    {
        "mimetype": "application/vnd.ms-excel.template.macroenabled.12",
        "extension": ".xltm"
    },
    {
        "mimetype": "application/vnd.ms-fontobject",
        "extension": ".eot"
    },
    {
        "mimetype": "application/vnd.ms-htmlhelp",
        "extension": ".chm"
    },
    {
        "mimetype": "application/vnd.ms-ims",
        "extension": ".ims"
    },
    {
        "mimetype": "application/vnd.ms-lrm",
        "extension": ".lrm"
    },
    {
        "mimetype": "application/vnd.ms-pki.seccat",
        "extension": ".cat"
    },
    {
        "mimetype": "application/vnd.ms-pki.stl",
        "extension": ".stl"
    },
    {
        "mimetype": "application/vnd.ms-powerpoint",
        "extension": ".pot"
    },
    {
        "mimetype": "application/vnd.ms-powerpoint",
        "extension": ".ppa"
    },
    {
        "mimetype": "application/vnd.ms-powerpoint",
        "extension": ".pps"
    },
    {
        "mimetype": "application/vnd.ms-powerpoint",
        "extension": ".ppt"
    },
    {
        "mimetype": "application/vnd.ms-powerpoint",
        "extension": ".pwz"
    },
    {
        "mimetype": "application/vnd.ms-powerpoint.addin.macroenabled.12",
        "extension": ".ppam"
    },
    {
        "mimetype": "application/vnd.ms-powerpoint.presentation.macroenabled.12",
        "extension": ".pptm"
    },
    {
        "mimetype": "application/vnd.ms-powerpoint.slide.macroenabled.12",
        "extension": ".sldm"
    },
    {
        "mimetype": "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
        "extension": ".ppsm"
    },
    {
        "mimetype": "application/vnd.ms-powerpoint.template.macroenabled.12",
        "extension": ".potm"
    },
    {
        "mimetype": "application/vnd.ms-project",
        "extension": ".mpp"
    },
    {
        "mimetype": "application/vnd.ms-project",
        "extension": ".mpt"
    },
    {
        "mimetype": "application/vnd.ms-word.document.macroenabled.12",
        "extension": ".docm"
    },
    {
        "mimetype": "application/vnd.ms-word.template.macroenabled.12",
        "extension": ".dotm"
    },
    {
        "mimetype": "application/vnd.ms-works",
        "extension": ".wcm"
    },
    {
        "mimetype": "application/vnd.ms-works",
        "extension": ".wdb"
    },
    {
        "mimetype": "application/vnd.ms-works",
        "extension": ".wks"
    },
    {
        "mimetype": "application/vnd.ms-works",
        "extension": ".wps"
    },
    {
        "mimetype": "application/vnd.olpc-sugar",
        "extension": ".xo"
    },
    {
        "mimetype": "application/vnd.oma.dd2+xml",
        "extension": ".dd2"
    },
    {
        "mimetype": "application/vnd.openofficeorg.extension",
        "extension": ".oxt"
    },
    {
        "mimetype": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "extension": ".pptx"
    },
    {
        "mimetype": "application/vnd.openxmlformats-officedocument.presentationml.slide",
        "extension": ".sldx"
    },
    {
        "mimetype": "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
        "extension": ".ppsx"
    },
    {
        "mimetype": "application/vnd.openxmlformats-officedocument.presentationml.template",
        "extension": ".potx"
    },
    {
        "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "extension": ".xlsx"
    },
    {
        "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
        "extension": ".xltx"
    },
    {
        "mimetype": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "extension": ".docx"
    },
    {
        "mimetype": "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
        "extension": ".dotx"
    },
    {
        "mimetype": "application/vnd.visio",
        "extension": ".vsd"
    },
    {
        "mimetype": "application/vnd.visio",
        "extension": ".vss"
    },
    {
        "mimetype": "application/x-gzip",
        "extension": ".gz"
    },
    {
        "mimetype": "application/x-gzip",
        "extension": ".tgz"
    },
    {
        "mimetype": "application/x-hdf",
        "extension": ".hdf"
    },
    {
        "mimetype": "application/xhtml+xml",
        "extension": ".xht"
    },
    {
        "mimetype": "application/xhtml+xml",
        "extension": ".xhtml"
    },
    {
        "mimetype": "application/x-killustrator",
        "extension": ".kil"
    },
    {
        "mimetype": "application/x-latex",
        "extension": ".latex"
    },
    {
        "mimetype": "application/xml",
        "extension": ".xml"
    },
    {
        "mimetype": "application/xml",
        "extension": ".xpdl"
    },
    {
        "mimetype": "application/xml",
        "extension": ".xsl"
    },
    {
        "mimetype": "application/xml-dtd",
        "extension": ".dtd"
    },
    {
        "mimetype": "application/x-msaccess",
        "extension": ".mdb"
    },
    {
        "mimetype": "application/x-ms-application",
        "extension": ".application"
    },
    {
        "mimetype": "application/x-msbinder",
        "extension": ".obd"
    },
    {
        "mimetype": "application/x-mscardfile",
        "extension": ".crd"
    },
    {
        "mimetype": "application/x-msclip",
        "extension": ".clp"
    },
    {
        "mimetype": "application/x-msdownload",
        "extension": ".bat"
    },
    {
        "mimetype": "application/x-msdownload",
        "extension": ".com"
    },
    {
        "mimetype": "application/x-msdownload",
        "extension": ".dll"
    },
    {
        "mimetype": "application/x-msdownload",
        "extension": ".exe"
    },
    {
        "mimetype": "application/x-msdownload",
        "extension": ".msi"
    },
    {
        "mimetype": "application/x-msmediaview",
        "extension": ".mvb"
    },
    {
        "mimetype": "application/x-msmetafile",
        "extension": ".wmf"
    },
    {
        "mimetype": "application/x-msmoney",
        "extension": ".mny"
    },
    {
        "mimetype": "application/x-mspublisher",
        "extension": ".pub"
    },
    {
        "mimetype": "application/x-pkcs12",
        "extension": ".p12"
    },
    {
        "mimetype": "application/x-pkcs12",
        "extension": ".pfx"
    },
    {
        "mimetype": "application/x-rar-compressed",
        "extension": ".rar"
    },
    {
        "mimetype": "application/x-rpm",
        "extension": ".rpm"
    },
    {
        "mimetype": "application/x-shockwave-flash",
        "extension": ".swf"
    },
    {
        "mimetype": "application/x-silverlight-app",
        "extension": ".xap"
    },
    {
        "mimetype": "application/x-wais-source",
        "extension": ".src"
    },
    {
        "mimetype": "application/x-x509-ca-cert",
        "extension": ".crt"
    },
    {
        "mimetype": "application/x-x509-ca-cert",
        "extension": ".der"
    },
    {
        "mimetype": "application/x-xfig",
        "extension": ".fig"
    },
    {
        "mimetype": "application/x-xpinstall",
        "extension": ".xpi"
    },
    {
        "mimetype": "application/zip",
        "extension": ".zip"
    },
    {
        "mimetype": "audio/adpcm",
        "extension": ".adp"
    },
    {
        "mimetype": "audio/basic",
        "extension": ".au"
    },
    {
        "mimetype": "audio/basic",
        "extension": ".snd"
    },
    {
        "mimetype": "audio/midi",
        "extension": ".kar"
    },
    {
        "mimetype": "audio/midi",
        "extension": ".mid"
    },
    {
        "mimetype": "audio/midi",
        "extension": ".midi"
    },
    {
        "mimetype": "audio/midi",
        "extension": ".rmi"
    },
    {
        "mimetype": "audio/mp4",
        "extension": ".mp4a"
    },
    {
        "mimetype": "audio/mpeg",
        "extension": ".m2a"
    },
    {
        "mimetype": "audio/mpeg",
        "extension": ".m3a"
    },
    {
        "mimetype": "audio/mpeg",
        "extension": ".mp2"
    },
    {
        "mimetype": "audio/mpeg",
        "extension": ".mp2a"
    },
    {
        "mimetype": "audio/mpeg",
        "extension": ".mp3"
    },
    {
        "mimetype": "audio/mpeg",
        "extension": ".mpga"
    },
    {
        "mimetype": "audio/ogg",
        "extension": ".oga"
    },
    {
        "mimetype": "audio/ogg",
        "extension": ".ogg"
    },
    {
        "mimetype": "audio/ogg",
        "extension": ".spx"
    },
    {
        "mimetype": "audio/vnd.digital-winds",
        "extension": ".eol"
    },
    {
        "mimetype": "audio/vnd.dts",
        "extension": ".dts"
    },
    {
        "mimetype": "audio/vnd.dts.hd",
        "extension": ".dtshd"
    },
    {
        "mimetype": "audio/vnd.lucent.voice",
        "extension": ".lvp"
    },
    {
        "mimetype": "audio/x-mpegurl",
        "extension": ".m3u"
    },
    {
        "mimetype": "audio/x-ms-wax",
        "extension": ".wax"
    },
    {
        "mimetype": "audio/x-ms-wma",
        "extension": ".wma"
    },
    {
        "mimetype": "audio/x-pn-realaudio",
        "extension": ".ra"
    },
    {
        "mimetype": "audio/x-pn-realaudio",
        "extension": ".ram"
    },
    {
        "mimetype": "audio/x-pn-realaudio-plugin",
        "extension": ".rmp"
    },
    {
        "mimetype": "image/bmp",
        "extension": ".bmp"
    },
    {
        "mimetype": "image/cgm",
        "extension": ".cgm"
    },
    {
        "mimetype": "image/g3fax",
        "extension": ".g3"
    },
    {
        "mimetype": "image/gif",
        "extension": ".gif"
    },
    {
        "mimetype": "image/ief",
        "extension": ".ief"
    },
    {
        "mimetype": "image/jpeg",
        "extension": ".jpe"
    },
    {
        "mimetype": "image/jpeg",
        "extension": ".jpeg"
    },
    {
        "mimetype": "image/jpeg",
        "extension": ".jpg"
    },
    {
        "mimetype": "image/png",
        "extension": ".png"
    },
    {
        "mimetype": "image/prs.btif",
        "extension": ".btif"
    },
    {
        "mimetype": "image/svg+xml",
        "extension": ".svg"
    },
    {
        "mimetype": "image/svg+xml",
        "extension": ".svgz"
    },
    {
        "mimetype": "image/tiff",
        "extension": ".tif"
    },
    {
        "mimetype": "image/tiff",
        "extension": ".tiff"
    },
    {
        "mimetype": "image/vnd.adobe.photoshop",
        "extension": ".psd"
    },
    {
        "mimetype": "image/vnd.djvu",
        "extension": ".djv"
    },
    {
        "mimetype": "image/vnd.djvu",
        "extension": ".djvu"
    },
    {
        "mimetype": "image/vnd.dwg",
        "extension": ".dwg"
    },
    {
        "mimetype": "image/vnd.dxf",
        "extension": ".dxf"
    },
    {
        "mimetype": "image/vnd.fastbidsheet",
        "extension": ".fbs"
    },
    {
        "mimetype": "image/vnd.fpx",
        "extension": ".fpx"
    },
    {
        "mimetype": "image/vnd.fst",
        "extension": ".fst"
    },
    {
        "mimetype": "image/vnd.fujixerox.edmics-mmr",
        "extension": ".mmr"
    },
    {
        "mimetype": "image/vnd.fujixerox.edmics-rlc",
        "extension": ".rlc"
    },
    {
        "mimetype": "image/vnd.ms-modi",
        "extension": ".mdi"
    },
    {
        "mimetype": "image/vnd.net-fpx",
        "extension": ".npx"
    },
    {
        "mimetype": "image/vnd.wap.wbmp",
        "extension": ".wbmp"
    },
    {
        "mimetype": "image/vnd.xiff",
        "extension": ".xif"
    },
    {
        "mimetype": "image/x-cmu-raster",
        "extension": ".ras"
    },
    {
        "mimetype": "image/x-cmx",
        "extension": ".cmx"
    },
    {
        "mimetype": "image/x-freehand",
        "extension": ".fh"
    },
    {
        "mimetype": "image/x-freehand",
        "extension": ".fh4"
    },
    {
        "mimetype": "image/x-freehand",
        "extension": ".fh5"
    },
    {
        "mimetype": "image/x-freehand",
        "extension": ".fh7"
    },
    {
        "mimetype": "image/x-freehand",
        "extension": ".fhc"
    },
    {
        "mimetype": "image/x-icon",
        "extension": ".ico"
    },
    {
        "mimetype": "image/x-pcx",
        "extension": ".pcx"
    },
    {
        "mimetype": "image/x-pict",
        "extension": ".pct"
    },
    {
        "mimetype": "image/x-pict",
        "extension": ".pic"
    },
    {
        "mimetype": "image/x-portable-anymap",
        "extension": ".pnm"
    },
    {
        "mimetype": "image/x-portable-bitmap",
        "extension": ".pbm"
    },
    {
        "mimetype": "image/x-portable-graymap",
        "extension": ".pgm"
    },
    {
        "mimetype": "image/x-portable-pixmap",
        "extension": ".ppm"
    },
    {
        "mimetype": "image/x-rgb",
        "extension": ".rgb"
    },
    {
        "mimetype": "image/x-xbitmap",
        "extension": ".xbm"
    },
    {
        "mimetype": "image/x-xpixmap",
        "extension": ".xpm"
    },
    {
        "mimetype": "image/x-xwindowdump",
        "extension": ".xwd"
    },
    {
        "mimetype": "text/calendar",
        "extension": ".ics"
    },
    {
        "mimetype": "text/calendar",
        "extension": ".ifb"
    },
    {
        "mimetype": "text/css",
        "extension": ".css"
    },
    {
        "mimetype": "text/csv",
        "extension": ".csv"
    },
    {
        "mimetype": "text/html",
        "extension": ".htm"
    },
    {
        "mimetype": "text/html",
        "extension": ".html"
    },
    {
        "mimetype": "text/plain",
        "extension": ".conf"
    },
    {
        "mimetype": "text/plain",
        "extension": ".def"
    },
    {
        "mimetype": "text/plain",
        "extension": ".diff"
    },
    {
        "mimetype": "text/plain",
        "extension": ".in"
    },
    {
        "mimetype": "text/plain",
        "extension": ".ksh"
    },
    {
        "mimetype": "text/plain",
        "extension": ".list"
    },
    {
        "mimetype": "text/plain",
        "extension": ".log"
    },
    {
        "mimetype": "text/plain",
        "extension": ".pl"
    },
    {
        "mimetype": "text/plain",
        "extension": ".text"
    },
    {
        "mimetype": "text/plain",
        "extension": ".txt"
    },
    {
        "mimetype": "text/prs.lines.tag",
        "extension": ".dsc"
    },
    {
        "mimetype": "text/richtext",
        "extension": ".rtx"
    },
    {
        "mimetype": "text/sgml",
        "extension": ".sgm"
    },
    {
        "mimetype": "text/sgml",
        "extension": ".sgml"
    },
    {
        "mimetype": "text/tab-separated-values",
        "extension": ".tsv"
    },
    {
        "mimetype": "text/troff",
        "extension": ".man"
    },
    {
        "mimetype": "text/troff",
        "extension": ".me"
    },
    {
        "mimetype": "text/troff",
        "extension": ".ms"
    },
    {
        "mimetype": "text/troff",
        "extension": ".roff"
    },
    {
        "mimetype": "text/troff",
        "extension": ".t"
    },
    {
        "mimetype": "text/troff",
        "extension": ".tr"
    },
    {
        "mimetype": "text/uri-list",
        "extension": ".uri"
    },
    {
        "mimetype": "text/uri-list",
        "extension": ".uris"
    },
    {
        "mimetype": "text/vnd.fly",
        "extension": ".fly"
    },
    {
        "mimetype": "text/vnd.fmi.flexstor",
        "extension": ".flx"
    },
    {
        "mimetype": "text/vnd.graphviz",
        "extension": ".gv"
    },
    {
        "mimetype": "text/x-c",
        "extension": ".c"
    },
    {
        "mimetype": "text/x-c",
        "extension": ".cc"
    },
    {
        "mimetype": "text/x-c",
        "extension": ".cpp"
    },
    {
        "mimetype": "text/x-c",
        "extension": ".cxx"
    },
    {
        "mimetype": "text/x-c",
        "extension": ".dic"
    },
    {
        "mimetype": "text/x-c",
        "extension": ".h"
    },
    {
        "mimetype": "text/x-c",
        "extension": ".hh"
    },
    {
        "mimetype": "text/x-fortran",
        "extension": ".f"
    },
    {
        "mimetype": "text/x-fortran",
        "extension": ".f77"
    },
    {
        "mimetype": "text/x-fortran",
        "extension": ".f90"
    },
    {
        "mimetype": "text/x-fortran",
        "extension": ".for"
    },
    {
        "mimetype": "text/x-java-source",
        "extension": ".java"
    },
    {
        "mimetype": "text/x-pascal",
        "extension": ".p"
    },
    {
        "mimetype": "text/x-pascal",
        "extension": ".pas"
    },
    {
        "mimetype": "text/x-python",
        "extension": ".py"
    },
    {
        "mimetype": "text/x-setext",
        "extension": ".etx"
    },
    {
        "mimetype": "text/x-uuencode",
        "extension": ".uu"
    },
    {
        "mimetype": "text/x-vcalendar",
        "extension": ".vcs"
    },
    {
        "mimetype": "text/x-vcard",
        "extension": ".vcf"
    },
    {
        "mimetype": "video/3gpp",
        "extension": ".3gp"
    },
    {
        "mimetype": "video/3gpp2",
        "extension": ".3g2"
    },
    {
        "mimetype": "video/h261",
        "extension": ".h261"
    },
    {
        "mimetype": "video/h263",
        "extension": ".h263"
    },
    {
        "mimetype": "video/h264",
        "extension": ".h264"
    },
    {
        "mimetype": "video/jpeg",
        "extension": ".jpgv"
    },
    {
        "mimetype": "video/jpm",
        "extension": ".jpgm"
    },
    {
        "mimetype": "video/jpm",
        "extension": ".jpm"
    },
    {
        "mimetype": "video/mj2",
        "extension": ".mj2"
    },
    {
        "mimetype": "video/mj2",
        "extension": ".mjp2"
    },
    {
        "mimetype": "video/mp4",
        "extension": ".mp4"
    },
    {
        "mimetype": "video/mp4",
        "extension": ".mp4v"
    },
    {
        "mimetype": "video/mp4",
        "extension": ".mpg4"
    },
    {
        "mimetype": "video/mpeg",
        "extension": ".m1v"
    },
    {
        "mimetype": "video/mpeg",
        "extension": ".m2v"
    },
    {
        "mimetype": "video/mpeg",
        "extension": ".mpa"
    },
    {
        "mimetype": "video/mpeg",
        "extension": ".mpe"
    },
    {
        "mimetype": "video/mpeg",
        "extension": ".mpeg"
    },
    {
        "mimetype": "video/mpeg",
        "extension": ".mpg"
    },
    {
        "mimetype": "video/ogg",
        "extension": ".ogv"
    },
    {
        "mimetype": "video/quicktime",
        "extension": ".mov"
    },
    {
        "mimetype": "video/quicktime",
        "extension": ".qt"
    },
    {
        "mimetype": "video/vnd.fvt",
        "extension": ".fvt"
    },
    {
        "mimetype": "video/vnd.mpegurl",
        "extension": ".m4u"
    },
    {
        "mimetype": "video/vnd.mpegurl",
        "extension": ".mxu"
    },
    {
        "mimetype": "video/vnd.ms-playready.media.pyv",
        "extension": ".pyv"
    },
    {
        "mimetype": "video/vnd.vivo",
        "extension": ".viv"
    },
    {
        "mimetype": "video/x-f4v",
        "extension": ".f4v"
    },
    {
        "mimetype": "video/x-fli",
        "extension": ".fli"
    },
    {
        "mimetype": "video/x-flv",
        "extension": ".flv"
    },
    {
        "mimetype": "video/x-m4v",
        "extension": ".m4v"
    },
    {
        "mimetype": "video/x-ms-asf",
        "extension": ".asf"
    },
    {
        "mimetype": "video/x-ms-asf",
        "extension": ".asx"
    },
    {
        "mimetype": "video/x-msvideo",
        "extension": ".avi"
    },
    {
        "mimetype": "video/x-ms-wm",
        "extension": ".wm"
    },
    {
        "mimetype": "video/x-ms-wmv",
        "extension": ".wmv"
    },
    {
        "mimetype": "video/x-ms-wmx",
        "extension": ".wmx"
    },
    {
        "mimetype": "video/x-ms-wvx",
        "extension": ".wvx"
    },
    {
        "mimetype": "video/x-sgi-movie",
        "extension": ".movie"
    },
    {
        "mimetype": "x-conference/x-cooltalk",
        "extension": ".ice"
    }
];