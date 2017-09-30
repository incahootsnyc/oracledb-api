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

  getRequirePaths: function(fileTree) {

    const buildRoute = (branch) => {
      if (!branch.children) return [branch.name];

      const namesArray = branch.children.map((file) => {
        if (!file.children) {
          return `${branch.name}/${file.name}`;
        } 
          
        return `${branch.name}/${buildRoute(file)}`;
      });
  
      return namesArray;
    };

    const routes = fileTree.map(buildRoute).reduce((acc, arr) => {
      return acc.concat(arr);
    }, []);

    return routes;
  }
  
}

module.exports = directoryHelper;
