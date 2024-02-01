const express = require('express');
const app = express();
const port = 8080;

const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/carts');

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});