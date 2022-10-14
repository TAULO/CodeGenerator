const fs = require("fs");
const path = require("path");
let extensions = require("./util");
let folderPath = "../../../../" ;
let extfolderpath;


function checkFolder(extensionName){
    //check if extension is matching with any folderName
    extfolderpath = folderPath;
    
    for(let key in extensions){

        if(extensions[key].includes(extensionName) ){
            extfolderpath = `${extfolderpath}/${key}`;
            break;
        }
    }

    return fs.existsSync(extfolderpath);

}

function moveFile(fileName){
    //copy
    let sourceFilePath = `${folderPath}/${fileName}`;
    let desFilePath = `${extfolderpath}/${fileName}`;

    fs.copyFileSync(sourceFilePath,desFilePath ); 

    //del
    fs.unlinkSync(sourceFilePath);
    

}
function createFolder(){
    fs.mkdirSync(extfolderpath);
}


function sortFolder(folderPath){
    //get content of folderPath
    let content = fs.readdirSync(folderPath);
    for(let i =0;i<content.length;i++){
        //get extension of each file
        let extensionName = path.extname(content[i]);
        console.log(extensionName);
        let extensionFolderExist = checkFolder(extensionName);
        if(extensionFolderExist){
            moveFile(content[i]);
        }
        else{
            createFolder();
            moveFile(content[i]);
        }
    }
}

sortFolder(folderPath);
