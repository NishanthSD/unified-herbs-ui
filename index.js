// Importing required modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');
// Initialize the app
const app = express();
const PORT = 3000;

// Setting up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'res_images')));
app.use('/files', express.static(path.join(__dirname, 'files')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
// Function to get folder structure for files
// function getFilesStructure(dir) {
//   let structure = [];
//   const items = fs.readdirSync(dir);

//   items.forEach(item => {
//     const fullPath = path.join(dir, item);
//     const stats = fs.statSync(fullPath);

//     if (stats.isDirectory()) {
//       structure.push({
//         name: item,
//         type: 'folder',
//         subfolders: getFilesStructure(fullPath),
//         files: []
//       });
//     } else if (stats.isFile()) {
//       const relativePath = path.relative(path.join(__dirname, 'files'), fullPath);
//       structure.push({
//         name: item,
//         type: 'file',
//         path: `/files/${relativePath.replace(/\\/g, '/')}`
//       });
//     }
//   });

//   return structure;
// }

function getFilesStructure(dir) {
    let structure = [];
    const items = fs.readdirSync(dir);
  
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
  
      if (stats.isDirectory()) {
        structure.push({
          name: item,
          type: 'folder',
          subfolders: getFilesStructure(fullPath),
          files: [] // Ensure files key is present
        });
      } else if (stats.isFile()) {
        const relativePath = path.relative(path.join(__dirname, 'files'), fullPath);
        structure.push({
          name: item,
          type: 'file',
          path: `/files/${relativePath.replace(/\\/g, '/')}`
        });
      }
    });
  
    return structure;
  }
  

// Function to get folder structure
function getFolderStructure(dir) {
  let structure = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      structure.push({
        name: item,
        type: 'folder',
        subfolders: getFolderStructure(fullPath),
        files: []
      });
    } else if (stats.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(item)) {
      const relativePath = path.relative(path.join(__dirname, 'res_images'), fullPath);
      structure.push({
        name: item,
        type: 'image',
        path: `/images/${relativePath.replace(/\\/g, '/')}`
      });
    } else if (stats.isFile()) {
      const relativePath = path.relative(path.join(__dirname, 'res_files'), fullPath);
      structure.push({
        name: item,
        type: 'file',
        path: `/files/${relativePath.replace(/\\/g, '/')}`
      });
    }
  });

  return structure;
}

// Route to serve the gallery on the root path
app.get('/', (req, res) => {
  res.render('index');
});

// Route to serve the gallery on the /images path
app.get('/images', (req, res) => {
  const folderStructure = getFolderStructure(path.join(__dirname, 'res_images'));
  res.render('images', { folderStructure });
});

// Route to serve the files on the /files path
app.get('/files', (req, res) => {
    const folderStructure = getFilesStructure(path.join(__dirname, 'files'));
    res.render('files', { folderStructure });
  });

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
