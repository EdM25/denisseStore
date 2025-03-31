const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier');

// Ruta del archivo HTML que quieres minificar
const htmlFilePath = path.join(__dirname, 'index.html'); // Cambia 'index.html' si es otro archivo

// Leer el archivo HTML
const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

// Minificar el contenido HTML
const minifiedHtml = minify(htmlContent, {
    removeComments: false, // Elimina los comentarios
    collapseWhitespace: true, // Elimina espacios innecesarios
    removeAttributeQuotes: true, // Elimina las comillas de los atributos si es posible
    minifyCSS: true, // Minifica el CSS dentro del HTML
    minifyJS: true, // Minifica el JS dentro del HTML
});

// Escribir el archivo minificado en el mismo lugar o en uno nuevo
fs.writeFileSync(path.join(__dirname, 'index.min.html'), minifiedHtml); // Cambia el nombre del archivo si es necesario
console.log('El archivo HTML ha sido minificado exitosamente.');