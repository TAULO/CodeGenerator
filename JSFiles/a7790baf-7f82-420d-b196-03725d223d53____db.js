var fs = require("fs");
var path = require("path");

function GetData(fName, extension = "json"){
	//console.log(path.join(__dirname, fName+"."+extension));
	var contents2 = fs.readFileSync(path.join(__dirname, fName+"."+extension));
	var student2 = JSON.parse(contents2);
	return student2;
}
function Exist(fName, extension = "json"){
	return fs.existsSync(path.join(__dirname, fName+"."+extension));
}
function GetTemplateData(fName, extension = "json"){
	return GetData(path.join("templ", fName), extension)
}
function GetPlayerData(player, fName, extension = "json"){
	return GetData(path.join("db",player, fName), extension)
}
function PlayerDataExist(player, fName, extension = "json"){
	return Exist(path.join("db",player, fName), extension)
}
function GetPlayerDataTemplated(player, fName, extension = "json"){
	var student = GetTemplateData(fName, extension);
	
	if (PlayerDataExist(player, fName, extension)) {
		var student2 = GetPlayerData(player, fName, extension);
		var newObj = {...student, ...student2};
		return newObj;
	}
	else{
		return student;
	}
}

function WritePlayerData(player, fName, data, extension = "json"){
	var dir = path.join(__dirname, "db", player);
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
	fs.writeFileSync(path.join(dir, fName+"."+extension), JSON.stringify(data));
}


module.exports = {
	GetData,
	GetPlayerData,
	GetTemplateData,
	GetPlayerDataTemplated,
	WritePlayerData,
};