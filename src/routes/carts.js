const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');

const cartManager = new CartManager('carrito.json');

router.post('/', (req, res) => {
  try {
    cartManager.addCart(); 
    res.json({ message: 'Carrito creado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  try {
    const products = cartManager.getCartProducts(cartId);
    res.json({ products });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    cartManager.addProductToCart(cartId, productId, quantity);
    res.json({ message: 'Producto agregado al carrito correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
