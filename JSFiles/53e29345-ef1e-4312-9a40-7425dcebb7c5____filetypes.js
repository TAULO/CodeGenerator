

 /**
 * File types defines the file types, its extension and mimetypes used in requests.
 * @typedef {Object} FileType
 * @property {String} extension - defines the file extension of file type.
 * @property {String} mime - defines the mime type used in requests.
 */

const Types = {
    avi:{
        extension : '.avi',
        mime : 'video/x-msvideo'
    },
    bmp:{
        extension : '.bmp',
        mime : 'image/bmp'
    },
    bz:{
        extension : '.bz',
        mime : 'application/x-bzip'
    },
    css:{
        extension : '.css',
        mime : 'text/css'
    },
    csv:{
        extension : '.csv',
        mime : 'text/csv'
    },
    doc:{
        extension : '.doc',
        mime : 'application/msword'
    },
    docx:{
        extension : '.docx',
        mime : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    epub:{
        extension : '.epub',
        mime : 'application/epub+zip'
    },
    gif:{
        extension : '.gif',
        mime : 'image/gif'
    },
    html:{
        extension : '.html',
        mime : 'text/html'
    },
   
    jpg :{
        extension : '.jpg',
        mime : 'image/jpg'
    },

    json:{
        extension : '.json',
        mime : 'application/json'
    },

    mpeg:{
        extension : '.mpeg',
        mime : 'video/mpeg'
    },
    png :{
        extension : '.png',
        mime : 'image/png'
    },
    
    pdf :{
        extension : '.pdf',
        mime : 'application/pdf'
    },
    txt:{
        extension : '.txt',
        mime : 'text/plain'
    },
}

module.exports = Types;