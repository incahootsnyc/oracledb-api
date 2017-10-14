 
/**
 * dynamically discovers routes so we don't have to register newly added route files in app.js
 */

const fs = require('fs');

function getFilesRecursive(folder) {
  const fileContents = fs.readdirSync(folder);

  const fileTree = fileContents.map(name => {
    const path = `${folder}/${name}`;
    const stats = fs.lstatSync(path);

    if (stats.isDirectory()) {
      return { name, children: getFilesRecursive(path) };
    } else {
      return { name };
    }
  });

  return fileTree;
}

function flatten(arrayOfArrays) {
  return arrayOfArrays.reduce((flattened, item) =>
    flattened.concat(Array.isArray(item) ? flatten(item) : [item]), []);
}

function getRequirePaths(fileTree, parentPath) {
  const routes = fileTree.map(branch => {
    const path = `${(parentPath || '')}/${branch.name}`;
    if (!branch.children) return path;
    return getRequirePaths(branch.children, path);
  });

  return flatten(routes);
}

module.exports = {
  flatten,
  getFilesRecursive,
  getRequirePaths
};
