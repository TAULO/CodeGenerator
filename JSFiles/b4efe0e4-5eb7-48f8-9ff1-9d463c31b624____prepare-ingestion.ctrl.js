const fs = require('fs');
const path = require('path');
const helpers = require('../../helpers');
const driver = require('../../config/db-driver');
const Promise = require('bluebird');

const ExifImage = require('exif').ExifImage;
const IptcImage = require('node-iptc');
const sizeOfImage = require('image-size');
const crypto = require('crypto');

const {
  RESOURCESPATH: resourcesPath,
  SERVERURL: serverURL,
  ARCHIVEPATH: archivePath,
} = process.env;

const referencesController = require('../references.ctrl');
const TaxonomyTerm = require('../taxonomyTerm.ctrl').TaxonomyTerm;
const Resource = require('../resource.ctrl').Resource;
const Person = require('../person.ctrl').Person;
const Organisation = require('../organisation.ctrl').Organisation;

/**
* @api {get} /prepare-classpiece-ingestion Prepare classpiece ingestion
* @apiName prepare classpiece ingestion
* @apiGroup Tools
* @apiPermission admin
*
* @apiParam {string} file The filename of the requested classpiece.
* @apiSuccessExample {json} Success-Response:
"status": true, "data": {
  "classpiece": {
    "default": {
      "height": 6464,
      "width": 4715,
      "extension": "jpg",
      "x": 0,
      "y": 0,
      "rotate": 0
    },
    "exif": {
      "image": {
        "XResolution": 240,
        "YResolution": 240,
        "ResolutionUnit": 2,
        "Software": "Adobe Photoshop Lightroom Classic 7.3.1 (Windows)",
        "ModifyDate": "2018:07:02 12:56:58",
        "ExifOffset": 172
      },
      "thumbnail": {},
      "exif": {
        "ExifVersion": {
          "type": "Buffer",
          "data": [48, 50, 51, 48]
        },
        "ColorSpace": 1
      },
      "gps": {},
      "interoperability": {},
      "makernote": {}
    },
    "iptc": {},
    "label": "1977",
    "fileName": "1977.jpg",
    "thumbnail": {
      "path": "/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/images/processed/thumbnails/1977.jpg",
      "src": "http://localhost:5100/images/processed/thumbnails/1977.jpg"
    }
  },
  "faces": [{
    "fileName": "0.jpg",
    "thumbnail": {
      "path": "/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/0.jpg",
      "src": "http://localhost:5100/output/1977/thumbnails/0.jpg"
    },
    "honorificPrefix": "",
    "firstName": "",
    "middleName": "",
    "lastName": "",
    "diocese": "",
    "dioceseType": "",
    "default": {
      "height": 112,
      "width": 112,
      "extension": "jpg",
      "x": 813,
      "y": 817
    },
    "type": ""
  }, ],
  "db_classpiece": "0"
}, "error": false, "msg": ""
}*/
const preIngestionReportClassPiece = async (req, resp) => {
  const { query: parameters } = req;
  const { file } = parameters;
  if (typeof file === 'undefined' || file === '') {
    resp.json({
      status: false,
      data: '',
      error: true,
      msg: 'Please provide a valid file name to continue',
    });
    return false;
  }

  const fileName = path.parse(file).name;
  const classPieceSource = `${resourcesPath}images/processed/fullsize/${file}`;
  const outputJsonDir = `${resourcesPath}output/${fileName}/json/`;
  // class piece
  const classPiecePromise = await classPieceImageResource(
    classPieceSource,
    fileName
  );
  const classPieceFaces = await facesImageResources(
    outputJsonDir + fileName + '-faces.json',
    fileName
  );

  var checkIfClassPieceIsImported = await new Promise((resolve) => {
    const check = async () => {
      let session = driver.session();
      let count = await session
        .writeTransaction((tx) =>
          tx.run(
            "MATCH (n:Resource) WHERE n.label='" +
              fileName +
              "' AND n.fileName='" +
              file +
              "' RETURN count(*) as c"
          )
        )
        .then((result) => {
          session.close();
          let resultRecord = result.records[0];
          let countObj = resultRecord.toObject();
          helpers.prepareOutput(countObj);
          let output = countObj['c'];
          return output;
        });
      resolve(count);
    };
    check();
  }).catch((error) => {
    console.log(error);
  });

  let all = await Promise.all([
    classPiecePromise,
    classPieceFaces,
    checkIfClassPieceIsImported,
  ]).then((data) => {
    let classPieceJson = data[0];
    classPieceJson.label = fileName;
    classPieceJson.fileName = file;
    classPieceJson.thumbnail = {
      path: resourcesPath + 'images/processed/thumbnails/' + file,
      src: serverURL + 'images/processed/thumbnails/' + file,
    };
    let faces = data[1];
    let dbClasspiece = null;
    if (data[2].length > 0) {
      dbClasspiece = data[2];
    }
    let response = {};
    response.classpiece = classPieceJson;
    response.faces = faces;
    response.db_classpiece = dbClasspiece;
    resp.json({
      status: true,
      data: response,
      error: false,
      msg: '',
    });
  });
  return all;
};

/**
* @api {put} /prepare-classpiece-identify-duplicates Prepare classpiece identify duplicates
* @apiName prepare classpiece identify duplicates
* @apiGroup Tools
* @apiPermission admin
*
* @apiParam {string} faces A stringified JSON containing all available information about a classpiece faces.
* @apiSuccessExample {json} Success-Response:
{
  "status": true,
  "data": "[{\"fileName\":\"0.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/0.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/0.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":112,\"width\":112,\"extension\":\"jpg\",\"x\":813,\"y\":817},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"1.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/1.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/1.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":79,\"width\":79,\"extension\":\"jpg\",\"x\":115,\"y\":1910},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"2.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/2.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/2.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":76,\"width\":76,\"extension\":\"jpg\",\"x\":418,\"y\":1497},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"3.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/3.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/3.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":75,\"width\":75,\"extension\":\"jpg\",\"x\":116,\"y\":589},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"4.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/4.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/4.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":75,\"width\":75,\"extension\":\"jpg\",\"x\":1549,\"y\":238},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"5.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/5.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/5.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":74,\"width\":74,\"extension\":\"jpg\",\"x\":1353,\"y\":953},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"6.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/6.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/6.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":74,\"width\":74,\"extension\":\"jpg\",\"x\":700,\"y\":1250},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"7.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/7.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/7.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":74,\"width\":74,\"extension\":\"jpg\",\"x\":603,\"y\":2132},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"8.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/8.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/8.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":74,\"width\":74,\"extension\":\"jpg\",\"x\":1054,\"y\":408},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"9.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/9.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/9.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":72,\"width\":72,\"extension\":\"jpg\",\"x\":116,\"y\":213},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"10.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/10.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/10.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":72,\"width\":72,\"extension\":\"jpg\",\"x\":345,\"y\":346},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"11.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/11.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/11.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":72,\"width\":72,\"extension\":\"jpg\",\"x\":148,\"y\":1671},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"12.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/12.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/12.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":960,\"y\":1252},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"13.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/13.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/13.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":833,\"y\":490},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"14.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/14.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/14.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":618,\"y\":407},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"15.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/15.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/15.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":632,\"y\":1508},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"16.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/16.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/16.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":1392,\"y\":1186},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"17.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/17.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/17.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":1150,\"y\":691},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"18.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/18.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/18.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":1557,\"y\":593},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"19.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/19.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/19.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":469,\"y\":1194},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"20.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/20.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/20.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1319,\"y\":336},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"21.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/21.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/21.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1564,\"y\":954},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"22.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/22.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/22.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1056,\"y\":2149},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"23.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/23.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/23.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":124,\"y\":2147},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"24.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/24.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/24.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1152,\"y\":1825},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"25.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/25.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/25.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1453,\"y\":1437},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"26.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/26.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/26.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1205,\"y\":1193},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"27.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/27.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/27.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1552,\"y\":1926},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"28.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/28.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/28.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":68,\"width\":68,\"extension\":\"jpg\",\"x\":530,\"y\":692},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"29.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/29.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/29.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":68,\"width\":68,\"extension\":\"jpg\",\"x\":1552,\"y\":2161},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"30.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/30.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/30.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":68,\"width\":68,\"extension\":\"jpg\",\"x\":329,\"y\":1872},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"31.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/31.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/31.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":68,\"width\":68,\"extension\":\"jpg\",\"x\":327,\"y\":2117},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"32.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/32.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/32.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":68,\"width\":68,\"extension\":\"jpg\",\"x\":106,\"y\":933},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"33.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/33.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/33.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":518,\"y\":1819},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"34.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/34.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/34.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":322,\"y\":943},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"35.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/35.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/35.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":511,\"y\":938},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"36.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/36.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/36.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":1252,\"y\":1516},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"37.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/37.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/37.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":836,\"y\":2155},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"38.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/38.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/38.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":1344,\"y\":2127},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"39.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/39.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/39.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":323,\"y\":648},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"40.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/40.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/40.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":1526,\"y\":1685},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"41.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/41.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/41.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":65,\"width\":65,\"extension\":\"jpg\",\"x\":844,\"y\":1577},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"42.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/42.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/42.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":65,\"width\":65,\"extension\":\"jpg\",\"x\":1338,\"y\":1870},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"43.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/43.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/43.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":65,\"width\":65,\"extension\":\"jpg\",\"x\":278,\"y\":1189},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"44.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/44.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/44.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":65,\"width\":65,\"extension\":\"jpg\",\"x\":1348,\"y\":637},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"45.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/45.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/45.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":65,\"width\":65,\"extension\":\"jpg\",\"x\":213,\"y\":1437},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"46.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/46.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/46.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":64,\"width\":64,\"extension\":\"jpg\",\"x\":1029,\"y\":1515},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"47.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/47.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/47.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":63,\"width\":63,\"extension\":\"jpg\",\"x\":1149,\"y\":960},\"type\":\"\",\"checked\":true,\"matches\":[]},{\"fileName\":\"48.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/48.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/48.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":57,\"width\":57,\"extension\":\"jpg\",\"x\":833,\"y\":1833},\"type\":\"\",\"checked\":true,\"matches\":[]}]",
  "error": false,
  "msg": ""
}
*/
const classPieceIdentifyDuplicates = async (req, resp) => {
  const postData = req.body;
  const session = driver.session();
  let faces = {};
  if (typeof postData.faces !== 'undefined') {
    faces = JSON.parse(postData.faces);
  }
  const newFaces = [];
  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
    // compare person
    let queryParams = '';
    let firstName = '';
    let lastName = '';
    if (typeof face.firstName !== 'undefined' && face.firstName !== '') {
      firstName = helpers.escapeRegExp(face.firstName).toLowerCase();
      if (firstName !== '') {
        queryParams = `EXISTS(n.firstName) AND toLower(n.firstName) =~ toLower('.*${firstName}.*') `;
      }
    }
    if (typeof face.lastName !== 'undefined' && face.lastName !== '') {
      lastName = helpers.escapeRegExp(face.lastName).toLowerCase();
      if (queryParams !== '') {
        queryParams += ' AND ';
      }
      queryParams = `EXISTS(n.lastName) AND toLower(n.lastName) =~ toLower('.*${lastName}.*') `;
    }
    if (queryParams !== '') {
      queryParams = 'WHERE ' + queryParams;
    }

    if (queryParams !== '') {
      let query = 'MATCH (n:Person) ' + queryParams + ' RETURN n';
      let nodesPromise = await session
        .writeTransaction((tx) => tx.run(query, {}))
        .then((result) => {
          return result.records;
        })
        .catch((error) => {
          console.log(error);
        });
      let nodes = helpers.normalizeRecordsOutput(nodesPromise);
      let returnMatches = [];
      for (let j = 0; j < nodes.length; j++) {
        let matchedFace = nodes[j];
        let score = 0;
        if (matchedFace.firstName.toLowerCase() === firstName.toLowerCase()) {
          score += 50;
        } else if (
          helpers.soundex(matchedFace.firstName) === helpers.soundex(firstName)
        ) {
          score += 25;
        }
        if (matchedFace.lastName.toLowerCase() === lastName.toLowerCase()) {
          score += 50;
        } else if (
          helpers.soundex(matchedFace.lastName) === helpers.soundex(lastName)
        ) {
          score += 25;
        }
        if (score > 50) {
          let resources = await helpers.loadRelations(
            matchedFace._id,
            'Person',
            'Resource'
          );
          let organisations = await helpers.loadRelations(
            matchedFace._id,
            'Person',
            'Organisation'
          );
          matchedFace.resources = resources;
          matchedFace.organisations = organisations;
          let newFaceMatch = matchedFace;
          newFaceMatch.score = score;
          returnMatches.push(newFaceMatch);
        }
      }
      if (returnMatches.length > 0) {
        returnMatches.sort(function (a, b) {
          return b.score - a.score;
        });
      }
      face.matches = returnMatches;
    }
    newFaces.push(face);
  }

  session.close();

  return resp.json({
    status: true,
    data: JSON.stringify(newFaces),
    error: false,
    msg: '',
  });
};

/**
* @api {put} /ingest-classpiece Ingest classpiece
* @apiName ingest classpiece
* @apiGroup Tools
* @apiPermission admin
*
* @apiExample {json} Example:
* {"data":"{\"file\":\"1977.jpg\",\"classpiece\":{\"default\":{\"height\":6464,\"width\":4715,\"extension\":\"jpg\",\"x\":0,\"y\":0,\"rotate\":0},\"exif\":{\"image\":{\"XResolution\":240,\"YResolution\":240,\"ResolutionUnit\":2,\"Software\":\"Adobe Photoshop Lightroom Classic 7.3.1 (Windows)\",\"ModifyDate\":\"2018:07:02 12:56:58\",\"ExifOffset\":172},\"thumbnail\":{},\"exif\":{\"ExifVersion\":{\"type\":\"Buffer\",\"data\":[48,50,51,48]},\"ColorSpace\":1},\"gps\":{},\"interoperability\":{},\"makernote\":{}},\"iptc\":{},\"label\":\"1977\",\"fileName\":\"1977.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/images/processed/thumbnails/1977.jpg\",\"src\":\"http://localhost:5100/images/processed/thumbnails/1977.jpg\"},\"checked\":true},\"faces\":[{\"fileName\":\"0.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/0.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/0.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":112,\"width\":112,\"extension\":\"jpg\",\"x\":813,\"y\":817},\"type\":\"\",\"checked\":true},{\"fileName\":\"1.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/1.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/1.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":79,\"width\":79,\"extension\":\"jpg\",\"x\":115,\"y\":1910},\"type\":\"\",\"checked\":true},{\"fileName\":\"2.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/2.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/2.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":76,\"width\":76,\"extension\":\"jpg\",\"x\":418,\"y\":1497},\"type\":\"\",\"checked\":true},{\"fileName\":\"3.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/3.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/3.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":75,\"width\":75,\"extension\":\"jpg\",\"x\":116,\"y\":589},\"type\":\"\",\"checked\":true},{\"fileName\":\"4.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/4.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/4.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":75,\"width\":75,\"extension\":\"jpg\",\"x\":1549,\"y\":238},\"type\":\"\",\"checked\":true},{\"fileName\":\"5.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/5.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/5.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":74,\"width\":74,\"extension\":\"jpg\",\"x\":1353,\"y\":953},\"type\":\"\",\"checked\":true},{\"fileName\":\"6.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/6.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/6.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":74,\"width\":74,\"extension\":\"jpg\",\"x\":700,\"y\":1250},\"type\":\"\",\"checked\":true},{\"fileName\":\"7.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/7.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/7.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":74,\"width\":74,\"extension\":\"jpg\",\"x\":603,\"y\":2132},\"type\":\"\",\"checked\":true},{\"fileName\":\"8.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/8.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/8.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":74,\"width\":74,\"extension\":\"jpg\",\"x\":1054,\"y\":408},\"type\":\"\",\"checked\":true},{\"fileName\":\"9.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/9.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/9.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":72,\"width\":72,\"extension\":\"jpg\",\"x\":116,\"y\":213},\"type\":\"\",\"checked\":true},{\"fileName\":\"10.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/10.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/10.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":72,\"width\":72,\"extension\":\"jpg\",\"x\":345,\"y\":346},\"type\":\"\",\"checked\":true},{\"fileName\":\"11.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/11.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/11.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":72,\"width\":72,\"extension\":\"jpg\",\"x\":148,\"y\":1671},\"type\":\"\",\"checked\":true},{\"fileName\":\"12.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/12.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/12.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":960,\"y\":1252},\"type\":\"\",\"checked\":true},{\"fileName\":\"13.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/13.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/13.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":833,\"y\":490},\"type\":\"\",\"checked\":true},{\"fileName\":\"14.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/14.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/14.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":618,\"y\":407},\"type\":\"\",\"checked\":true},{\"fileName\":\"15.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/15.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/15.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":632,\"y\":1508},\"type\":\"\",\"checked\":true},{\"fileName\":\"16.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/16.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/16.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":1392,\"y\":1186},\"type\":\"\",\"checked\":true},{\"fileName\":\"17.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/17.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/17.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":1150,\"y\":691},\"type\":\"\",\"checked\":true},{\"fileName\":\"18.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/18.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/18.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":1557,\"y\":593},\"type\":\"\",\"checked\":true},{\"fileName\":\"19.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/19.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/19.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":71,\"width\":71,\"extension\":\"jpg\",\"x\":469,\"y\":1194},\"type\":\"\",\"checked\":true},{\"fileName\":\"20.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/20.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/20.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1319,\"y\":336},\"type\":\"\",\"checked\":true},{\"fileName\":\"21.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/21.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/21.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1564,\"y\":954},\"type\":\"\",\"checked\":true},{\"fileName\":\"22.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/22.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/22.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1056,\"y\":2149},\"type\":\"\",\"checked\":true},{\"fileName\":\"23.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/23.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/23.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":124,\"y\":2147},\"type\":\"\",\"checked\":true},{\"fileName\":\"24.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/24.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/24.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1152,\"y\":1825},\"type\":\"\",\"checked\":true},{\"fileName\":\"25.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/25.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/25.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1453,\"y\":1437},\"type\":\"\",\"checked\":true},{\"fileName\":\"26.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/26.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/26.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1205,\"y\":1193},\"type\":\"\",\"checked\":true},{\"fileName\":\"27.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/27.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/27.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":69,\"width\":69,\"extension\":\"jpg\",\"x\":1552,\"y\":1926},\"type\":\"\",\"checked\":true},{\"fileName\":\"28.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/28.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/28.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":68,\"width\":68,\"extension\":\"jpg\",\"x\":530,\"y\":692},\"type\":\"\",\"checked\":true},{\"fileName\":\"29.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/29.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/29.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":68,\"width\":68,\"extension\":\"jpg\",\"x\":1552,\"y\":2161},\"type\":\"\",\"checked\":true},{\"fileName\":\"30.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/30.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/30.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":68,\"width\":68,\"extension\":\"jpg\",\"x\":329,\"y\":1872},\"type\":\"\",\"checked\":true},{\"fileName\":\"31.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/31.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/31.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":68,\"width\":68,\"extension\":\"jpg\",\"x\":327,\"y\":2117},\"type\":\"\",\"checked\":true},{\"fileName\":\"32.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/32.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/32.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":68,\"width\":68,\"extension\":\"jpg\",\"x\":106,\"y\":933},\"type\":\"\",\"checked\":true},{\"fileName\":\"33.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/33.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/33.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":518,\"y\":1819},\"type\":\"\",\"checked\":true},{\"fileName\":\"34.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/34.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/34.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":322,\"y\":943},\"type\":\"\",\"checked\":true},{\"fileName\":\"35.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/35.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/35.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":511,\"y\":938},\"type\":\"\",\"checked\":true},{\"fileName\":\"36.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/36.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/36.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":1252,\"y\":1516},\"type\":\"\",\"checked\":true},{\"fileName\":\"37.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/37.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/37.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":836,\"y\":2155},\"type\":\"\",\"checked\":true},{\"fileName\":\"38.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/38.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/38.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":1344,\"y\":2127},\"type\":\"\",\"checked\":true},{\"fileName\":\"39.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/39.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/39.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":323,\"y\":648},\"type\":\"\",\"checked\":true},{\"fileName\":\"40.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/40.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/40.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":67,\"width\":67,\"extension\":\"jpg\",\"x\":1526,\"y\":1685},\"type\":\"\",\"checked\":true},{\"fileName\":\"41.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/41.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/41.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":65,\"width\":65,\"extension\":\"jpg\",\"x\":844,\"y\":1577},\"type\":\"\",\"checked\":true},{\"fileName\":\"42.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/42.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/42.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":65,\"width\":65,\"extension\":\"jpg\",\"x\":1338,\"y\":1870},\"type\":\"\",\"checked\":true},{\"fileName\":\"43.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/43.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/43.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":65,\"width\":65,\"extension\":\"jpg\",\"x\":278,\"y\":1189},\"type\":\"\",\"checked\":true},{\"fileName\":\"44.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/44.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/44.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":65,\"width\":65,\"extension\":\"jpg\",\"x\":1348,\"y\":637},\"type\":\"\",\"checked\":true},{\"fileName\":\"45.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/45.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/45.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":65,\"width\":65,\"extension\":\"jpg\",\"x\":213,\"y\":1437},\"type\":\"\",\"checked\":true},{\"fileName\":\"46.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/46.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/46.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":64,\"width\":64,\"extension\":\"jpg\",\"x\":1029,\"y\":1515},\"type\":\"\",\"checked\":true},{\"fileName\":\"47.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/47.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/47.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":63,\"width\":63,\"extension\":\"jpg\",\"x\":1149,\"y\":960},\"type\":\"\",\"checked\":true},{\"fileName\":\"48.jpg\",\"thumbnail\":{\"path\":\"/Users/stavrosangelis/htdocs/ahi/clericus-neo4j/resources/output/1977/thumbnails/48.jpg\",\"src\":\"http://localhost:5100/output/1977/thumbnails/48.jpg\"},\"honorificPrefix\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"diocese\":\"\",\"dioceseType\":\"\",\"default\":{\"height\":57,\"width\":57,\"extension\":\"jpg\",\"x\":833,\"y\":1833},\"type\":\"\",\"checked\":true}]}"}
* @apiParam {string} data A stringified JSON containing all available information about the classpiece.
* @apiSuccessExample {json} Success-Response:
{"status":true,"data":{"classpiece":{"error":[],"status":true,"data":{"fileName":"1977.jpg","metadata":"\"{\\\"image\\\":{\\\"default\\\":{\\\"height\\\":6464,\\\"width\\\":4715,\\\"extension\\\":\\\"jpg\\\",\\\"x\\\":0,\\\"y\\\":0,\\\"rotate\\\":0},\\\"exif\\\":{\\\"image\\\":{\\\"XResolution\\\":240,\\\"YResolution\\\":240,\\\"ResolutionUnit\\\":2,\\\"Software\\\":\\\"Adobe Photoshop Lightroom Classic 7.3.1 (Windows)\\\",\\\"ModifyDate\\\":\\\"2018:07:02 12:56:58\\\",\\\"ExifOffset\\\":172},\\\"thumbnail\\\":{},\\\"exif\\\":{\\\"ExifVersion\\\":{\\\"type\\\":\\\"Buffer\\\",\\\"data\\\":[48,50,51,48]},\\\"ColorSpace\\\":1},\\\"gps\\\":{},\\\"interoperability\\\":{},\\\"makernote\\\":{}},\\\"iptc\\\":{}}}\"","paths":["\"{\\\"path\\\":\\\"images/fullsize/125aafc838d8a62ab579148adf01fe41.jpg\\\",\\\"pathType\\\":\\\"source\\\"}\"","\"{\\\"path\\\":\\\"images/thumbnails/125aafc838d8a62ab579148adf01fe41.jpg\\\",\\\"pathType\\\":\\\"thumbnail\\\"}\""],"systemType":"{\"ref\":\"87\"}","label":"1977","resourceType":"image","status":"private","_id":"2536"}},"faces":[]},"error":false,"msg":[]}
*/
const ingestClasspiece = async (req, resp) => {
  let postData = req.body;
  if (Object.keys(postData).length === 0) {
    resp.json({
      status: false,
      data: [],
      error: true,
      msg: 'The file must not be empty',
    });
    return false;
  }

  let userId = req.decoded.id;
  let data = JSON.parse(postData.data);

  let errors = [];
  let dbClassPiece = {};
  let dbFaces = [];
  let classpiece = null;

  // 1. ingest class piece
  if (typeof data.classpiece !== 'undefined') {
    classpiece = data.classpiece;

    dbClassPiece = await ingestClasspieceImage(classpiece, userId);
    classpiece._id = dbClassPiece.data._id;
  }
  // 2. ingest and link faces
  if (typeof data.faces !== 'undefined') {
    let faces = data.faces;
    for (let face of faces) {
      await ingestPerson(face, classpiece, userId);
    }
  }

  let response = {};
  response.classpiece = dbClassPiece;
  response.faces = dbFaces;
  resp.json({
    status: true,
    data: response,
    error: false,
    msg: errors,
  });
};

const classPieceImageResource = async (imgPath) => {
  var imgDimensionsPromise = imgDimensions(imgPath);
  var exifPromise = imageExif(imgPath);
  var iptcPromise = imageIptc(imgPath);
  let output = await Promise.all([
    imgDimensionsPromise,
    exifPromise,
    iptcPromise,
  ])
    .then((data) => {
      let imageMetadata = {};
      let defaultValues = data[0];
      defaultValues.x = 0;
      defaultValues.y = 0;
      defaultValues.rotate = 0;

      let exifValues = null;
      let iptcValues = null;
      if (typeof data[1] !== 'undefined' && data[1] !== false) {
        exifValues = data[1];
      }
      if (typeof data[2] !== 'undefined' && data[2] !== false) {
        iptcValues = data[2];
      }
      imageMetadata.default = defaultValues;
      imageMetadata.exif = exifValues;
      imageMetadata.iptc = iptcValues;
      return imageMetadata;
    })
    .catch((error) => {
      console.log(error);
    });
  return output;
};

var facesImageResources = async (jsonPath, fileName) => {
  let fileData = await fs.readFileSync(
    jsonPath,
    'utf-8',
    function (error, data) {
      if (error) {
        console.log(error);
      }
      return data;
    }
  );

  let output = await new Promise((resolve) => {
    let dataJson = JSON.parse(fileData);
    if (typeof dataJson === 'string') {
      dataJson = JSON.parse(dataJson);
    }
    var facesData = facesEach(dataJson, fileName);
    facesData.then((data) => {
      resolve(data);
    });
  }).catch((error) => {
    console.log(error);
  });
  return output;
};

var facesEach = async (dataJson, fileName) => {
  var facesDataPromises = [];
  for (let i = 0; i < dataJson.length; i++) {
    let face = dataJson[i];
    var thumbnailSrc = '';
    if (typeof face.thumbnail !== 'undefined') {
      thumbnailSrc = face.thumbnail.src;
      var faceImageResourcePromise = faceImageResource(thumbnailSrc);
      facesDataPromises.push(faceImageResourcePromise);
    }
  }

  const facesdata = await Promise.all(facesDataPromises).then((data) => {
    return data;
  });
  let faces = dataJson.map((item, j) => {
    const imageData = facesdata[j];
    let newItem = {};
    let faceData = faceImageData(item, imageData.default);
    newItem.fileName = j + '.jpg';
    newItem.thumbnail = {
      path: resourcesPath + 'output/' + fileName + '/thumbnails/' + j + '.jpg',
      src: serverURL + 'output/' + fileName + '/thumbnails/' + j + '.jpg',
    };
    newItem.honorificPrefix = faceData.honorificPrefix;
    newItem.firstName = faceData.firstName;
    newItem.middleName = faceData.middleName;
    newItem.lastName = faceData.lastName;
    newItem.diocese = faceData.diocese;
    newItem.dioceseType = faceData.dioceseType;
    newItem.default = faceData.default;
    newItem.type = faceData.type;
    return newItem;
  });
  return faces;
};

var faceImageResource = async (imgPathParam = '') => {
  if (imgPathParam !== '') {
    const imgPath = imgPathParam.replace('/resources/', resourcesPath);
    const fileExists = fs.existsSync(imgPath);
    if (fileExists) {
      const imgDimensionsPromise = await imgDimensions(imgPath);
      const exifPromise = await imageExif(imgPath);
      const iptcPromise = await imageIptc(imgPath);
      const output = await Promise.all([
        imgDimensionsPromise,
        exifPromise,
        iptcPromise,
      ])
        .then((data) => {
          let imageMetadata = {};
          let exifValues = null;
          let iptcValues = null;
          if (typeof data[1] !== 'undefined' && data[1] !== false) {
            exifValues = data[1];
          }
          if (typeof data[2] !== 'undefined' && data[2] !== false) {
            iptcValues = data[2];
          }
          imageMetadata.default = data[0];
          if (exifValues !== null) {
            imageMetadata.exif = data[1];
          }
          if (iptcValues !== null) {
            imageMetadata.iptc = data[2];
          }
          return imageMetadata;
        })
        .catch((error) => {
          console.log(error);
        });
      return output;
    }
  }
  return null;
};

const faceImageData = (face, imageDefaultData = null) => {
  let faceObj = {};
  let defaultValues = {};
  if (typeof face.faceRectangle !== 'undefined') {
    let x = face.faceRectangle.left;
    let y = face.faceRectangle.top;
    defaultValues = { x: x, y: y };
  }
  let defaultData = Object.assign(imageDefaultData, defaultValues);
  // let rotate = null;
  let honorificPrefix = '';
  let firstName = '';
  let middleName = '';
  let lastName = '';
  let diocese = '';
  let dioceseType = '';
  let type = '';
  if (typeof face.honorificPrefix !== 'undefined') {
    honorificPrefix = face.honorificPrefix;
  }
  if (typeof face.firstName !== 'undefined') {
    firstName = face.firstName;
  }
  if (typeof face.middleName !== 'undefined') {
    middleName = face.middleName;
  }
  if (typeof face.lastName !== 'undefined') {
    lastName = face.lastName;
  }
  if (typeof face.diocese !== 'undefined') {
    diocese = face.diocese;
  }
  if (typeof face.dioceseType !== 'undefined') {
    dioceseType = face.dioceseType;
  }
  if (typeof face.type !== 'undefined') {
    type = face.type;
  }
  if (typeof face.rotate !== 'undefined') {
    defaultData.rotate = face.rotate;
  }
  faceObj.honorificPrefix = honorificPrefix;
  faceObj.firstName = firstName;
  faceObj.middleName = middleName;
  faceObj.lastName = lastName;
  faceObj.diocese = diocese;
  faceObj.dioceseType = dioceseType;
  faceObj.type = type;
  faceObj.default = defaultData;
  return faceObj;
};

const imageIptc = (imgPath = '') => {
  if (imgPath !== '') {
    const fileExists = fs.existsSync(imgPath);
    if (fileExists) {
      return new Promise((resolve) => {
        fs.readFile(imgPath, function (error, data) {
          if (error) {
            console.log(error);
          }
          var iptcData = IptcImage(data);
          resolve(iptcData);
        });
      }).catch((error) => {
        console.log(error);
      });
    }
  }
  return null;
};

const imageExif = (imgPath = '') => {
  if (imgPath !== '') {
    const fileExists = fs.existsSync(imgPath);
    if (fileExists) {
      return new Promise((resolve) => {
        ExifImage({ image: imgPath }, function (error, exifData) {
          if (error) {
            // console.log(error.message);
          }
          resolve(exifData);
        });
      }).catch((error) => {
        console.log(error);
      });
    }
  }
  return null;
};

const imgDimensions = (imgPath = '') => {
  if (imgPath !== '') {
    const fileExists = fs.existsSync(imgPath);
    if (fileExists) {
      return new Promise((resolve) => {
        sizeOfImage(imgPath, (err, dimensions = null) => {
          if (dimensions !== null) {
            dimensions.extension = dimensions.type;
            delete dimensions.type;
          }
          resolve(dimensions);
        });
      }).catch((error) => {
        console.log(error);
      });
    }
  }
  return null;
};

const ingestClasspieceImage = async (classpiece, userId) => {
  let classpieceRef = new TaxonomyTerm({ labelId: 'Classpiece' });
  await classpieceRef.load();

  let classpieceImage = await new Promise((resolve) => {
    // copy fullsize and thumbnail to archive directory
    let fileExtension = classpiece.default.extension;

    let hashedName = hashFileName(classpiece.label) + '.' + fileExtension;

    let fullsizeSrc =
      resourcesPath + 'images/processed/compressed/' + classpiece.fileName;
    let fullsizeTarget = archivePath + 'images/fullsize/' + hashedName;
    let fullsizePath = 'images/fullsize/' + hashedName;
    copyFile(fullsizeSrc, fullsizeTarget);

    let thumbnailSrc =
      resourcesPath + 'images/processed/thumbnails/' + classpiece.fileName;
    let thumbnailsTarget = archivePath + 'images/thumbnails/' + hashedName;
    let thumbnailsPath = 'images/thumbnails/' + hashedName;
    copyFile(thumbnailSrc, thumbnailsTarget);

    let classPieceData = {
      label: classpiece.label,
      fileName: classpiece.fileName,
      metadata: {
        image: {
          default: classpiece.default,
          exif: classpiece.exif,
          iptc: classpiece.iptc,
        },
      },
      systemType: classpieceRef._id,
      resourceType: 'image',
      paths: [
        { path: fullsizePath, pathType: 'source' },
        { path: thumbnailsPath, pathType: 'thumbnail' },
      ],
    };
    classPieceData.metadata = JSON.stringify(classPieceData.metadata);
    classPieceData.paths = classPieceData.paths.map((path) =>
      JSON.stringify(path)
    );

    let newClasspiece = new Resource(classPieceData);
    let output = newClasspiece.save(userId);
    resolve(output);
  }).catch((error) => {
    console.log(error);
  });
  return classpieceImage;
};

const ingestPerson = async (person, classpiece, userId) => {
  if (person.firstName === '') {
    person.firstName = 'Unknown';
  }
  if (person.lastName === '') {
    person.lastName = 'Unknown';
  }
  let honorificPrefix = null;
  let firstName = null;
  let middleName = null;
  let lastName = null;
  if (typeof person.honorificPrefix !== 'undefined') {
    honorificPrefix = person.honorificPrefix;
  }
  if (typeof person.firstName !== 'undefined') {
    firstName = person.firstName;
  }
  if (typeof person.middleName !== 'undefined') {
    middleName = person.middleName;
  }
  if (typeof person.lastName !== 'undefined') {
    lastName = person.lastName;
  }
  let personData = {
    honorificPrefix: honorificPrefix,
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
  };
  if (typeof person._id !== 'undefined') {
    personData._id = person._id;
  }
  let newPerson = new Person(personData);
  let ingestPersonPromise = await newPerson.save(userId);

  if (ingestPersonPromise.status) {
    // assign id to person object
    person._id = ingestPersonPromise.data._id;
    person.label = ingestPersonPromise.data.label;
    // 2. insert/update thumbnail
    let ingestPersonThumbnailPromise = await ingestPersonThumbnail(
      person,
      classpiece,
      userId
    );

    // 3. insert diocese
    let ingestDiocesePromise = await ingestDiocese(person, userId);

    // 4. link person to classpiece
    if (classpiece !== null) {
      // 4.1 get person role term id
      let role = 'student';
      if (typeof person.type !== 'undefined') {
        role = person.type;
      }
      let classpieceRelRole = new TaxonomyTerm({ labelId: role });
      await classpieceRelRole.load();

      // 4.2 link classpiece to person
      let classpieceTaxonomyTerm = new TaxonomyTerm({ labelId: 'depicts' });
      await classpieceTaxonomyTerm.load();

      let classpieceReference = {
        items: [
          { _id: classpiece._id, type: 'Resource', role: null },
          {
            _id: ingestPersonPromise.data._id,
            type: 'Person',
            role: classpieceRelRole._id,
          },
        ],
        taxonomyTermId: classpieceTaxonomyTerm._id,
      };

      await referencesController.updateReference(classpieceReference);

      // 4.2. link classpiece to thumbnail
      let classpieceThumbnailTaxonomyTerm = new TaxonomyTerm({
        labelId: 'hasPart',
      });
      await classpieceThumbnailTaxonomyTerm.load();

      let classpieceThumbnailReference = {
        items: [
          { _id: classpiece._id, type: 'Resource' },
          { _id: ingestPersonThumbnailPromise.data._id, type: 'Resource' },
        ],
        taxonomyTermId: classpieceThumbnailTaxonomyTerm._id,
      };

      await referencesController.updateReference(classpieceThumbnailReference);
    }

    // 5. link person to thumbnail
    let thumbnailTaxonomyTerm = new TaxonomyTerm({
      labelId: 'hasRepresentationObject',
    });
    await thumbnailTaxonomyTerm.load();

    let thumbnailReference = {
      items: [
        { _id: ingestPersonPromise.data._id, type: 'Person' },
        { _id: ingestPersonThumbnailPromise.data._id, type: 'Resource' },
      ],
      taxonomyTermId: thumbnailTaxonomyTerm._id,
    };
    await referencesController.updateReference(thumbnailReference);

    // 6. link person to diocese
    if (typeof ingestDiocesePromise !== 'undefined') {
      let organisationTaxonomyTerm = new TaxonomyTerm({
        labelId: 'hasAffiliation',
      });
      await organisationTaxonomyTerm.load();

      let organisationReference = {
        items: [
          { _id: ingestPersonPromise.data._id, type: 'Person' },
          { _id: ingestDiocesePromise._id, type: 'Organisation' },
        ],
        taxonomyTermId: organisationTaxonomyTerm._id,
      };
      await referencesController.updateReference(organisationReference);
    }
  }
  return person;
};

const ingestPersonThumbnail = async (person, classpiece, userId) => {
  if (classpiece === null) {
    return false;
  }
  const { label = '' } = classpiece;
  let exifData = {};
  let iptcData = {};
  const { thumbnail = null } = person;
  if (thumbnail !== null) {
    const { path = '' } = thumbnail;
    if (path !== '') {
      const exifPromise = imageExif(path);
      const iptcPromise = imageIptc(path);

      exifData = await exifPromise;
      iptcData = await iptcPromise;
    }
  }

  // get value of thumbnail resource system type
  let thumbnailRef = new TaxonomyTerm({ labelId: 'Thumbnail' });
  await thumbnailRef.load();

  let personThumbnail = await new Promise((resolve) => {
    // copy fullsize and thumbnail to archive
    let fileExtension = person.default.extension;
    let hashedName = hashFileName(person.label) + '.' + fileExtension;

    let fullsizeSrc = `${resourcesPath}output/${label}/thumbnails/${person.fileName}`;
    let fullsizeTarget = `${archivePath}images/fullsize/${hashedName}`;
    let fullsizePath = `images/fullsize/${hashedName}`;
    copyFile(fullsizeSrc, fullsizeTarget);

    let thumbnailsTarget = archivePath + 'images/thumbnails/' + hashedName;
    let thumbnailsPath = 'images/thumbnails/' + hashedName;
    copyFile(fullsizeSrc, thumbnailsTarget);

    let defaultData = {
      height: person.default.height,
      width: person.default.width,
      extension: person.default.extension,
      x: person.default.x,
      y: person.default.y,
      rotate: person.default.rotate,
    };

    let newPersonImageData = {
      label: person.label,
      fileName: person.fileName,
      metadata: {
        image: {
          default: defaultData,
          exif: exifData,
          iptc: iptcData,
        },
      },
      systemType: thumbnailRef._id,
      resourceType: 'image',
      paths: [
        { path: thumbnailsPath, pathType: 'thumbnail' },
        { path: fullsizePath, pathType: 'source' },
      ],
    };
    newPersonImageData.metadata = JSON.stringify(newPersonImageData.metadata);
    newPersonImageData.paths = newPersonImageData.paths.map((path) =>
      JSON.stringify(path)
    );

    let newPersonThumbnail = new Resource(newPersonImageData);
    let output = newPersonThumbnail.save(userId);
    resolve(output);
  }).catch((error) => {
    console.log(error);
  });
  return personThumbnail;
};

var ingestDiocese = async (person, userId) => {
  let organisation = {};
  if (person.diocese === '') {
    return;
  }
  organisation.label = helpers.addslashes(person.diocese);
  organisation.organisationType = person.dioceseType;

  // check if organisation exists
  let session = driver.session();
  let query = `MATCH (n:Organisation) WHERE n.label='${organisation.label}' RETURN n`;
  if (organisation.organisationType !== '') {
    query = `MATCH (n:Organisation) WHERE n.label='${organisation.label}' AND n.organisationType='${organisation.organisationType}' RETURN n`;
  }
  let existingOrganisation = await session
    .writeTransaction((tx) => tx.run(query, {}))
    .then((result) => {
      session.close();
      let records = result.records;
      let outputRecord = null;
      if (records.length > 0) {
        let record = records[0].toObject();
        outputRecord = helpers.outputRecord(record.n);
        return outputRecord;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  if (
    typeof existingOrganisation === 'undefined' ||
    existingOrganisation === null
  ) {
    let newOrganisation = new Organisation(organisation);
    let savedOrganisation = await newOrganisation.save(userId);
    existingOrganisation = savedOrganisation.data;
  }
  return existingOrganisation;
};

var hashFileName = (data) => {
  let timestamp = Date.now();
  let newName = data + timestamp;
  return crypto.createHash('md5').update(newName).digest('hex');
};

var copyFile = (src = null, target = null) => {
  if (src === null || target === null) {
    return 'Please provide a valid source and a valid target';
  } else {
    return new Promise((resolve) => {
      fs.copyFile(src, target, (err) => {
        if (err) {
          resolve(err);
        } else {
          resolve('File moved successfully to ' + target);
        }
      });
    });
  }
};

const patchRotate = async (req, resp) => {
  let parameters = req.query;
  let start = parameters.start;
  let end = parameters.end;
  let path = `${resourcesPath}output/`;
  const dir = await fs.readdirSync(path);
  let directories = [];
  for await (const dirent of dir) {
    let stat = await fs.lstatSync(path + dirent);
    if (stat.isDirectory()) {
      directories.push(dirent);
    }
  }
  directories.sort();
  const stringToJson = (string) => {
    if (typeof string === 'string') {
      string = JSON.parse(string);
    }
    return string;
  };
  const parseJSONFile = async (filePath) => {
    let jsonFile = await helpers.readJSONFile(filePath);
    if (typeof jsonFile === 'undefined') {
      return false;
    }
    let jsonData = stringToJson(jsonFile.data);
    let faces = jsonData.filter((f) => {
      if (typeof f.rotate !== 'undefined' && f.rotate !== 0) {
        return true;
      }
      return false;
    });
    return faces;
  };

  let files = [];
  for (let i = 0; i < directories.length; i++) {
    if (i >= start && i <= end) {
      let dir = directories[i];
      let filePath = `${path}${dir}/json/${dir}-faces.json`;
      let faces = await parseJSONFile(filePath);
      if (faces.length > 0) {
        let file = { name: dir, count: faces.length, faces: faces };
        files.push(file);
      }
    }
  }

  resp.json({
    status: true,
    data: files,
    error: [],
    msg: 'Query results',
  });
};

module.exports = {
  preIngestionReportClassPiece: preIngestionReportClassPiece,
  classPieceIdentifyDuplicates: classPieceIdentifyDuplicates,
  ingestClasspiece: ingestClasspiece,
  patchRotate: patchRotate,
};
