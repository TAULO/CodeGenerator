var fs = require('fs');
var _ = require('lodash');

var videoFileExtensions = ['avi', 'mpeg', 'mpg', 'mp4', 'mkv'];
var videoFileExtensionsRegEx = createRegEx(videoFileExtensions);

var subTitleFileExtensions = ['srt'];
var subTitleFileExtensionsRegExp = createRegEx(subTitleFileExtensions);


function findPathToFile(pathWithoutExtension, extensions) {
  var path;
  _.each(extensions, function(extension) {
    var pathToCheck = pathWithoutExtension + '.' + extension
    if (fs.existsSync(pathToCheck)) {
      path = pathToCheck;
      return false;
    }
  });
  return path;
}

function createRegEx (fileExtensions) {
  return new RegExp(fileExtensions.join('|'));
}

function findFiles(path) {
  var match = path.match(/([^]*)\.([^.]*)$/);
  var pathWithoutExtension = match[1];
  var extension = match[2];
  var videoPath;
  var subtitlePath;

  if (extension.match(videoFileExtensionsRegEx)) {
    videoPath = path;
    subtitlePath = findPathToFile(pathWithoutExtension, subTitleFileExtensions);
  } else if (extension.match(subTitleFileExtensionsRegExp)) {
    videoPath = findPathToFile(pathWithoutExtension, videoFileExtensions);
    subtitlePath = path;
  }

  if (videoPath && subtitlePath) {
    return {
      videoPath: videoPath,
      subTitlePath: subtitlePath
    };
  }

  return {
    error: 'Cant find ' + (!videoPath ? 'video' : 'subtitle') + 'file.'
  }
}

module.exports = findFiles;