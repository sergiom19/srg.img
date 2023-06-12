// Importar los módulos necesarios
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar el almacenamiento de archivos con Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Crear una instancia de Express
const app = express();

// Configurar la plantilla HTML con Poppins como fuente
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Configurar la ruta de almacenamiento de archivos
const upload = multer({ storage: storage });

// Ruta de inicio
app.get('/', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
      if (err) {
        console.log(err);
        res.render('index', { message: 'Error al obtener las imágenes', files: [] });
      } else {
        res.render('index', { message: '', files: files });
      }
    });
  });

  //subida imagen
app.post('/upload', upload.single('image'), (req, res) => {
    res.redirect('/');
  });

// Ruta para mostrar la imagen subida
app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, '/uploads/', filename));
});

// Ruta para compartir imagen individualmente
app.get('/imagen/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'uploads', filename);
    res.sendFile(imagePath);
  });

  // Ruta para eliminar todas las imágenes
app.post('/eliminar-todo', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
      if (err) {
        console.log(err);
        res.redirect('/');
      } else {
        files.forEach(file => {
          fs.unlinkSync(path.join('uploads', file));
        });
        res.redirect('/');
      }
    });
  });
  
  

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
