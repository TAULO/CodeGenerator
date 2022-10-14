
var Data = {};

Data.retrieve = function(assetName, extension){
    var asset = undefined;
    // TODO allow assetName to be a string for loading as json,
    //  As well as loading an object through this.
    if(Lemonade.isAsset(assetName) == true)
        asset = assetName;
    else if(typeof assetName == "object"){
        asset = {};
        asset.data = assetName;
        asset.type = ASSET_OBJECT;
    }else
        asset = Lemonade.Repository.getAsset(assetName);
    if(asset !== undefined){
        if(asset.type == ASSET_FILE){
            // Use the asset data to load file from localStorage, into an object, then retrieve with extension.
            // TODO use localStorage web api to load a saved file. 
            // TODO allow local files and game files
            // Game files pertain to the game and should remain unchanged. 
        }else if(asset.type == ASSET_OBJECT || asset.type == ASSET_JSON_OBJECT){
            // Use the object to access with extension
            return Data.retrieveWithExtension(asset.data, extension);
        }else if(asset.type == ASSET_STRING){
            // use the string and convert to an object through json.
            var obj = JSON.parse(asset.data);
            asset.data = obj;
            return Data.retrieveWithExtension(asset.data, extenstion);
        }
    }
};

Data.retrieveWithExtension = function(object, extension){
    var extensionArray = [];
    for(var i=0;i<extension.length;i++){
        if(extension[i] == '.'){
            extensionArray.push(extension.substr(0, i));
            extension = extension.substr(i+1, extension.length-1);
            i =0;
        }
    }
    extensionArray.push(extension);
    return Data.recursiveExtension(object, extensionArray);
};
Data.recursiveExtension = function(object, extensionArray){
    if(extensionArray.length > 1){
        return Data.recursiveExtension(object[extensionArray[0]], extensionArray.splice(1, extensionArray.length-1));
    }
    return object[extensionArray[0]];
};