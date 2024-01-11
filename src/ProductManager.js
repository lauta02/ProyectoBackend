const fs = require('fs');

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
      this.updateNextProductId();
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.products = [];
        this.nextProductId = 1;
        this.writeToFile();
      } else {
        console.error("Error al leer el archivo:", error.message);
      }
    }
  }

  writeToFile() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.path, data, 'utf-8');
    } catch (error) {
      console.error("Error al escribir en el archivo:", error.message);
    }
  }

  updateNextProductId() {
    const maxId = Math.max(...this.products.map(product => product.id), 0);
    this.nextProductId = maxId + 1;
  }

  addProduct(product) {
    try {
      this.validateProduct(product);

      if (this.products.some(p => p.code === product.code)) {
        throw new Error("Ya existe un producto con el mismo código.");
      }

      const newProduct = {
        ...product,
        id: this.nextProductId++
      };

      this.products.push(newProduct);
      this.writeToFile();
      console.log(`Producto añadido: ${newProduct.title}`);
    } catch (error) {
      console.error("Error al agregar el producto:", error.message);
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);

    if (product) {
      return product;
    } else {
      throw new Error("Producto no encontrado.");
    }
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(p => p.id === id);

    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields };
      this.writeToFile();
      console.log(`Producto actualizado con ID ${id}`);
    } else {
      console.error("Producto no encontrado para actualizar.");
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);

    if (index !== -1) {
      this.products.splice(index, 1);
      this.writeToFile();
      console.log(`Producto eliminado con ID ${id}`);
    } else {
      console.error("Producto no encontrado para eliminar.");
    }
  }

  validateProduct(product) {
    const requiredFields = ["title", "description", "price", "thumbnail", "code", "stock"];

    for (const field of requiredFields) {
      if (!product[field]) {
        throw new Error(`El campo "${field}" es obligatorio.`);
      }
    }
  }
}

module.exports = ProductManager;