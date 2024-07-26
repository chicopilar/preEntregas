const socket = io()

socket.emit('message', "Comunicandome desde websocket")

document.addEventListener('DOMContentLoaded', () => {
  const renderProducts = (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach((product) => {
      const li = document.createElement('li');
      li.textContent = `ID: ${product.id} - Title: ${product.title} - Description: ${product.despcription} - Code: ${product.code} - Price: $${product.price} - Stock: ${product.stock} - Category: ${product.category} - Thumbnails: ${product.thumbnails} - Status: ${product.status}`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => socket.emit('deleteProduct', product.id);
      li.appendChild(deleteButton);
      productList.appendChild(li);
    });
  };

  socket.on('products', (products) => {
    renderProducts(products);
  });

  const productForm = document.getElementById('productForm');
  productForm.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('id').value;
    const title = document.getElementById('title').value;
    const despcription = document.getElementById('despcription').value;
    const code = document.getElementById('code').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    const thumbnails = document.getElementById('thumbnails').value;


    socket.emit('addProduct', {id, title, despcription, code, price, stock, category, thumbnails});
    productForm.reset();
  };
});
