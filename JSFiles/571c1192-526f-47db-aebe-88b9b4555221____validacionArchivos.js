$("input[type='file']").on("change", function () {
    if(this.files[0].size > 30000000) {
        toastr.error("Los archivos no deben pesar más de 30MB");
        $(this).val('');
    } else if(!extencionAceptada(this.files[0].name)){
        toastr.error("El formato del archivo no es aceptado");
        $(this).val('');
    }
});

function extencionAceptada(extension) {
    extension = extension.toLowerCase();
    if (extension.includes("pdf")) {
        return true 
    } else if (extension.includes("docx") || extension.includes("odt") || extension.includes("doc") ||  extension.includes("txt"))
        return true 
    else if (extension.includes("rar") || extension.includes("zip") || extension.includes("7z") || extension.includes("rar5"))
        return true 
    else if (extension.includes("xls") || extension.includes("xlsm") || extension.includes("xlsx") || extension.includes("ods") || extension.includes("csv")) 
        return true
    else if (extension.includes("pps") || extension.includes("ppt") || extension.includes("ppsx") || extension.includes("pptm") || extension.includes("potx") || extension.includes("pptx"))
        return true
    else if(extension.includes("jpg") || extension.includes("png") || extension.includes("svg") || extension.includes("jpeg"))
        return true

    return false
}