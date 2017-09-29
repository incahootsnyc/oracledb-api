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

  getRequirePathsRecursive: function(fileTree, parentFolders) {
    const _this = this;
    let filePaths = [];
    parentFolders = parentFolders || [];

    fileTree.forEach(file => {
      let parentPath = '';
      if (!file.children) {

        if (parentFolders.length > 0) {

          parentFolders.forEach(parentFolder => {
              parentPath += parentFolder + '/';
          });

          filePaths.push((parentPath + file.name).slice(0, -3));
        } else {
          filePaths.push(file.name.slice(0, -3));
        }

      }
      else if (file.children.length > 0) {
        parentFolders.push(file.name);
        const children = _this.getRequirePathsRecursive(file.children, parentFolders);
        filePaths = filePaths.concat(children);
        parentFolders = [];
      }

    });

    return filePaths;
  }
}

module.exports = directoryHelper;
