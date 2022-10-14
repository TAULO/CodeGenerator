const fs = require('fs');
const path = require('path');

const clientDir = path.resolve(__dirname, '../client');

exports.isSite = (extension) => {
  if (extension === '/') {
    return true;
  } else if (extension.includes('/styles') || 
    extension.includes('/scripts') || 
    extension.includes('/images') || 
    extension.includes('/node_modules')) {
    return true;
  } else {
    return false;
  }
};

exports.handleSite = (request, response, extension) => {
  let contentType = 'text/plain';
  let responseText = 'Extension not enabled.';

  if (extension === '/') {
    contentType = 'text/html';
    responseText = fs.readFileSync(clientDir + '/index.html', 'utf8');
  } else if (extension.includes('/styles')) {
    contentType = 'text/css';
    responseText = fs.readFileSync(clientDir + extension, 'utf8');
  } else if (extension.includes('/scripts')) {
    contentType = 'application/javascript';
    responseText = fs.readFileSync(clientDir + extension, 'utf8');
  } else if (extension.includes('/images')) {
    // TODO, look at extension for jpeg vs gif
    contentType = 'image/gif';
    responseText = fs.readFileSync(clientDir + extension, 'utf8');
  } else if (extension.includes('/node_modules')) {
    const nodePath = path.join(clientDir, '../');
    contentType = 'application/javascript';
    responseText = fs.readFileSync(nodePath + extension, 'utf8');
  }

  return { responseText, contentType };
};