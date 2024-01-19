const express = require('express');
const ProductManager = require('./src/ProductManager');
const CartManager = require('./src/CartManager');

const app = express();
const port = 8080; 
const productManager = new ProductManager('productos.json');
const cartManager = new CartManager('carrito.json');

app.use(express.json());

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    const products = await productManager.getProducts(limit);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  try {
    const product = await productManager.getProductById(productId);
    res.json({ product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

productsRouter.post('/', async (req, res) => {
  const newProduct = req.body;
  try {
    await productManager.addProduct(newProduct);
    res.status(201).json({ message: "Producto añadido correctamente." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

productsRouter.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  const updatedFields = req.body;
  try {
    await productManager.updateProduct(productId, updatedFields);
    res.json({ message: `Producto con ID ${productId} actualizado correctamente.` });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  try {
    await productManager.deleteProduct(productId);
    res.json({ message: `Producto con ID ${productId} eliminado correctamente.` });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.use('/api/products', productsRouter);

const cartsRouter = express.Router();

cartsRouter.post('/', (req, res) => {
  try {
    cartManager.addCart();
    res.status(201).json({ message: "Carrito creado correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = cartManager.getCartById(cartId);
    res.json({ products: cart.products });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1; 

  try {
    cartManager.addProductToCart(cartId, productId, quantity);
    res.status(201).json({ message: `Producto con ID ${productId} añadido al carrito con ID ${cartId} correctamente.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

productManager.addProduct({
  title: "Audi TT",
  description: "Un coupé deportivo de diseño aerodinámico y rendimiento excepcional. Elegancia y emoción en cada detalle.",
  price: 60000,
  thumbnail: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Audi_TT_Coup%C3%A9_2.0_TFSI_quattro_S-line_%288S%29_%E2%80%93_Frontansicht%2C_3._April_2015%2C_D%C3%BCsseldorf.jpg",
  code: "P001",
  stock: 3
});

productManager.addProduct({
  title: "Ford Mustang",
  description: "Un legendario coupé con un estilo atemporal y un poderoso motor que personifica la potencia y la esencia del automovilismo americano.",
  price: 45000,
  thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/2018_Ford_Mustang_5.0_coupe.jpg/640px-2018_Ford_Mustang_5.0_coupe.jpg",
  code: "P002",
  stock: 4
});

const allProducts = productManager.getProducts();
console.log("Todos los productos:", allProducts);

const productIdToAdd = allProducts[0].id;
const quantityToAdd = 2;

let cartId;

try {
  cartId = cartManager.addCart();
  console.log(`Nuevo carrito creado con ID: ${cartId}`);
  
  cartManager.addProductToCart(cartId, productIdToAdd, quantityToAdd);
  console.log(`Producto con ID ${productIdToAdd} añadido al carrito con ID ${cartId}`);
} catch (error) {
  console.error(error.message);
}

try {
  const cart = cartManager.getCartById(cartId);
  console.log(`Productos en el carrito con ID ${cartId}:`, cart.products);
} catch (error) {
  console.error(error.message);
}

const productIdToRemove = allProducts[2].id;

try {
  cartManager.removeProductFromCart(cartId, productIdToRemove);
  console.log(`Producto con ID ${productIdToRemove} eliminado del carrito con ID ${cartId}`);
} catch (error) {
  console.error(error.message);
}