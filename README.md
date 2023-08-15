# Proyecto Coder House
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

# Implementacion de WEB SOCKET para interactuar entre el cliente y el servidor de forma inmediata.

Configuracion del proyecto para que este trabaje con HANDLEBARS Y WEBSOCKET.

1. Implementacion de plantillas HANDLEBARS e instalacion de socket.io
2. Cracion de las diferentes vistas de handlebars dentro de la carpeta view.
3. Integracion de socket.io en la vista realTimeProducts para que esta se renderice de manera automatica sin actualizar la pagina.

# Integracion de mongoose al proyecto.

Configuracion del proyecto agregando los siguientes elementos:
1. Persistencia de Mongo y mongoose.
2. Creacion de una base de datos llamada "ecommerce" dentro de ATLAS, creando las colecciones: "carts", "chatmessages", "products" con sus respectivos SCHEMAS.
3. Separacion de los managers de FILESYSTEM de los managers de MONGODB en una carpeta llamada DAO
4. Implementacion de un CHAT con todas sus partes, guardando los messages en MONGODB.
5. Integracion de POPULATIONS para la creacion de los productos en el carrito de compras (carts).

# Implementacion de Paginate, Sort, Populations, Query y Limit.

Configuracion del proyecto agregando los siguientes elementos:
1. En el HOME, se dividieron los productos en paginas dependiendo del limit que se aplique en las mismas.
2. Tambien se agrego la posibilidad de buscar a traves de QUERY por la seccion que el cliente desee. Por ejemplo: {"title":"Tomate"´}, esto buscara solo el producto que tenga como title: Tomate.
3. Implementacion busqueda por precios de manera ascendente o descendente. Por ejemplo: sort=asc ordenera los productos de menor a mayor tomando como referencia su precio. En cambio, sort=desc ordenara los productos de mayor a menor.
4. A traves de POPULATIONS podemos integrar los productos dentro del carrito de compras.
5. Creacion de un nuevo VIEW llamado Carts que nos permite ver el carrito que nosotros deseamos buscandolo por su ID. En este se imprimiran los productos que esten dentro de este carrito y precio total de todos estos productos.
6. Posibilidad de editar el QUANTITY de los productos que estan dentro del carrito.
7. Posibilidad de editar el array de products de un carrito.
8. Posibilidad de borrar un producto dentro de un carrito determinado, utilizando sus ID's
9. Posibilidad de borrar un carrito de compras completo mediante su ID
