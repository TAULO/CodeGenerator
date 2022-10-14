class User{
    constructor(name) {
        this.name = name;
        this.userGroup = "User";
        this.passwordHash = null;
    }
    getUserPassHash(){
        return this.passwordHash;
    }
    getUserName(){
        return this.name;
    }
    getUserGroup(){
        return this.userGroup;
    }
    setPassWordHash(passWord){
        this.passwordHash = hashPassword(passWord);
    }
    isCorrectPassword(passWord){
        if(passWord === null){
            return false;
        }
        if(this.passwordHash){
            return this.passwordHash === hashPassword(passWord);
        }else{
            return true;
        }
    }
}

class RootUser extends User{
    constructor() {
        super()
        this.name = "root";
        this.userGroup = "root";
    }
}

class Dir{
    constructor(dirName=null, owner=null){
        this.dirName = dirName;
        this.subDirs = {};
        this.createdTime = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' });
        this.modifiedTime = this.createdTime;
        this.type = "dir"
        this.owner = owner;
        this.groupName = this.owner.getUserGroup();
        this.permission = ["d", "rwx", "rwx", "---"];
    }
    /*--------------set----------------*/
    setOwnerPermission(user){
        this.owner = user;
    }
    setGroupPermission(name){
        this.groupName = name;
    }
    /*--------------get----------------*/
    getOwnerPermission(){
        return this.permission[1];
    }
    getGroupPermission(){
        return this.permission[2];
    }
    getOtherPermission(){
        return this.permission[3];
    }
    getAllPermission(){
        return this.permission.join("");
    }
    getType(){
        return this.type;
    }
    getName(){
        return this.dirName;
    }
    getOwnerName(){
        return this.owner.getUserName();
    }
    getOwner(){
        return this.owner;
    }
    getGroupName(){
        return this.groupName;
    }
    getCreatedTime(){
        return this.createdTime;
    }
    getModifiedTime(){
        return this.modifiedTime;
    }
    getSubDirMap(){
        return this.subDirs;
    }
    getSubDir(dirName){
        return this.subDirs[dirName];
    }

    /*-------------command----------------*/
    //subdirectoryを除いて、ディープコピー
    copyDirExceptSubDir(){
        let newDir = new Dir(this.dirName, this.owner);
        newDir.dirName = this.dirName;
        newDir.subDirs = {};
        newDir.createdTime = this.createdTime;
        newDir.modifiedTime = this.modifiedTime;
        newDir.type = this.type;
        newDir.owner = this.owner;
        newDir.groupName = this.groupName;
        newDir.permission = this.permission;
        return newDir;
    }

    changePermission(numString){
        let converter = {"0":"---", "1":"--x", "2":"-w-", "3":"-wx", "4":"r--","5":"r-x","6":"rw-","7":"rwx"}
        for(let i = 0; i < 3; i++){
            this.permission[i+1] = converter[numString[i]];
        }
    }
    stampModifiedTime(){
        this.modifiedTime = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' });
    }
    createNewFile(fileName, owner, fileExtension){
        this.subDirs[fileName] = new TextFile(fileName, owner, fileExtension);
    }
    createNewDir(dirName, owner){
        this.subDirs[dirName] = new Dir(dirName, owner);
    }
    hasDir(name){
        return name in this.subDirs;
    }
}

class TextFile{
    constructor(fileName=null, owner=null, fileExtension = "" ){
        this.fileName = fileName;
        this.subDirs = {};
        this.createdTime = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' });
        this.modifiedTime = this.createdTime;
        this.type = "file";
        this.fileExtension = fileExtension;
        this.owner = owner;
        this.groupName = this.owner.getUserGroup();
        this.permission = ["-", "rwx", "rwx", "rwx"];
        this.textData = "";
    }
    getFileExtension(){
        return this.fileExtension;
    }
    getOwnerPermission(){
        return this.permission[1];
    }
    getGroupPermission(){
        return this.permission[2];
    }
    getOtherPermission(){
        return this.permission[3];
    }
    getAllPermission(){
        return this.permission.join("");
    }
    getType(){
        return this.type;
    }
    getName(){
        return this.fileName;
    }
    getOwnerName(){
        return this.owner.getUserName();
    }
    getOwner(){
        return this.owner;
    }

    getCreatedTime(){
        return this.createdTime;
    }
    getModifiedTime(){
        return this.modifiedTime;
    }
    getGroupName(){
        return this.groupName;
    }
    getTextData(){
        return this.textData;
    }
    setFileExtension(fileExtension){
        this.fileExtension = fileExtension;
    }
    changePermission(number){
        let converter = {"0":"---", "1":"--x", "2":"-w-", "3":"-wx", "4":"r--","5":"r-x","6":"rw-","7":"rwx"}
        for(let i = 0; i < 3; i++){
            this.permission[i+1] = converter[String(number)[i]];
        }
    }
    stampModifiedTime(){
        this.modifiedTime = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' });
    }
    editText(data){
        this.textData = data;
    }

    copyDirExceptSubDir(){
        let newFile = new TextFile(this.fileName, this.owner, this.fileExtension)
        newFile.fileName = this.fileName;
        newFile.createdTime = this.createdTime;
        newFile.modifiedTime = this.modifiedTime;
        newFile.type = this.type;
        newFile.fileExtension = this.fileExtension;
        newFile.owner = this.owner;
        newFile.groupName = this.groupName;
        newFile.permission = this.permission;
        newFile.textData = this.textData;
        return newFile;
    }
}

class FileSystem{
    constructor(){
        this.rootUser = new RootUser();
        this.users = {"root": this.rootUser};
        this.currentUser = this.rootUser;
        this.rootDir = new Dir("rootDir", this.rootUser);
        this.path = [this.rootDir];

        //初期のdirectory設定
        this.rootDir.createNewDir("home", this.rootUser);
        this.rootDir.createNewDir("usr", this.rootUser);
        this.rootDir.createNewFile("help", this.rootUser);
        this.rootDir.getSubDir("usr").createNewDir("local", this.rootUser);
        this.rootDir.getSubDir("usr").createNewDir("src", this.rootUser);
        this.rootDir.getSubDir("usr").createNewDir("tmp", this.rootUser);
        this.rootDir.getSubDir("usr").createNewDir("var", this.rootUser);
        this.rootDir.getSubDir("usr").createNewDir(".secret", this.rootUser);
        this.rootDir.getSubDir("usr").getSubDir("src").createNewFile("test", this.rootUser);
        this.rootDir.getSubDir("usr").getSubDir("local").createNewDir("bin", this.rootUser);
        this.rootDir.getSubDir("usr").getSubDir("local").getSubDir("bin").createNewFile("test", this.rootUser);
        this.rootDir.getSubDir("usr").getSubDir("local").createNewFile("textFile", this.rootUser, "txt");
        this.rootDir.getSubDir("usr").getSubDir("local").createNewFile("dataFile", this.rootUser, "data");
        this.rootDir.getSubDir("usr").getSubDir("local").createNewFile("noExtensionFile", this.rootUser);
        this.rootDir.getSubDir("usr").getSubDir(".secret").createNewFile(".test1", this.rootUser);
        this.rootDir.getSubDir("usr").getSubDir(".secret").createNewFile("test2", this.rootUser);
        this.rootDir.getSubDir("usr").getSubDir(".secret").createNewFile(".test3", this.rootUser, "txt");
        this.rootDir.getSubDir("usr").getSubDir(".secret").createNewFile("test4", this.rootUser, "txt");
    }

    /*-------------get----------------*/
    getUser(name){
        return this.users[name];
    }
    getCurrentDir(){
        return this.path[this.path.length - 1];
    }

    /*-------------bool型----------------*/
    isRootUser(){
        return this.currentUser === this.rootUser;
    }
    userExists(name){
        if(this.users[name]) return true;
        else return false;
    }
    groupExists(groupName){
        return Object.values(this.users).filter(user => user.getUserGroup() === groupName).length > 0;
    }

    /*-------------command----------------*/
    touchFile(dirPath, newFileName, fileExtension){
        let targetDir;
        if(dirPath.length !== 0){
            let tmpArray = this.convertRelativePathToAbsolutePath(dirPath)["dirPath"];
            targetDir = tmpArray[tmpArray.length-1];
        }else{
            targetDir = this.path[this.path.length-1];
        }
        targetDir.createNewFile(newFileName, this.currentUser, fileExtension);
    }
    changeDirPermission(dirPath, numString){
        let tmpArray = this.convertRelativePathToAbsolutePath(dirPath)["dirPath"];
        let targetDir = tmpArray[tmpArray.length-1];
        targetDir.changePermission(numString);
    }
    changeDirOwner(dirPath, name, type){
        let tmpArray = this.convertRelativePathToAbsolutePath(dirPath)["dirPath"];
        let targetDir = tmpArray[tmpArray.length-1];
        if(type === "owner") targetDir.setOwnerPermission(this.users[name]);
        if(type === "group") targetDir.setGroupPermission(name);
    }
    getListSegment(dirPath=null, option = null){
        let targetDir;
        if(dirPath){
            let tmpArray = this.convertRelativePathToAbsolutePath(dirPath)["dirPath"];
            targetDir = tmpArray[tmpArray.length-1];
        }else{
            targetDir = this.path[this.path.length-1];
        }
        let dirConfigMap = {"name":[], "owner":[], "createdTime":[], "modifiedTime":[], "type":[], "group":[], "permission":[]}
        let dirMap = targetDir.getSubDirMap();
        for(let dirName in dirMap) {
            let dirObj = dirMap[dirName];
            if(option.includes("l")){//詳細情報
                if(option.includes("a")){ //隠しファイル
                    dirConfigMap["permission"].push(dirObj.getAllPermission());
                    dirConfigMap["owner"].push(dirObj.getOwnerName());
                    dirConfigMap["group"].push(dirObj.getGroupName());
                    dirConfigMap["createdTime"].push(dirObj.getCreatedTime());
                    dirConfigMap["modifiedTime"].push(dirObj.getModifiedTime());
                    dirConfigMap["name"].push(dirObj.getName());
                    dirConfigMap["type"].push(dirObj.getType());
                }else{
                    if(dirObj.getName()[0] !== "."){
                        dirConfigMap["permission"].push(dirObj.getAllPermission());
                        dirConfigMap["owner"].push(dirObj.getOwnerName());
                        dirConfigMap["group"].push(dirObj.getGroupName());
                        dirConfigMap["createdTime"].push(dirObj.getCreatedTime());
                        dirConfigMap["modifiedTime"].push(dirObj.getModifiedTime());
                        dirConfigMap["name"].push(dirObj.getName());
                        dirConfigMap["type"].push(dirObj.getType());
                    }
                }
            }else{
                if(option.includes("a")){ //隠しファイル
                    dirConfigMap["name"].push(dirObj.getName());
                }else{
                    if(dirObj.getName()[0] !== ".")dirConfigMap["name"].push(dirObj.getName());
                }
            }
        }
        return dirConfigMap;
    }
    login(userName){
        this.currentUser = this.users[userName];
        this.path = this.shortCutDirPath(userName);
    }

    //dirPathはString型のDirNameのPath
    createNewDir(dirNameAry){
        let path = this.path.concat();
        let dirItr = this.path.concat();
        switch (dirNameAry[0]) {
            case ".":
                dirItr = path[path.length-1];
                break;
            case "..":
                dirItr = path[path.length-2];
                break;
            case "~":
                dirItr = this.shortCutDirPath(this.currentUser.getUserName());
                break;
            case undefined:
                dirItr = [this.rootDir];
                break;
            case "":
                dirItr = [this.rootDir];
                break;
            default:
                dirItr = this.path[this.path.length-1];
                if(dirNameAry[0] in dirItr.subDirs){
                    dirItr = dirItr.subDirs[dirNameAry[0]];
                }else{
                    dirItr.createNewDir(dirNameAry[0], this.currentUser);
                    dirItr = dirItr.subDirs[dirNameAry[0]];
                    dirItr.stampModifiedTime();
                }
                break;
        }
        for(let i = 1; i < dirNameAry.length; i++){
            if(dirNameAry[i] in dirItr.subDirs){
                dirItr = dirItr.subDirs[dirNameAry[i]];
            }else{
                dirItr.createNewDir(dirNameAry[i], this.currentUser);
                dirItr = dirItr.subDirs[dirNameAry[i]];
                dirItr.stampModifiedTime();
            }
        }
    }

    changeCurrentDir(dirPath){
        this.path = this.convertRelativePathToAbsolutePath(dirPath)["dirPath"];
        return this.path[this.path.length - 1]
    }

    printWorkingDirectory(){
        let pwdNameList = [];
        for(let i = 1; i < this.path.length; i++) {
            pwdNameList.push(this.path[i].getName());
        }
        return pwdNameList;
    }


    createNewUser(userName){
        let newUser = new User(userName);
        this.users[userName] = newUser ;
        this.rootDir.subDirs["home"].createNewDir(userName,newUser);
        this.rootDir.subDirs["home"].subDirs[userName].createNewDir("img",newUser);
        this.rootDir.subDirs["home"].subDirs[userName].createNewDir("documents",newUser);
    }

    getCurrentUser(){
        return this.currentUser;
    }

    moveDir(targetDirPath, destinationDirPath){
        let targetAbsolutePath = this.convertRelativePathToAbsolutePath(targetDirPath);
        let destinationAbsolutePath = this.convertRelativePathToAbsolutePath(destinationDirPath)
        let targetDir = targetAbsolutePath["dirPath"][targetAbsolutePath["dirPath"].length-1];
        let targetDirParent = targetAbsolutePath["dirPath"][targetAbsolutePath["dirPath"].length-2];
        let destinationDir = destinationAbsolutePath["dirPath"][destinationAbsolutePath["dirPath"].length-1];
        if(targetAbsolutePath["isAllSubDir"]){
            for(let subDirName in targetDir.subDirs){
                destinationDir.subDirs[subDirName] = targetDir.subDirs[subDirName];
                destinationDir.stampModifiedTime();
                delete targetDir.subDirs[subDirName];
            }
        }else{
            let targetDirName = targetDir.getName();
            destinationDir.subDirs[targetDirName] = targetDirParent.subDirs[targetDirName];
            destinationDir.stampModifiedTime();
            delete targetDirParent.subDirs[targetDirName];
        }
    }

    copy(targetDirPath, destinationDirPath){
        let targetAbsolutePath = this.convertRelativePathToAbsolutePath(targetDirPath);
        let destinationAbsolutePath = this.convertRelativePathToAbsolutePath(destinationDirPath);
        let targetDir = targetAbsolutePath["dirPath"][targetAbsolutePath["dirPath"].length-1];
        let targetDirParent = targetAbsolutePath["dirPath"][targetAbsolutePath["dirPath"].length-2];
        let destinationDir = destinationAbsolutePath["dirPath"][destinationAbsolutePath["dirPath"].length-1];


        if(targetAbsolutePath["isAllSubDir"]){
            this.copyHelper(targetDir, destinationDir)
            destinationDir.stampModifiedTime();
            // }
        }else{
            let targetDirName = targetDir.getName();
            let copiedDir = targetDir.copyDirExceptSubDir();
            destinationDir.subDirs[targetDirName] = copiedDir;
            if(copiedDir.getType() === "dir") this.copyHelper(targetDir, copiedDir);
        }

    }

    copyHelper(dir, newDir){
        if(dir !== null){
            for(let subDirName in dir.subDirs){
                let copiedDir = dir.subDirs[subDirName].copyDirExceptSubDir();
                newDir.subDirs[subDirName] = copiedDir;
                this.copyHelper(dir.subDirs[subDirName], newDir.subDirs[subDirName])
            }
        }
    }

    removeDir(dirPath){
        let tmp = this.convertRelativePathToAbsolutePath(dirPath);
        dirPath = tmp["dirPath"];
        let isAllSubDir = tmp["isAllSubDir"];
        if(isAllSubDir){
            let currentDir = dirPath.pop()
            currentDir.subDirs = {};
        }else{
            let dirName = dirPath.pop().getName();
            let currentDir = dirPath.pop();
            delete currentDir.subDirs[dirName];
            currentDir.stampModifiedTime();
        }
        // if(dirPath !== [this.rootDir])

    }
    convertRelativePathToAbsolutePath(dirPath){
        let path = this.path.concat();
        let isAllSubDir = false;
        switch (dirPath[0]) {
            case ".":
                break;
            case "..":
                if(path[path.length-1] !== this.rootDir)path.pop();
                break;
            case "~":
                path = this.shortCutDirPath(this.currentUser.getUserName());
                break;
            case undefined:
                path = [this.rootDir];
                break;
            case "":
                path = [this.rootDir];
                break;
            default:
                let currentDir = this.path[this.path.length - 1];
                path.push(currentDir.subDirs[dirPath[0]]);
                break;
        }
        for(let i=1; i<dirPath.length; i++){
            let dir = dirPath[i];
            switch (dir) {
                case "":
                    isAllSubDir = true;
                    break;
                default:
                    let currentDir = path[path.length - 1];
                    path.push(currentDir.subDirs[dir]);
                    break;
            }
        }
        return {"dirPath" : path, "isAllSubDir":isAllSubDir}
    }

    shortCutDirPath(dirName){
        let currentDir = this.path[this.path.length - 1];
        let path = this.path;
        switch (dirName){
            case this.currentUser.getUserName():
                let userName = this.currentUser.getUserName()
                let home = this.rootDir.getSubDir("home");
                if(userName === "root") path = [this.rootDir, home];
                else path = [this.rootDir, home, home.getSubDir(this.currentUser.getUserName())]
                currentDir = this.path[this.path.length - 1];

                break;
        }
        return path;
    }
    dirPermission(dirPath, type){
        let targetDir;
        if(dirPath){
            let tmpArray = this.convertRelativePathToAbsolutePath(dirPath)["dirPath"];
            targetDir = tmpArray[tmpArray.length-1];
        }else{
            targetDir = this.path[this.path.length-1];
        }
        if(this.currentUser === targetDir.getOwner()){
            return targetDir.getOwnerPermission().includes(type);
        }else if(this.currentUser.getUserGroup() === targetDir.getGroupName()){
            return targetDir.getGroupPermission().includes(type);
        }else{
            return targetDir.getOtherPermission().includes(type);
        }
    }

    bottomLayerDir(dirPath) {
        let path = this.path.concat();
        switch (dirPath[0]) {
            case ".":
                break;
            case "..":
                if(path[path.length-1] !== this.rootDir)path.pop();
                else return false;
                break;
            case "~":
                path = this.shortCutDirPath(this.currentUser.getUserName());
                break;
            case "":
                path = [this.rootDir];
                break;
            default:
                let currentDir = this.path[this.path.length - 1];
                if(dirPath[0] in currentDir.subDirs) path.push(currentDir.subDirs[dirPath[0]]);
                else return false;
                break;
        }

        for(let i=1; i<dirPath.length; i++){
            let dir = dirPath[i];
            switch (dir) {
                case "":
                    if (dirPath.length == 2) return path[path.length - 1];
                    else return false;
                default:
                    let currentDir = path[path.length - 1];
                    if(dir in currentDir.subDirs)　path.push(currentDir.subDirs[dir]);
                    else return path[path.length - 1];
            }

        }
        return path[path.length - 1];
    }
    isAvailablePath(dirPath) {
        let path = this.path.concat();
        switch (dirPath[0]) {
            case ".":
                break;
            case "..":
                if(path[path.length-1] !== this.rootDir)path.pop();
                else return false;
                break;
            case "~":
                path = this.shortCutDirPath(this.currentUser.getUserName());
                break;
            case undefined:
                path = [this.rootDir];
                break;
            case "":
                path = [this.rootDir];
                break;
            default:
                let currentDir = this.path[this.path.length - 1];
                if(dirPath[0] in currentDir.subDirs) path.push(currentDir.subDirs[dirPath[0]]);
                else return false;
                break;
        }

        for(let i=1; i<dirPath.length; i++){
            let dir = dirPath[i];
            switch (dir) {
                case "":
                    if (dirPath.length == 2) return true;
                    else return false;
                default:
                    let currentDir = path[path.length - 1];
                    if(dir in currentDir.subDirs)　path.push(currentDir.subDirs[dir]);
                    else return false
            }

        }
        return true;
    }




    printTree(dir){
        if(dir){
            let tmpArray = this.convertRelativePathToAbsolutePath(dir)["dirPath"];
            dir = tmpArray[tmpArray.length-1];
        }else{
            dir = this.path[this.path.length - 1];
        }
        let tree = `<p></p>`;
        let depth = -1;
        let ans;
        let isLastIndex = false;
        this.printTreeHelper(dir, ans=[], depth, isLastIndex)
        let isNotNeedLine = [true];//ラインが必要かどうか
        for(let i=1; i < ans.length; i++){
            let depth = ans[i][1];
            let isLastIndex = ans[i][2];
            let text="";
            if(isNotNeedLine.length-2 < depth) isNotNeedLine.push(false);
            isNotNeedLine[depth] = isLastIndex;
            for (let j = 0; j < depth; j ++){
                if (!isNotNeedLine[j])text += "｜　"
                else text += "　　"
            }
            if(ans[i][2]) tree +=`<p>${text + " └─" + ans[i][0]}</p>`  //console.log(text + " └─" + ans[i][0] + "/n")
            else tree += `<p>${(text + " ├─" + ans[i][0] )}</p>`;
        }
        return tree;
    }

    printTreeHelper(dir, ans, depth, isLastIndex){
        if(dir !== null){
            if(dir.getType() === "dir"){
                if(dir.getName()[0] === "."){
                    ans.push([`<span class="hidden-color">${dir.getName()}</span>`,depth,isLastIndex]);
                }else{
                    ans.push([dir.getName(),depth,isLastIndex]);
                }
            }else{
                let extension = dir.getFileExtension();
                let dot;
                if(extension !== "") dot = "."
                else dot = ""
                if(dir.getName()[0] === "."){
                    ans.push([`<span class="${extension}-color hidden-color">${dir.getName() + dot + extension}</span>`, depth, isLastIndex]);
                }else{
                    ans.push([`<span class="${extension}-color">${dir.getName() +  dot   + extension}</span>`, depth, isLastIndex]);
                }

            }
            depth ++;
            let index = 0;
            for(let subDirName in dir.subDirs){
                isLastIndex = Object.keys(dir.subDirs).length - 1 == index;
                this.printTreeHelper(dir.subDirs[subDirName], ans, depth, isLastIndex);
                index ++;
            }

        }
    }
    isAvailablePermissionNum(num){
        let converter = {"0":"---", "1":"--x", "2":"-w-", "3":"-wx", "4":"r--","5":"r-x","6":"rw-","7":"rwx"}
        let numString = String(num);
        if(numString.length !== 3) return false;
        for(let i = 0; i < 3; i++){
            if(!(numString[i] in converter)) return false;
        }
        return true;
    }
}

class FileSystemConsole{
    /*--------------parser----------------*/
    static commandLineParser(CLIInputString){
        let preParsedStringInputArray = CLIInputString.trim().split(" ");
        let command = preParsedStringInputArray[0];
        let commandOption = [];
        let args = [];
        for(let i = 1; i < preParsedStringInputArray.length ;i++){
            if(preParsedStringInputArray[i][0] === "-"){
                for(let j = 1; j < preParsedStringInputArray[i].length; j++)
                    commandOption.push(preParsedStringInputArray[i][j]);
            }else{
                args.push(preParsedStringInputArray[i])
            }
        }
        return {"command":command, "commandOption":commandOption, "args":args};
    }
    static pathParser(args){
        if(!args) return null;
        else if(args.includes("/")) return args.split("/");
        else return [args];
    }

    /*--------------Validator----------------*/
    static parsedArrayValidator(command, commandOption, args){
        let validatorResponse = FileSystemConsole.universalValidator(command, commandOption, args);
        if(!validatorResponse["isValid"]) return validatorResponse;
        validatorResponse = FileSystemConsole.commandArgumentsValidator(command, commandOption, args);
        if(!validatorResponse["isValid"]) return validatorResponse;
        return {"isValid": true, "errorMessage": ""};
    }
    static universalValidator(command, commandOption, args){
        return {"isValid": true, "errorMessage": ""}
    }
    static exceptForCommandInputValidator(command, commandOption, args, inputData){
        return {"isValid": true, "errorMessage": ""};
    }

    static commandArgumentsValidator(command, commandOption, argsArray){
        let commandArgNum = {"ls":[0,1], "pwd":[0], "touch":[1], "tree":[0,1],"mkdir":[1], "cd":[1], "print":[1],
            "setContent":[1], "rm":[1], "adduser":[1], "login":[1], "mv":[2], "cp":[2], "help":[0,1], "passwd":[0,1],
            "logout":[0],"chmod":[2],"chown":[2]};
        if(command ===  ""){
            return {"isValid": false, "errorMessage": "Type command"};
        }
        if (!(command in commandArgNum)){
            return {"isValid": false, "errorMessage": "no supports command"};
        }
        if (!(commandArgNum[command].includes(argsArray.length))){
            return {"isValid": false, "errorMessage": `command ${command} requires exactly ${commandArgNum[command].join(",")} argument`};
        }
        if(argsArray.length === 0){
            return FileSystemConsole.noArgValidator(command, commandOption, argsArray);
        }
        if(argsArray.length === 1){
            return FileSystemConsole.singleArgValidator(command, commandOption, argsArray);
        }
        if(argsArray.length === 2){
            return FileSystemConsole.doubleArgValidator(command, commandOption, argsArray);
        }
        if(argsArray.length >= 3){
            return {"isValid": false, "errorMessage": `Too many arguments`};
        }
        return  {"isValid": false, "errorMessage": "unknown error"};
    }

    static noArgValidator(command, commandOption, args){
        return {"isValid": true, "errorMessage": ""};
    }
    static singleArgValidator(command, commandOption, args){
        if(command === "tree"){
            if(!fileSystem.isAvailablePath(FileSystemConsole.pathParser(args[0]))){
                return {"isValid": false, "errorMessage": `No such file or directory`};
            }
            if(!fileSystem.dirPermission(FileSystemConsole.pathParser(args[0]), "r")){
                return {"isValid": false, "errorMessage": `permission denied`};
            }
        }

        if(command === "ls"){
            if(!fileSystem.isAvailablePath(FileSystemConsole.pathParser(args[0]))){
                return {"isValid": false, "errorMessage": `No such file or directory`};
            }
            if(!fileSystem.dirPermission(FileSystemConsole.pathParser(args[0]), "r")){
                return {"isValid": false, "errorMessage": `permission denied`};
            }
        }
        if(command === "touch"){
            let pathArray = FileSystemConsole.pathParser(args[0]);
            let newFile = pathArray.pop();
            if(!fileSystem.isAvailablePath(pathArray)){
                return {"isValid": false, "errorMessage": `No such file or directory`};
            }
            let tmpDirArray = fileSystem.convertRelativePathToAbsolutePath(pathArray)["dirPath"];
            let parentDir = tmpDirArray[tmpDirArray.length - 1];
            if(newFile in parentDir.subDirs){
                if(parentDir.getSubDir(newFile).getType() === "dir"){
                    return {"isValid": false, "errorMessage": `the same name directory in the directory`};
                }
            }

        }
        if(command === "mkdir"){
            if(!fileSystem.dirPermission(fileSystem.bottomLayerDir(FileSystemConsole.pathParser(args[0])), "w")){
                return {"isValid": false, "errorMessage": `permission denied`};
            }
        }
        if(command === "cd"){
            if(!fileSystem.isAvailablePath(FileSystemConsole.pathParser(args[0]))) {
                return {"isValid": false, "errorMessage": `No such file or directory`};
            }
            if(!fileSystem.dirPermission(FileSystemConsole.pathParser(args[0]), "x")){
                return {"isValid": false, "errorMessage": `permission denied`};
            }
        }
        if(command === "print"){
            if(!fileSystem.isAvailablePath(FileSystemConsole.pathParser(args[0]))) {
                return {"isValid": false, "errorMessage": `No such file or directory`};
            }
            if(!fileSystem.dirPermission(FileSystemConsole.pathParser(args[0]), "r")){
                return {"isValid": false, "errorMessage": `permission denied`};
            }
        }
        if(command === "rm"){
            if(!fileSystem.isAvailablePath(FileSystemConsole.pathParser(args[0]))){
                return {"isValid": false, "errorMessage": `No such file or directory`};
            }
            if(!fileSystem.dirPermission(FileSystemConsole.pathParser(args[0]), "w")){
                return {"isValid": false, "errorMessage": `permission denied`};
            }
        }
        if(command === "adduser"){
            if (fileSystem.userExists(args[0])) {
                return {"isValid": false, "errorMessage": `${args[0]} is already in use`};
            }
            if (!fileSystem.isAvailablePath(FileSystemConsole.pathParser("/home"))){
                return {"isValid": false, "errorMessage": `Not found home directory`};
            }
            if (fileSystem.isAvailablePath(FileSystemConsole.pathParser(`/home/${args[0]}`))){
                return {"isValid": false, "errorMessage": `${args[0]} directory is already in home directory`};
            }
        }
        if(command === "passwd"){
            if (!fileSystem.userExists(args[0])) {
                return {"isValid": false, "errorMessage": `${args[0]} dose not exist`};
            }
        }
        if(command === "login"){
            if (!fileSystem.userExists(args[0])) {
                return {"isValid": false, "errorMessage": `${args[0]} dose not exist`};
            }

        }
        if(command === "help" && !Help.isAvailableCommand(args[0])){
            return {"isValid": false, "errorMessage": `${args[0]} is not supported. Type "help".`};
        }

        return {"isValid": true, "errorMessage": ""};
    }

    static doubleArgValidator(command, commandOption, args){
        if(command === "mv" ){
            if(!fileSystem.isAvailablePath(FileSystemConsole.pathParser(args[0]))){
                return {"isValid": false, "errorMessage": `No such file or directory`};
            }
            if(!fileSystem.isAvailablePath(FileSystemConsole.pathParser(args[1]))){
                return {"isValid": false, "errorMessage": `No such file or directory`};
            }
        }
        if(command === "cp" ){
            if(!fileSystem.isAvailablePath(FileSystemConsole.pathParser(args[0]))){
                return {"isValid": false, "errorMessage": `No such file or directory`};
            }
            if(!fileSystem.isAvailablePath(FileSystemConsole.pathParser(args[1]))){
                return {"isValid": false, "errorMessage": `No such file or directory`};
            }
        }
        if(command === "chmod" ){
            if(!fileSystem.isAvailablePermissionNum(FileSystemConsole.pathParser(args[0]))){
                return {"isValid": false, "errorMessage": `wrong permission num`};
            }
            if(!fileSystem.isAvailablePath(FileSystemConsole.pathParser(args[1]))){
                return {"isValid": false, "errorMessage": `No such file or directory`};
            }
            if(!fileSystem.isRootUser()){
                return {"isValid": false, "errorMessage": `Only available as root user`};
            }
        }
        if(command === "chown"){
            let userName = "";
            let groupName = "";
            if(args[0].includes(":")){
                userName = FileSystemConsole.pathParser(args[0])[0].split(":")[0];
                groupName = FileSystemConsole.pathParser(args[0])[0].split(":")[1];
            }else{
                userName = FileSystemConsole.pathParser(args[0])[0];
            }
            if(userName !== "" && !fileSystem.userExists(userName)){
                return {"isValid": false, "errorMessage": `${userName} dose not exist`};
            }
            if(groupName !== "" && !fileSystem.groupExists(groupName)){
                return {"isValid": false, "errorMessage": `${groupName} dose not exist`};
            }
            if(userName === "" && groupName === "") {
                return {"isValid": false, "errorMessage": `The username has not been specified.`};
            }
            if(!fileSystem.isAvailablePath(FileSystemConsole.pathParser(args[1]))){
                return {"isValid": false, "errorMessage": `No such file or directory`};
            }
            if(!fileSystem.isRootUser()){
                return {"isValid": false, "errorMessage": `Only available as root user`};
            }
        }
        return {"isValid": true, "errorMessage": ""};
    }


    /*--------------echo----------------*/
    static appendEchoParagraph(parentDiv){
        parentDiv.innerHTML+=
            `<p class="m-0">
                <span style='color:lawngreen'>${fileSystem.getCurrentUser().getUserName()}</span>
                <span style='color:yellow'>@</span>
                <span style='color:lightskyblue'>${fileSystem.getCurrentUser().getUserGroup() + ":"}</span>
                <span style='color:lightskyblue'>${"/" + fileSystem.printWorkingDirectory().join("/") + "$"}</span>
                : ${CLITextInput.value}
            </p>`;
    }
    static appendResultParagraph(parentDiv, isValid, message){
        let promptName = "";
        let promptColor = "";
        if(isValid){
            promptName = "";
            promptColor = "turquoise";
        }
        else{
            promptName = "Error";
            promptColor = "red";
        }
        parentDiv.innerHTML+=
            `<p class="m-0">
                    <span style='color: ${promptColor}'>${promptName}</span>: ${message}
                </p>`;
    }

    /*--------------result----------------*/
    static evaluatedResultsStringFromParsedCLIArray(command, commandOption, args, inputData = null){
        let result = "";
        if (command === "ls"){
            let pathArray;
            let dirConfigMap;
            if(args[0]){
                pathArray = FileSystemConsole.pathParser(args[0]);
                dirConfigMap = fileSystem.getListSegment(pathArray, commandOption);
            }
            else dirConfigMap = fileSystem.getListSegment(null, commandOption);
            if(commandOption.includes("l")){
                result = `
                    <table>
                    <tr>
                       <th class="px-3">Permission</th>
                       <th class="px-3">Owner</th>
                       <th class="px-3">Group</th>
                       <th class="px-3">Modified</th>
                       <th class="px-3">DirName</th>
                       <th class="px-3">Type</th>
                    </tr>`
                for(let i = 0; i < dirConfigMap["name"].length; i++){
                    result += `
                    <tr>
                        <th class="px-3">${dirConfigMap["permission"][i]}</th>
                        <th class="px-3">${dirConfigMap["owner"][i]}</th>
                        <th class="px-3">${dirConfigMap["group"][i]}</th>
                        <th class="px-3">${dirConfigMap["modifiedTime"][i]}</th>
                        <th class="px-3">${dirConfigMap["name"][i]}</th> 
                        <th class="px-3">${dirConfigMap["type"][i]}</th>
                    </tr>`
                }
                result += `</table>`;
            }else{
                result = dirConfigMap["name"].join(",");
            }
        }
        if (command === "touch"){
            let pathArray = FileSystemConsole.pathParser(args[0]);
            let newFileName = pathArray.pop();
            console.log(pathArray)
            console.log(newFileName)
            //隠しファイルかどうか
            if(newFileName[0] === "."){
                let newFileNameArray = newFileName.split(".");
                //拡張子があるか
                if(newFileNameArray.length !== 2){
                    let fileExtension = newFileNameArray.pop();
                    newFileName = newFileNameArray.join(".")
                    // pathArray = newFileNameArray.join();
                    fileSystem.touchFile(pathArray, newFileName, fileExtension);
                }else{
                    fileSystem.touchFile(pathArray, newFileName, "");
                }
            }else{
                //拡張子があるか
                if(newFileName.includes(".")){
                    let newFileNameArray = newFileName.split(".");
                    let fileExtension = newFileNameArray.pop();
                    newFileName = newFileNameArray.join(".")
                    fileSystem.touchFile(pathArray, newFileName, fileExtension);
                }else{
                    fileSystem.touchFile(pathArray, newFileName, "");
                }
            }
        }
        if (command === "mkdir"){
            let pathArray = FileSystemConsole.pathParser(args[0]);
            fileSystem.createNewDir(pathArray);
        }
        if (command === "cd"){
            let pathArray = FileSystemConsole.pathParser(args[0]);
            fileSystem.changeCurrentDir(pathArray);
        }
        if (command === "pwd"){
            result = "/" + fileSystem.printWorkingDirectory().join("/");
        }
        if (command === "adduser"){
            if(fileSystem.isRootUser())fileSystem.createNewUser(args[0]);
            else result = "This command is root only. "

        }
        if (command === "logout"){
            fileSystem.login("root")
        }
        if (command === "login"){
            let user = fileSystem.getUser(args[0]);
            if(user.getUserPassHash() === null){
                fileSystem.login(args[0]);
            }else{
                if (history.getInputData().length === 0){
                    result = `type password`
                    history.setProcess(command, commandOption, args, inputData)
                }else if(history.getInputData().length === 1){
                    if(user.isCorrectPassword(inputData)){
                        result = `success`
                        fileSystem.login(args[0]);
                        history.endProcess();
                    }else{
                        result = `wrong password`
                        history.endProcess();
                    }
                }
            }
        }
        if (command === "rm"){
            if(history.isInProcess["isInProcess"] === false){
                if (commandOption.includes("y")){
                    let pathArray = FileSystemConsole.pathParser(args[0]);
                    fileSystem.removeDir(pathArray);
                }else{
                    history.setProcess(command, commandOption, args);
                    result = "are you sure? yes/no"
                }
            }else{
                if(inputData === "yes"){
                    let pathArray = FileSystemConsole.pathParser(args[0]);
                    fileSystem.removeDir(pathArray);
                    history.endProcess();
                    result = inputData
                }else if(inputData === "no"){
                    result = inputData
                    history.endProcess();
                }else{
                    result = 'type "yes"" or "no"'
                }
            }
        }
        if (command === "tree"){
            if(args[0]){
                let pathArray = FileSystemConsole.pathParser(args[0]);
                result = fileSystem.printTree(pathArray);
            }
            else result = fileSystem.printTree(null);
            // result = fileSystem.printTree()
        }
        if (command === "mv"){
            let targetDirPath = FileSystemConsole.pathParser(args[0]);
            let destinationDirPath = FileSystemConsole.pathParser(args[1]);
            fileSystem.moveDir(targetDirPath, destinationDirPath)
        }
        if (command === "cp"){
            let targetDirPath = FileSystemConsole.pathParser(args[0]);
            let destinationDirPath = FileSystemConsole.pathParser(args[1]);
            fileSystem.copy(targetDirPath, destinationDirPath)
        }
        if (command === "passwd"){
            let user = (fileSystem.isRootUser() && args[0] === null) ? fileSystem.getUser(args[0]): fileSystem.getCurrentUser();

            if(history.isInProcess["isInProcess"] === false){
                //1.パスワード未設定の場合
                if(user.getUserPassHash() === null){
                    result = "type password"
                    history.setProcess(command, commandOption, args, inputData)
                }
                //1.パスワード済設定の場合
                else{
                    result = "type current password"
                    history.setProcess(command, commandOption, args, inputData)
                }
            }else{
                //1.パスワード未設定の場合
                if(user.getUserPassHash() === null){
                    //一回目の確認
                    if(history.getInputData().length === 1) {
                        result = `type again`
                        history.setProcess(command, commandOption, args, inputData)
                    }
                    //二回目の確認
                    else{
                        if(history.getInputData()[1] === inputData){
                            user.setPassWordHash(inputData);
                            result = `done`
                            history.endProcess();
                        }else{
                            result = `try again from the start`
                            history.endProcess();
                        }
                    }

                }else{//password設定済みの場合
                    //1回目
                    if(history.getInputData().length === 1){
                        if(user.isCorrectPassword(inputData)){
                            result = "type new password"
                            history.setProcess(command, commandOption, args, inputData)
                        }else{
                            result = "wrong password"
                            history.endProcess();
                        }
                    }
                    //2
                    else if(history.getInputData().length === 2){
                        result = `type again`
                        history.setProcess(command, commandOption, args, inputData)
                    }else if(history.getInputData().length === 3) {
                        if(history.getInputData()[2] === inputData){
                            user.setPassWordHash(inputData);
                            result = `done`
                            history.endProcess();
                        }else{
                            result = `try again from the start`
                            history.endProcess();
                        }
                    }
                }
            }
        }
        if (command === "chmod"){
            let permissionNum = String(args[0]);
            let pathArray = FileSystemConsole.pathParser(args[1]);
            fileSystem.changeDirPermission(pathArray, permissionNum);
        }
        if (command === "chown"){
            let pathArray = FileSystemConsole.pathParser(args[1]);
            if(args[0].includes(":")){
                let tmp = args[0].split(":");
                let userName = tmp[0];
                let groupName = tmp[1];
                if (userName) fileSystem.changeDirOwner(pathArray, userName, "owner");
                if (groupName) fileSystem.changeDirOwner(pathArray, groupName, "group");
            }else{
                let userName = args[0];
                fileSystem.changeDirOwner(pathArray, userName, "owner");
            }
        }
        if (command === "help"){
            switch (args[0]){
                case undefined:
                    result = Help.getAllCommandHelp();
                    break;
                case "ls":
                    result = Help.getLSCommandHelp();
                    break;
                case "pwd":
                    result = Help.getPWDCommandHelp();
                    break;
                case "touch":
                    result = Help.getTOUCHCommandHelp();
                    break;
                case "tree":
                    result = Help.getTREECommandHelp();
                    break;
                case "mkdir":
                    result = Help.getMKDIRCommandHelp();
                    break;
                case "cd":
                    result = Help.getCDCommandHelp();
                    break;
                case "rm":
                    result = Help.getRMCommandHelp();
                    break;
                case "adduser":
                    result = Help.getADDUSERCommandHelp();
                    break;
                case "login":
                    result = Help.getLOGINCommandHelp();
                    break;
                case "passwd":
                    result = Help.getPASSWDCommandHelp();
                    break;
                case "chmod":
                    result = Help.getCHMODCommandHelp();
                    break;
                case "chown":
                    result = Help.getCHOWNCommandHelp();
                    break;
                case "mv":
                    result = Help.getMVCommandHelp();
                    break;
                case "cp":
                    result = Help.getCPCommandHelp();
                    break;
                default:
                    result = Help.getAllCommandHelp();
                    break;

            }
        }
        return result;
    }

}

class Help{
    static isAvailableCommand(command){
        let commandArgNum = {"ls":[0,1], "pwd":[0], "touch":[0,1], "tree":[0,1],"mkdir":[1], "cd":[1],
            "rm":[1], "adduser":[1], "login":[1], "mv":[2], "cp":[2], "help":[0,1], "passwd":[0,1],
            "logout":[0],"chmod":[2],"chown":[2]};

        return command in commandArgNum;
    }
    static getAllCommandHelp(){
        return `
        コマンドの詳細情報は、"help コマンド名"を入力してください。
        使用可能コマンド
        <p>ls [|filepath] [-option]</p>
        <p>pwd []</p>
        <p>touch [filePath]</p>
        <p>tree [|filepath]</p>
        <p>mkdir [filepath]</p>
        <p>cd [filepath]</p>
        <p>rm [filepath] [-option]</p>
        <p>adduser [username]</p>
        <p>login [username]</p>
        <p>passwd [|username]</p>
        <p>chmod [permissionSetting] [filepath]</p>
        <p>chown [username|:group|username:group] [filepath]</p>
        <p>mv [filepath] [filepath]</p>
        <p>cp [filepath] [filepath]</p>
        `
    }
    static getLSCommandHelp(){
        return `
        <p><strong>ls [option] [filePath]</strong></p>
        <p>指定したDirectoryの内容を表示します。</p>
        <p>なお、/はルートパス、~はログインしているユーザーのホーム、..は一つ上の階層を参照します。</p>
        <p><strong>[option]</strong></p>
        <p>a, 隠しファイルも表示します。隠しファイルはファイル名に.がついています。</p>
        <p>l, ファイルの詳細情報も表示します。</p>
        `
    }
    static getPWDCommandHelp(){
        return `
        <p><strong>pwd</strong></p>
        <p>現在のディレクトリのファイルパスを表示します。</p>
        `
    }
    static getTOUCHCommandHelp(){
        return `
        <p><strong>touch [filePath]</strong></p>
        <p>指定した名前のファイルをカレントディレクトリに作成します。</p>
        <p>なお、/はルートパス、~はログインしているユーザーのホーム、..は一つ上の階層を参照します。</p>
        `
    }
    static getTREECommandHelp(){
        return `
        <p><strong>tree [|filepath]</strong></p>
        <p>現在のDirectoryのtree構造を表示します。</p>
        <p>filePathを指定した場合は、指定したdirectoryのtree構造を表示します。</p>
        <p>なお、/はルートパス、~はログインしているユーザーのホーム、..は一つ上の階層を参照します。</p>
        <p>Permissionは考慮していません。</p>
        `
    }
    static getMKDIRCommandHelp(){
        return  `
        <p><strong>tree [filePath]</strong></p>
        <p>指定したdirectoryのtree構造を表示します。</p>
        <p>なお、/はルートパス、~はログインしているユーザーのホーム、..は一つ上の階層を参照します。</p>
        <p>Permissionは考慮していません。</p>
        `
    }
    static getCDCommandHelp(){
        return  `
        <p><strong>cd [filePath]</strong></p>
        <p>指定したdirectoryに移動します。</p>
        <p>なお、/はルートパス、~はログインしているユーザーのホーム、..は一つ上の階層を参照します。</p>
        `
    }
    static getRMCommandHelp(){
        return  `
        <p><strong>rm [option] [filePath]</strong></p>
        <p>指定したDirectoryの内容を表示します。</p>
        <p>なお、/はルートパス、~はログインしているユーザーのホーム、..は一つ上の階層を参照します。</p>
        <p><strong>[option]</strong></p>
        <p>y, 削除前の確認メッセージを全てyesにします。</p>
        `
    }
    static getADDUSERCommandHelp(){
        return `
        <p><strong>adduser [username]</strong></p>
        <p>新しいユーザーを追加します。</p>
        <p>ユーザーのグループは"User"で変更はできません。</p>
        `
    }
    static getLOGINCommandHelp(){
        return  `
        <p><strong>login [username]</strong></p>
        <p>ログインします。</p>
        <p>パスワードを設定したときは、パスワードを入力してください。</p>
        <p>新しいユーザーでログインしたときは、前のユーザーは自動的にログアウトします。</p>
        `
    }
    static getPASSWDCommandHelp(){
        return  `
        <p><strong> passwd [|username]</strong></p>
        <p>現在ログインしているユーザーのパスワードを設定、変更します。</p>
        <p>rootでログインしているときのみ他のユーザーのパスワードを変更できます。</p>
        <p>ハッシュ値で判定しています。</p>
        `
    }
    static getCHMODCommandHelp(){
        return `
        <p><strong>chmod [permissionSetting] [filepath]</strong></p>
        <p>指定したファイルのパーミッションを設定します。</p>
        <p>なお、/はルートパス、~はログインしているユーザーのホーム、..は一つ上の階層を参照します。</p>
        <p>ファイルのパーミッションは"ls -l"で確認できます。</p>
        <p>-/rwx/rw-/r-- ファイルの種類/ユーザ/グループ/その他</p>
        <p><strong>[permissionSetting]</strong></p>
        <p>設定するときは、合計数で設定します。</p>
        <p>例:"home" のPermissionが"drwxrwxrwx"のとき</p>
        <p>chmod 743 home => drwxr---wx</p>
        <p>ユーザー：7⇒1+2+4⇒rwx</p>
        <p>グループ：4⇒4⇒r--</p>
        <p>その他：3⇒1+2⇒-wx</p>
        <p>なお、数字は下記の通り。</p>
        <p>r(4):ファイルの内容の参照</p>
        <p>w(2):ファイルの書き込み</p>
        <p>x(1):ファイルの実行、移動</p>
        `
    }
    static getCHOWNCommandHelp(){
        return `
        <p><strong> chown [username|:group|username:group] [filepath]</strong></p>
        <p>指定したDirectoryの所有者と所有グループを変更します。</p>
        <p>なお、/はルートパス、~はログインしているユーザーのホーム、..は一つ上の階層を参照します。</p>
        <p>グループはグループ名の前に":"をつけることで指定できます。</p>
        `
    }
    static getMVCommandHelp(){
        return `
        <p><strong>mv [filepath] [filepath]</strong></p>
        <p>指定したDirectoryを移動します。</p>
        <p>なお、/はルートパス、~はログインしているユーザーのホーム、..は一つ上の階層を参照します。</p>
        <p>pathの最後に/をつけると、指定したディレクトリ以下のすべてのサブディレクトリを移動します。</p>
        `
    }
    static getCPCommandHelp(){
        return `
        <p><strong>mv [filepath] [filepath]</strong></p>
        <p>指定したDirectoryをコピーします。</p>
        <p>なお、/はルートパス、~はログインしているユーザーのホーム、..は一つ上の階層を参照します。</p>
        <p>pathの最後に/をつけると、指定したディレクトリ以下のすべてのサブディレクトリをコピーします。</p> 
        `
    }
}
class CommandLineHistory{
    constructor() {
        this.commandLineTextList = [];
        this.index = -1;
        this.isInProcess = {"isInProcess":false, "command":null, "commandOption":null, "args":null, "inputData":[]}//command実行中かどうか
    }
    pushCommandLine(text){
        this.commandLineTextList.push(text);
        this.index = this.commandLineTextList.length - 1;
    }
    upIndex(){
        this.index --;
        if (this.index < 0) this.index = 0;
    }
    downIndex(){
        this.index ++;
        let lastIndex = this.commandLineTextList.length - 1;
        if (this.index > lastIndex) this.index = lastIndex;
    }
    getCommand(){
        return this.commandLineTextList[this.index];
    }
    setProcess(command, commandOption, args, inputData){
        this.isInProcess["isInProcess"] = true;
        this.isInProcess["command"] = command;
        this.isInProcess["commandOption"] = commandOption;
        this.isInProcess["args"] = args;
        this.isInProcess["inputData"].push(inputData);
    }
    getInputData(){
        return this.isInProcess["inputData"] ;
    }
    endProcess(){
        this.isInProcess["isInProcess"] = false;
        this.isInProcess["command"] = null;
        this.isInProcess["commandOption"] = null;
        this.isInProcess["args"] = null;
        this.isInProcess["inputData"] = [];
    }
}
/*-------------function----------------*/
function historyUp(){
    history.upIndex();
    CLITextInput.value = history.getCommand();
}
function historyDown(){
    history.downIndex();
    CLITextInput.value = history.getCommand();
}

function doCommand(){
    history.pushCommandLine(CLITextInput.value);
    let parsedCLIMap = FileSystemConsole.commandLineParser(CLITextInput.value);
    let command = parsedCLIMap["command"];
    let commandOption = parsedCLIMap["commandOption"];
    let args = parsedCLIMap["args"];

    FileSystemConsole.appendEchoParagraph(CLIOutputDiv);
    CLITextInput.value = "";

    let validatorResponse = FileSystemConsole.parsedArrayValidator(command, commandOption, args);
    if(validatorResponse["isValid"] === false) FileSystemConsole.appendResultParagraph(CLIOutputDiv, false, validatorResponse["errorMessage"]);

    else  FileSystemConsole.appendResultParagraph(CLIOutputDiv, true,  FileSystemConsole.evaluatedResultsStringFromParsedCLIArray(command, commandOption, args));
    // let queryResponseObject = await Tools.queryResponseObjectFromQueryString(queryString);
    CLIOutputDiv.scrollTop = CLIOutputDiv.scrollHeight;

    PathInfoSpan.innerHTML =
        `<p class="m-0">
                <span style='color:lawngreen'>${fileSystem.getCurrentUser().getUserName()}</span>
                <span style='color:yellow'>@</span>
                <span style='color:lightskyblue'>${fileSystem.getCurrentUser().getUserGroup() + ":"}</span>
                <span style='color:lightskyblue'>${"/" + fileSystem.printWorkingDirectory().join("/") + "$"}</span>
                : ${CLITextInput.value}
            </p>`;
    CLITextInput.focus();
}

function continueCommand(){
    let isInProcess = history.isInProcess;
    let inputData = CLITextInput.value;
    let command = isInProcess["command"];
    let commandOption = isInProcess["commandOption"];
    let args = isInProcess["args"];

    let validatorResponse = FileSystemConsole.exceptForCommandInputValidator(command, commandOption, args, inputData);
    if (validatorResponse["isValid"] === false) FileSystemConsole.appendResultParagraph(CLIOutputDiv, false, validatorResponse["errorMessage"]);
    else  FileSystemConsole.appendResultParagraph(CLIOutputDiv, true,  FileSystemConsole.evaluatedResultsStringFromParsedCLIArray(command, commandOption, args, inputData));
    CLITextInput.value = "";

    CLIOutputDiv.scrollTop = CLIOutputDiv.scrollHeight;

    PathInfoSpan.innerHTML =
        `<p class="m-0">
                <span style='color:lawngreen'>${fileSystem.getCurrentUser().getUserName()}</span>
                <span style='color:yellow'>@</span>
                <span style='color:lightskyblue'>${fileSystem.getCurrentUser().getUserGroup() + ":"}</span>
                <span style='color:lightskyblue'>${"/" + fileSystem.printWorkingDirectory().join("/") + "$"}</span>
                : ${CLITextInput.value}
            </p>`;
    CLITextInput.focus();
}
function submitSearch(event){
    if(event.key === "Enter"){//状態は、実行前、実行中、実行終了
        let isInProcess = history.isInProcess;
        if (isInProcess["isInProcess"] === true) continueCommand();
        else doCommand();
    }
    if(event.keyCode === 38){
        historyUp();
    }
    if(event.keyCode === 40){
        historyDown();
    }
}
function extensionSeparation(path){
    let pathArray = path.split(".")
    let extension = pathArray.pop()
    return {"path": pathArray.join("."), "extension":extension}
}

function hashPassword(password){
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        let character = password.charCodeAt(i);
        hash = ((hash << 5)-hash)+character;
        hash = hash & hash;
    }
    return Math.abs(hash);
}


let fileSystem = new FileSystem();
let history = new CommandLineHistory();
let CLITextInput = document.getElementById("CLITextInput");
let CLIOutputDiv = document.getElementById("CLIOutputDiv");
let PathInfoSpan = document.getElementById("path-info");
PathInfoSpan.innerHTML =
    `<p class="m-0">
                <span style='color:lawngreen'>${fileSystem.getCurrentUser().getUserName()}</span>
                <span style='color:yellow'>@</span>
                <span style='color:lightskyblue'>${fileSystem.getCurrentUser().getUserGroup() + ":"}</span>
                <span style='color:lightskyblue'>${"/" + fileSystem.printWorkingDirectory().join("/") + "$"}</span>
                : ${CLITextInput.value}
            </p>`;

CLITextInput.focus();
CLITextInput.addEventListener("keyup", (event)=>submitSearch(event));