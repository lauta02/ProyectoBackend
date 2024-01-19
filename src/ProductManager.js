const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class ProductManager {
  constructor(filePath = 'productos.json') {
    this.path = filePath;
    this.products = [];
    this.readFromFile();
  }

  readFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.products = [];
        this.writeToFile();
      } else {
        console.error("Error al leer el archivo de productos:", error.message);
      }
    }
  }

  writeToFile() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.path, data, 'utf-8');
    } catch (error) {
      console.error("Error al escribir en el archivo de productos:", error.message);
    }
  }

  addProduct(product) {
    try {
      this.validateProduct(product);

      const newProduct = {
        ...product,
        id: uuidv4(),
        status: true,
        thumbnails: [],
      };

      this.products.push(newProduct);
      this.writeToFile();
      console.log(`Producto añadido: ${newProduct.title}`);
    } catch (error) {
      console.error("Error al agregar el producto:", error.message);
    }
  }

  validateProduct(product) {
    const requiredFields = ["title", "description", "code", "price", "stock", "category"];
    for (const field of requiredFields) {
      if (!product[field]) {
        throw new Error(`El campo "${field}" es obligatorio.`);
      }
    }
  }
}

module.exports = ProductManager;