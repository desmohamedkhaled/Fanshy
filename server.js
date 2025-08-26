// server.js (Node.js + Express example)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // ضع صفحاتك في /public

// demo contact endpoint
app.post('/api/contact', (req, res) => {
  const {name, phone, message} = req.body;
  console.log('Contact:', name, phone, message);
  // هنا ممكن تحفظ في DB أو تبعت إيميل
  res.json({ok:true, message:'تم استلام الرسالة'});
});

// demo order endpoint
app.post('/api/order', (req, res) => {
  const order = req.body;
  console.log('New order:', order);
  res.json({ok:true, orderId: Date.now()});
});

app.listen(PORT, ()=> console.log(`Server listening on http://localhost:${PORT}`));
