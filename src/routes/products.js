const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager('productos.json');

router.get('/', (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    const products = productManager.getProducts(limit);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  try {
    const product = productManager.getProductById(productId);
    res.json({ product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  const updatedFields = req.body;
  try {
    productManager.updateProduct(productId, updatedFields);
    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  try {
    productManager.deleteProduct(productId);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  const newProduct = req.body;
  try {
    const product = productManager.addProduct(newProduct);
    res.json({ product, message: 'Producto agregado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;