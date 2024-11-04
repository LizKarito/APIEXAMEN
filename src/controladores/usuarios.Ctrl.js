import { conmysql } from '../db.js'
export const getUsuarios =
    async (req, res) => {
        try {
            const [result] = await conmysql.query('select * from usuarios')
            res.json(result)
        } catch (error) {
            return res.status(500).json({ message: 'somenting goes wrong' })
        }

    }
    
//función que retorna un usuarios c id
export const getUsarioxid =
    async (req, res) => {
        try {
            // console.log(req.params.id)
            const [result] = await conmysql.query('select * from usuarios where usr_id=?', [req.params.id])
            if (result.length <= 0) return res.status(404).json({
                id: 0,
                messge: "Usuario no encontrado"
            })
            res.json(result[0])
        } catch (error) {
            return res.status(500).json({ message: 'somenting goes wrong' })
        }

    }
//función que crea un nuevo cliente
export const postUsuarios = async (req, res) => {
    try {
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo} = req.body
          //validar que no se repita la cédula
          const [fila] = await conmysql.query('Select * from usuarios where usr_usuario=?', [usr_usuario])
          
          if (fila.length >0) return res.status(404).json({
            id: 0,
            messge: 'El suario : '+ usr_usuario+' ya está registrado'
        })
         
         // console.log('consulta:'+fila.length)
        const [rows] = await conmysql.query('INSERT INTO usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo ) VALUES(?,?,?,?,?,?)',
            [usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo])
        ///console.log(req.body)
        // res.send("insertar")
        res.send({
            id: rows.insertId,
            messge:'Usuario registrado con éxito :)'
        })
    } catch (error) {
        return res.status(500).json({ message: error })
    }

}

export const putUsuarios = async (req, res) => {
    try {
        // res.send('modificado cliente')
        const { id } = req.params
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo} = req.body
        const [result] = await conmysql.query(
            'UPDATE usuarios SET usr_usuario=?, usr_clave=?, usr_nombre=?, usr_telefono=?, usr_correo=?, usr_activo=? where usr_id=?',
            [usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo, id]
        )
        if (result.affectedRows <= 0) return res.status(404).json({
            messge: 'Usuario no encontrado'
        })
        const [rows] = await conmysql.query('Select * from usuarios where usr_id=?', [id])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({ message: 'somenting goes wrong' })
    }


}

export const patchUsuarios = async (req, res) => {
    try {
        // res.send('modificado cliente')
        const { id } = req.params
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo} = req.body
        const [result] = await conmysql.query(
            'UPDATE usuarios SET usr_usuario=IFNULL(?,usr_usuario), usr_clave=IFNULL(?,usr_clave), usr_nombre=IFNULL(?,usr_nombre), usr_telefono=IFNULL(?,usr_telefono), usr_correo=IFNULL(?,usr_correo), usr_activo=IFNULL(?,usr_activo) where usr_id=?',
            [usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo, id]
        )
        if (result.affectedRows <= 0) return res.status(404).json({
            messge: 'usuario no encontrado'
        })
        const [rows] = await conmysql.query('Select * from usuarios where usr_id=?', [id])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({ message: 'somenting goes wrong' })
    }


}
//funcion que elimina un cliente x id
export const deleteUsuarios = async (req, res) => {
    try {
        const [result] = await conmysql.query('delete from usuarios where usr_id=?', [req.params.id])
        if (result.affectedRows <= 0) return res.status(404).json({
            messge: "No pudo eliminar el usuario"
        })
        res.json({
            id: 1,
            messge:'usuario Eliminado con éxito :)'
        })
    } catch (error) {
        return res.status(500).json({ message: 'somenting goes wrong' })
    }

} 