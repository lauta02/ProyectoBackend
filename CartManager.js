const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class CartManager {
  constructor(filePath = 'carrito.json') {
    this.path = filePath;
    this.carts = [];
    this.readFromFile();
  }

  readFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.carts = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.carts = [];
        this.writeToFile();
      } else {
        console.error("Error al leer el archivo de carritos:", error.message);
      }
    }
  }

  writeToFile() {
    try {
      const data = JSON.stringify(this.carts, null, 2);
      fs.writeFileSync(this.path, data, 'utf-8');
    } catch (error) {
      console.error("Error al escribir en el archivo de carritos:", error.message);
    }
  }

  createCart(newCart) {
    try {
      this.carts.push(newCart);
      this.writeToFile();
      console.log(`Carrito creado con ID: ${newCart.id}`);
    } catch (error) {
      console.error("Error al crear el carrito:", error.message);
    }
  }

  getCartProducts(cartId) {
    const cart = this.getCartById(cartId);
    return cart.products;
  }

  addProductToCart(cartId, productId, quantity) {
    try {
      const cart = this.getCartById(cartId);
      const existingProduct = cart.products.find(p => p.product === productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      this.writeToFile();
      console.log(`Producto añadido al carrito con ID ${cartId}: ${productId}`);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error.message);
    }
  }

  getCartById(cartId) {
    const cart = this.carts.find(c => c.id === cartId);

    if (cart) {
      return cart;
    } else {
      throw new Error("Carrito no encontrado.");
    }
  }
}

module.exports = CartManager;