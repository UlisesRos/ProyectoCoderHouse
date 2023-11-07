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

# Login por formulario

Se levantará un sistema de login completo utilizando router + motor de plantillas Handlebars + base de datos para usuarios y sesiones.
1. Creacion de SIGNUP, LOGIN Y LOGOUT para que el usuario pueda registrarse, ingresar y deslogearse.
2. Todo esto se guardara en una session utilizando MongoConnect.
3. Cuando el usuario haga LOGOUT la session de destruira.
4. Al ingresar un usuario admin, tendra acceso a un sector que todos los demas usuarios no podran ingresar.
5. Se creara un Handlebars para cada una de las secciones enumeradas.
6. Si el usuario no esta logeado no podra ingresar a ningua de las paginas, siempre lo va a redirigir a la pagina de LOGIN.
7. Cuando el usuario este logeado, tendra una seccion de perfil (profile) donde podra ver sus datos y su rol.

# Editando nuestro login

Se editaran los siguientes puntos de nuestro login:
1. Se agregara un sistema de hasheo de contraseña utilizando bcrypt.
2. Se implementara passport tanto para el registro como para el acceso de nuestra pagina.
3. Se implementara un metodo de autenticacion para ingresar mediante GITHUB.

# Reestructura de nuestro servidor
1. Ordenamos nuestro proyecto por capas con el patron de diseño MVC
2. Creamos una carpeta Services donde metimos nuestro MONGODB y creamos un Singleton para conectaronos a la Base de Datos.
3. Metimos el usuario y el password del ADMIN dentro del .env para que no sea visible.

# Mejorando la arquitectura del servidor
1. Modificamos nuestra capa de persistencia con el metodo FACTORY. Esto nos permitira pasar de la utilizacion de MONGO a FILE de forma simple.
2. Implementamos el patron REPOSITORY para trabajar con el DAO en la logica de negocio.
3. Realizamos un middleware de autorizacion, que nos permite delimitar el acceso a diferentes endpoints dependiendo de si el usuario es un 'admin' o un 'Customer'. Solo los 'admin' podran crear, actualizar y eliminar un producto, y solo los 'Customer' podran enviar mensajes al chat y agregar productos al carrito.
4. Creamos un modelo ORDER el cual nos permitira crear nuestros ticket para las ordenes de compra.
5. Implementamos una ruta /:cid/purchase la cual permitira finalizar con el proceso de compra de dicho carrito. Esta corrobora el stock y la cantidad solicitada por el usuario y realiza las actualizaciones correspondientes del stock en nuestra base de dato, permitiendo al usuario comprar la cantidad de productos que se encuentran disponibles. Los productos que no pueden ser comprados por no tener el stock, se almacenaran en un array y quedaran en el carrito de compras del cliente.
6. Al finalizar la compra, se le enviara un mail al usuario con el ticket de compra y agraciendole por comprar.
7. Se modificaron y se agregaron nuevas vistas en handlebars para mejorar la parte del front y permitir al usuario distintas funcionalidades, dependiedo de su ROL en la pagina.

# Agregamos Mocking y manejo de errores
1. Agregamos dentro de las rutas de productos una ruta llamada: /api/products/mockingproducts la cual generara 100 productos nuevos a traves de FAKER.JS.
2. Se creo un CustomError para manejar los errores mas comunes de nuestra aplicacion. Esta se utilizo para manejar todos los errores de las rutas de productos, carritos de compras y usuarios. Esta nos devolvera una lista de propiedades requeridas y los tipos de errores para poder reconocerlos.

# Implementacion de Logger
1. Definimos un sistema de niveles y colores con las siguientes prioridades: debug, http, info, warn, error, fatal.
2. Implementamos un logger para desarrollo y otro para produccion.
    El logger de desarrollo nos mostrara por consola a partir del nivel debug.
    El logger de produccion nos mostrara tanto por consola como por archivo a partir del nivel info.
3. Cambiamos todos los console.log() de nuestro servidor por los diferentes loggers.
4. Creamos un transporte de archivos para enviar los logger de error al archivo error.log.
5. Creamos un endpoint /api/loggerTest que permitira probar todos los logs.

# Implementacion de nuevos aspectos al proyecto
1. Realizamos un sistema de recuperacion de contraseña, la cual envie por medio de un correo un boton que redireccione a una pagina para restablecer la contraseña. (no recuperarla).
2. Establecimos un nuevo rol para el Schema del usuario llamado 'Premium' el cual estara habilitado tambien para crear productos.
3. Modificamos el schema de producto para contar con un campo “owner”, el cual haga referencia a la persona que creó el producto.
4. Modificamos los permisos de eliminación de productos para que:
    Un usuario premium sólo pueda borrar los productos que le pertenecen.
    El admin pueda borrar cualquier producto, aún si es de un owner.
5.  Modificamos la lógica de carrito para que un usuario premium NO pueda agregar a su carrito un producto que le pertenece.
6. Implementamos una nueva ruta en el router de api/users, la cual será /api/users/premium/:uid  la cual permitirá cambiar el rol de un usuario, de “user” a “premium” y viceversa.

# Documentacion de nuestro proyecto
1. En esta seccion pudimos documentar los modulos de productos y carrito en SWAGGER. 
2. Realizamos la configuracion necesaria para poder ejecutarlo de la mejor manera.
3. Creamos un endpoint llamado: /apidocs para poder ver esta documentacion.

# Modulos de testing para nuestro proyecto
1. Realizamos módulos de testing para nuestro proyecto, utilizando los módulos de mocha + chai + supertest.
2. Para poder ejecutarlo debemos ejecutar npm run test en nuestra consola. (No olvidemos tener levantado el servidor)





