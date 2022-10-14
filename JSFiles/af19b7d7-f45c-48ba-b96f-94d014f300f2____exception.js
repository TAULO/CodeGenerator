function NoFileLoadedException() {
    
    this.name = "No File Loaded Exception.";
    this.message = "No file loaded: Cannot initiate parsing."
    
}

NoFileLoadedException.prototype.toString = toString;  

function WrongFileExtensionException(expectedExtension,selectedFileExtension) {
    
    this.expectedExtension = expectedExtension;
    this.selectedFileExtension = selectedFileExtension;
    this.name = "Wrong File Extension Exception.";
    this.message = "Wrong file extension: Cannot parse this file.\nThe selected file's extension is "+this.selectedFileExtension+".\nExpecting: "+this.expectedExtension+".";
}

WrongFileExtensionException.prototype.toString = toString;

function WrongFileFormatException(expression) {
    
    this.expression = expression
    this.name = "Wrong File Format Exception."
    this.message = "Wrong file format: the file does not contain the following expression: "+this.expression;
}

WrongFileFormatException.prototype.toString = toString;


function toString() {
    
    return this.message;
}


