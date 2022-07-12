const app = new Vue ({
    el: '#app',
    data: {
        productos: [],
        errored: false,
        loading: true,
        nuevo: false,
        modificarID: 0,
        titulo: '',
        expresionesRegulares: {
            nombre: /^[a-zA-Z0-9]/,
            monto: /^[0-9.]/,
            mail: /^[^@]+@[^@]+\.[a-zA-Z]/,
        },
        errores: {
            errorNombre: false,
            errorPrecio: false,
            errorStock: false,
        },
        nuevoProducto: {
            nombre: '',
            precio: '',
            stock: '',
            img: []
        }
    },
    methods: {
        validar () {
            if(this.nuevoProducto.nombre.length > 3 && this.nuevoProducto.nombre.length < 30 && this.expresionesRegulares.nombre.test(this.nuevoProducto.nombre) == true) {
                this.errores.errorNombre = false
                if (this.nuevoProducto.precio > 0 && this.expresionesRegulares.monto.test(this.nuevoProducto.precio) == true) {
                    this.nuevoProducto.precio = parseFloat(this.nuevoProducto.precio)
                    this.errores.errorPrecio = false
                    if (this.nuevoProducto.stock > 0 && this.expresionesRegulares.monto.test(this.nuevoProducto.stock) == true) {
                        this.nuevoProducto.stock = parseInt(this.nuevoProducto.stock)
                        this.errores.errorStock = false
                    }else {
                        console.log('error en el stock', this.nuevoProducto)
                        this.errores.errorStock = true
                    }
                }else{
                    console.log('error en el precio', this.nuevoProducto)
                    this.errores.errorPrecio = true
                }
            }else {
                console.log('error en el nombre', this.nuevoProducto)
                this.errores.errorNombre = true
            }
        },
        fetchData(url) {
            fetch(url)
                .then(response => response.json())
                .then (data => {
                    this.productos = data;
                    this.loading = false;
                })
                .then(() => {
                    for (i in this.productos) {
                        this.productos[i].precio = parseFloat(this.productos[i].precio)
                        
                    }
                })
                .catch (err => {
                    this.errored = true;
                    alert("error al cargar")
                    console.log(err)
                })
        },
        mostrarNuevo(x) {
            this.titulo = x
            this.nuevo = true
            if (x == 'Cargar') {
                this.nuevoProducto.nombre = ''
                this.nuevoProducto.precio = ''
                this.nuevoProducto.stock = ''
                this.nuevoProducto.img = []
            }
        },
        nuevoProductoCargar () {
            this.validar()
            if (this.errores.errorNombre == false && this.errores.errorPrecio == false && this.errores.errorStock == false) {
                let producto = {...this.nuevoProducto}
                let url = "https://quiet-harbor-36470.herokuapp.com/productos"
                var options = {
                    body: JSON.stringify(producto),
                    method:'POST',
                    headers: {
                        'Content-Type':'application/json'
                    }
                }
                fetch(url, options)
                    .then(() => {
                        this.productos = []
                        var url1 = 'https://quiet-harbor-36470.herokuapp.com/productos'
                        this.fetchData(url1)
                    })
                    .catch(err => {
                        this.errored = true
                        alert("error al grabar")
                        console.log(err)
                    })
                this.nuevoProducto.nombre = ''
                this.nuevoProducto.precio = ''
                this.nuevoProducto.stock = ''
                this.nuevoProducto.img = []
            }else {
                console.log('validacion erronea')
            }
        },
        cargarModificar (x,y) {
            this.modificarID = y
            this.mostrarNuevo(x)
            let url = "https://quiet-harbor-36470.herokuapp.com/productos/"+y
            var options = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }
            fetch(url, options)
                .then(response => response.json())
                .then (data => {
                    this.nuevoProducto = data;
                    this.loading = false;
                })
                .catch (err => {
                    this.errored = true;
                    alert("error al cargar")
                    console.log(err)
                })
        },
        modificar () {
            this.validar()
            if (this.errores.errorNombre == false && this.errores.errorPrecio == false && this.errores.errorStock == false) {
                let url = "https://quiet-harbor-36470.herokuapp.com/productos/"+this.modificarID
                let producto;
                producto = {...this.nuevoProducto}
                var options = {
                    body: JSON.stringify(producto),
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow'
                }
                fetch(url, options)
                        .then(() => {
                            this.productos = []
                            var url1 = 'https://quiet-harbor-36470.herokuapp.com/productos'
                            this.fetchData(url1)
                            this.nuevoProducto.nombre = ''
                            this.nuevoProducto.precio = ''
                            this.nuevoProducto.stock = ''
                            this.nuevoProducto.img = []
                        })
                        .catch(err => {
                            this.errored = true
                            alert("error al grabar")
                            console.error(err);
                        })
            }else{
                console.log('modificacion erronea')
            }
        },
        cerrar () {
            this.nuevo = false
            this.errores.errorNombre = false
            this.errores.errorPrecio = false
            this.errores.errorStock = false
        },
        eliminar (producto) {
            var url = 'https://quiet-harbor-36470.herokuapp.com/producto/' + producto;
            var options = {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                }
            }
            fetch(url, options)
                .then(res => res.text())
                .then(() => {
                    this.productos = []
                    var url1 = 'https://quiet-harbor-36470.herokuapp.com/productos'
                    this.fetchData(url1)
                })
            .catch(err => {
                this.errored = true
                alert("error al grabar")
                console.log(err)
            })
        },
        agregarImg: function () {
            const img = document.getElementById('img').files
            let imgURL = []
            let url = ''
            const getDatos = function (file) {
                return new Promise((resolve, reject) => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onloadend = () => {
                    resolve(fileReader.result)
                }
                })
            }
            const obtenerDatos = async function (i) {
                const file = img.item(i)
                const resultado = await getDatos(file)
                url = resultado
                console.log(url)
                imgURL.push(url)
                console.log(imgURL)
            }
            if (img.length > 1) {
                for (let i = 0; i < img.length; i++) {
                obtenerDatos(i)
                }
            } else {
                obtenerDatos(0)
            }
            console.log(imgURL)
            this.nuevoProducto
            //this.nuevoProducto.img.push(imgURL)
            this.nuevoProducto.img = imgURL 
            console.log(this.nuevoProducto)
            },
    },
    created() {
        var url = 'https://quiet-harbor-36470.herokuapp.com/productos'
        this.fetchData(url)
    },
    })