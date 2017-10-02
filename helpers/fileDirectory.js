// dynamically discovers routes so we don't have to register newly added route files in app.js

const fs = require('fs');

const directoryHelper = {

  getFilesRecursive: function(folder) {
    const fileContents = fs.readdirSync(folder);

    const fileTree = fileContents.map(name => {
      const path = `${folder}/${name}`;
      const stats = fs.lstatSync(path);

      if (stats.isDirectory()) {
        return { name, children: this.getFilesRecursive(path) };
      } else {
        return { name };
      }
    });

    return fileTree;
  },

  flatten: function(arrayOfArrays) {
    return arrayOfArrays.reduce((flattened, item) =>
      flattened.concat(Array.isArray(item) ? this.flatten(item) : [item]), []);
  },

  getRequirePaths: function(fileTree, parentPath) {

    const routes = fileTree.map(branch => {
      const path = `${(parentPath || '')}/${branch.name}`;
      if (!branch.children) return path;
      return this.getRequirePaths(branch.children, path);
    });

    return this.flatten(routes);
  }
  
}

module.exports = directoryHelper;
