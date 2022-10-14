// ambroise Rabier 18 mars 2017
// use : git log --numstat --author="ambroiseRabier" --oneline > shortStat.txt
// then : node parser_git_stats.js shortStat_ambroiseRabier.txt
// todo: write json, and parameter filename, ignore fileExtension, ingore .php} (file name changed)
console.log("Parsing...");


var args = process.argv.splice(2); // ignore "node parser_git_stats.js" and take arguments after
var fs = require("fs");
var data = "";

if (args[0] != undefined && typeof(args[0]) == "string" && args[0].search(".txt") != -1) {
} else {
    console.log("Invalid first argument : " + args[0] + ". It has to be a .txt done whit the command: git log --numstat --author=\"ambroiseRabier\" --oneline > shortStat.txt");
    process.exit();
}

var readStream = fs.createReadStream(String(args[0]), 'utf8');

//config (ingore .png, .exe and other that have incomplete data)
const IGNORE_INCOMPLETE_DATA = true;

const ADDED_INDEX = 0;
const REMOVED_INDEX = 1;
const ADDED_SYMBOL = "+";
const REMOVED_SYMBOL = "-";
const TOTAL_SYMBOL = "+/-";
const TOTAL_OF_ADDED_SYMBOL = "totalAdded";
const TOTAL_OF_REMOVED_SYMBOL = "totalRemoved";
const TOTAL_OF_TOTAL_SYMBOL = "totalTotal";
const FLAG_SYMBOL = "fullData"; // sometimes there is no data on a file (like on a .exe or .png)

readStream.on('data', function(chunk) {
    //handleChunk(chunk);
    data+=chunk;
}).on('end', function() {
    this.result = parseAll(data);
    console.log(this.result);
    writeFile(this.result);

});

function handleChunk () {

}

function parseAll (data) {
    var result = {}; // associative array whit extension and for each extension line added and removed
    var myArray = data.split("\n");
    var lineModified;
    var fileExtension = "";
    for (var i = myArray.length - 1; i >= 0; i--) {
        // exemple: "605abae Optimization: sortTile less used when clipping."
        if (myArray[i].charAt(7) == " ")
            continue;

        fileExtension = myArray[i].match(/\.[^.]*$/);
        lineModified = myArray[i].match(/\d+/g);

        if (fileExtension == undefined || lineModified == undefined)
            continue;

        if (result[fileExtension] == undefined) {
            //result[fileExtension] = { ADDED_SYMBOL:0, REMOVED_SYMBOL:0, TOTAL_SYMBOL:0}; can't do that
            result[fileExtension] = {};
            result[fileExtension][ADDED_SYMBOL] = 0;
            result[fileExtension][REMOVED_SYMBOL] = 0;
            result[fileExtension][TOTAL_SYMBOL] = 0;
        }


        if (lineModified[REMOVED_INDEX] == undefined || lineModified[ADDED_INDEX] == undefined) {
            result[fileExtension][FLAG_SYMBOL] = false;
            continue;
        }
        result[fileExtension][ADDED_SYMBOL] += parseInt(lineModified[ADDED_INDEX]);
        result[fileExtension][REMOVED_SYMBOL] += parseInt(lineModified[REMOVED_INDEX]);
        result[fileExtension][TOTAL_SYMBOL] += parseInt(lineModified[ADDED_INDEX]) + parseInt(lineModified[REMOVED_INDEX]);
        
    }

    if (IGNORE_INCOMPLETE_DATA) {
        for (var lFileExtension in result) {
            if (result[lFileExtension][FLAG_SYMBOL] == false)
                delete result[lFileExtension];
        }
    }

    result = addTotals(result);

    return result;
}

function addTotals (pResult) {
    pResult[TOTAL_OF_ADDED_SYMBOL] = 0;
    pResult[TOTAL_OF_REMOVED_SYMBOL] = 0;
    pResult[TOTAL_OF_TOTAL_SYMBOL] = 0;
    for (var lFileExtension in pResult) {
        if (lFileExtension == TOTAL_OF_ADDED_SYMBOL ||
            lFileExtension == TOTAL_OF_REMOVED_SYMBOL ||
            lFileExtension == TOTAL_OF_TOTAL_SYMBOL)
            continue;
        pResult[TOTAL_OF_ADDED_SYMBOL] += pResult[lFileExtension][ADDED_SYMBOL];
        pResult[TOTAL_OF_REMOVED_SYMBOL] += pResult[lFileExtension][REMOVED_SYMBOL];
        pResult[TOTAL_OF_TOTAL_SYMBOL] += pResult[lFileExtension][TOTAL_SYMBOL];
    }
    return pResult;
}

function writeFile (pFile) {
    var extensionIndex = args[0].search(".txt");
    var name = args[0].substring(0, extensionIndex) + ".json";
    fs.writeFile(
        name,
        JSON.stringify(pFile),
        function(err) {
            if(err) {
               return console.log(err);
        }

        console.log("\n" + name + " saved !");
    }); 
}
