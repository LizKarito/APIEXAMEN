import { conmysql } from '../db.js'
export const getProductos =
    async (req, res) => {
        try {
            const [result] = await conmysql.query('select * from productos')
            res.json({ datos: result, message: "La consulta se realizó con éxito" })
        } catch (error) {
            return res.status(500).json({ datos: null, message: 'somenting goes wrong' })
        }
    }

//función que retorna un cliente c id
export const getProductosxid =
    async (req, res) => {
        try {
            // console.log(req.params.id)
            const [result] = await conmysql.query('select * from productos where prod_id=?', [req.params.id])
            if (result.length <= 0) return res.status(404).json({
                id: 0,
                messge: "Cliente no encontrado"
            })
            res.json(result[0])
        } catch (error) {
            return res.status(500).json({ message: 'somenting goes wrong' })
        }

    }
//función que crea un nuevo cliente
export const postProductos = async (req, res) => {
    try {
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body
        const prod_imagen = req.file ? `/uploads/${req.file.filename}` : null;//capturar la imagenque se nvia desde un formulario
        console.log("Datos del producto:", req.body);  // Verifica req.body
        console.log("Archivo de imagen:", req.file);   // Verifica req.file
        //validar que no se repita la código
        const [fila] = await conmysql.query('Select * from productos where prod_codigo=?', [prod_codigo])
        if (fila.length > 0) return res.status(404).json({
            id: 0,
            messge: 'Producto con código: ' + prod_codigo + ' ya está registrado'
        })
        //console.log('consulta:'+fila.length)

        const [rows] = await conmysql.query('INSERT INTO productos ( prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES(?,?,?,?,?,?)',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen])
        ///console.log(req.body)
        // res.send("insertar")
        res.send({
            id: rows.insertId,
            messge: 'Producto registrado con éxito :)'
        })
    } catch (error) {
        return res.status(500).json({ message: error })
    }

}

export const putProductos = async (req, res) => {
    try {
        // res.send('modificado cliente')
        const { id } = req.params
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen } = req.body
        const [result] = await conmysql.query(
            'UPDATE productos SET prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=?, prod_imagen=? where prod_id=?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
        )
        if (result.affectedRows <= 0) return res.status(404).json({
            messge: 'Productos no encontrado'
        })
        const [rows] = await conmysql.query('Select * from productos where prod_id=?', [id])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({ message: 'somenting goes wrong' })
    }


}

export const patchProducto = async (req, res) => {
    try {
        // res.send('modificado cliente')
        const { id } = req.params
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen } = req.body
        const [result] = await conmysql.query(
            'UPDATE productos SET prod_codigo=IFNULL(?,prod_codigo), prod_nombre=IFNULL(?,prod_nombre), prod_stock=IFNULL(?,prod_stock), prod_precio=IFNULL(?,prod_precio), prod_activo=IFNULL(?,prod_activo), prod_imagen=IFNULL(?,prod_imagen) where prod_id=?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
        )
        if (result.affectedRows <= 0) return res.status(404).json({
            messge: 'Productos no encontrado'
        })
        const [rows] = await conmysql.query('Select * from productos where prod_id=?', [id])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({ message: 'somenting goes wrong' })
    }


}
//funcion que elimina un cliente x id
export const deleteProductos = async (req, res) => {
    try {
        const [result] = await conmysql.query('delete from productos where prod_id=?', [req.params.id])
        if (result.affectedRows <= 0) return res.status(404).json({
            id: 0,
            messge: "No pudo eliminar el producto"
        })

        res.json({
            id: 1,
            messge: 'Producto Eliminado con éxito :)'
        })
    } catch (error) {
        return res.status(500).json({ message: 'somenting goes wrong' })
    }

}


