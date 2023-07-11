# ProyectoCoderHouse
# Creación de un servidor que contiene los endpoints y servicios necesarios para gestionar los productos y carritos de compra en el e-commerce
En este respositorio se desarrollo un servidor basado en Node.JS y express, que se escucha en el puerto 8080 y dispone de dos grupos de rutas: /products y /carts. Dichos endpoints estan implementados con el router de express.

Dentro de la ruta /api/products tenemos cinco rutas:
1. La ruta GET / que nos traera todos los productos.
2. La ruta GET /pid que nos traera el producto con el id que enviemos por el params.
3. La ruta POST / que nos agregara un nuevo producto.
4. La ruta PUT /pid que buscara al producto con el id que enviemos por el params y lo editara con las especificaciones que le pasemos en el body.
5. La ruta DELETE /pid que buscara al producto con el id que enviemos por el params y lo eliminara.

Dentro de la ruta /api/carts tenemos tres rutas
1. La ruta POST / que nos creara un nuevo carrito.
2. La ruta GET /cid que nos buscara el carrito con el id que enviemos por el params.
3. La ruta POST /cid/products/id que nos buscara el carrito con el id que enviemos en el primer params (cid), luego buscara products dentro de ese carrito y agregara un producto con dos elementos, products que contendra el id enviado en el tercer params (id) y una propiedad llamada quantity que nos indicara la cantidad.

