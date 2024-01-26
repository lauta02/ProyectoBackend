const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const ProductManager = require('./src/ProductManager');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

const productManager = new ProductManager('productos.json');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(express.json());

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    const products = await productManager.getProducts(limit);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  try {
    const product = await productManager.getProductById(productId);
    res.json({ product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/realtimeproducts', (req, res) => {
  const products = productManager.getProducts();
  res.render('realTimeProducts', { products });
});

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('addProduct', (product) => {
    productManager.addProduct(product);
    io.emit('updateProducts', productManager.getProducts());
  });

  socket.on('deleteProduct', (productId) => {
    productManager.deleteProduct(productId);
    io.emit('updateProducts', productManager.getProducts());
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const initialProducts = [
  {
    title: "Audi TT",
    description: "Un coupé deportivo de diseño aerodinámico y rendimiento excepcional. Elegancia y emoción en cada detalle.",
    price: 60000,
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Audi_TT_Coup%C3%A9_2.0_TFSI_quattro_S-line_%288S%29_%E2%80%93_Frontansicht%2C_3._April_2015%2C_D%C3%BCsseldorf.jpg",
    code: "P001",
    stock: 3
  },
  {
    title: "Ford Mustang",
    description: "Un legendario coupé con un estilo atemporal y un poderoso motor que personifica la potencia y la esencia del automovilismo americano.",
    price: 45000,
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/2018_Ford_Mustang_5.0_coupe.jpg/640px-2018_Ford_Mustang_5.0_coupe.jpg",
    code: "P002",
    stock: 4
  }
];

initialProducts.forEach(product => productManager.addProduct(product));

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});