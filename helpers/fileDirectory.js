// dynamically discovers routes so we don't have to register newly added route files in app.js

const fs = require('fs');

const directoryHelper = {

  getFilesRecursive: function(folder) {
    const _this = this;
    const fileContents = fs.readdirSync(folder);

    const fileTree = fileContents.map(name => {
      const stats = fs.lstatSync(folder + '/' + name);

      if (stats.isDirectory()) {
        return { name, children: _this.getFilesRecursive(folder + '/' + name) };
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

  getRequirePaths: function(fileTree, parent) {

    const routes = fileTree.map(branch => {
      if (!branch.children) return (parent || '')+ '/' +branch.name;

      const parentPath = (parent || '') + '/' + branch.name;
      return this.getRequirePaths(branch.children, parentPath);
    });

    return this.flatten(routes);
  }
  
}

module.exports = directoryHelper;
