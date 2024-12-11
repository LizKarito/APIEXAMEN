import { conmysql } from '../db.js'

export const login = async (req, res) => {
    const { usuario, clave } = req.body;
    if (!usuario || !clave) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }
    try {
      const [rows] = await conmysql.execute('SELECT u.*,p.descripcion FROM usuario u, perfil p WHERE u.per_id=p.per_id and usuario = ?', [usuario]);
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }
      const user = rows[0];
      if (clave !== user.clave) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
      // Si la contraseña es correcta, retornamos el éxito
      res.status(200).json({
        message: 'Login exitoso',
        data:user
      });
  
    } catch (error) {
      res.status(500).json({ message: 'Error al autenticar', error });
    }
  };

  export const listarEquipos = async (req, res) => {
    try {
      // Obtener todos los equipos de la base de datos
      const [equipos] = await conmysql.execute('SELECT * FROM equipo');
      // Si no hay equipos, retornar un mensaje
      if (equipos.length === 0) {
        return res.status(404).json({ message: 'No se encontraron equipos' });
      }
      // Retornar la lista de equipos
      res.status(200).json(equipos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los equipos', error });
    }
  };

  export const listarResultado = async (req, res) => {
    try {
      // Obtener todos los equipos de la base de datos
      const [equipos] = await conmysql.execute('SELECT * FROM resultado');
      // Si no hay equipos, retornar un mensaje
      if (equipos.length === 0) {
        return res.status(404).json({ message: 'No se encontraron resultados' });
      }
      // Retornar la lista de equipos
      res.status(200).json(equipos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los resultados', error });
    }
  };

  export const obtenerPartidosActivos = async (req, res) => {
    try {
      const [result] = await conmysql.execute(
        `SELECT 
          p.id_par,
          e1.nombre_eq AS equipo_1,
          e2.nombre_eq AS equipo_2
         FROM partido p
         JOIN equipo e1 ON p.eq_uno = e1.id_eq
         JOIN equipo e2 ON p.eq_dos = e2.id_eq
         WHERE p.fecha_par > NOW() and 
         p.estado_par='activo'; `
      );
      res.status(200).json(result);  // Retorna los partidos activos
    } catch (error) {
      res.status(500).json({ message: 'Error al recuperar los partidos activos', error });
    }
  };
  export const obtenerPartidosCerrados = async (req, res) => {
    try {
      const [result] = await conmysql.execute(
        `SELECT 
          p.id_par,
          e1.nombre_eq AS equipo_1,
          e2.nombre_eq AS equipo_2
         FROM partido p
         JOIN equipo e1 ON p.eq_uno = e1.id_eq
         JOIN equipo e2 ON p.eq_dos = e2.id_eq
         WHERE p.estado_par='cerrado'; `
      );
      res.status(200).json(result);  // Retorna los partidos activos
    } catch (error) {
      res.status(500).json({ message: 'Error al recuperar los partidos activos', error });
    }
  };
  
  export const registrarPartido = async (req, res) => {
    const { eq_uno, eq_dos, fecha_par } = req.body;
  
    try {
      // Verificar que los equipos existen
      const [equipos] = await conmysql.execute(
        'SELECT * FROM equipo WHERE id_eq IN (?, ?)',
        [eq_uno, eq_dos]
      );
  
      if (equipos.length !== 2) {
        return res.status(400).json({ message: 'Uno o ambos equipos no existen' });
      }
  
      // Insertar el partido
      await conmysql.execute(
        'INSERT INTO partido (eq_uno, eq_dos, fecha_par, estado_par) VALUES (?, ?, ?, ?)',
        [eq_uno, eq_dos, fecha_par, 'activo']
      );
  
      res.status(201).json({ message: 'Partido registrado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar el partido', error });
    }
  };

  export const registrarPronostico = async (req, res) => {
    const { id_usr, id_par, id_res, valor } = req.body;
  
    // Aseguramos que el id_usr sea válido, si no lo es, se asigna un valor por defecto (id_usr = 2)
    const usuario = id_usr; 
  
    // Verificamos que los demás campos sean válidos
    if (!id_par || !id_res || valor == null) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
  
    try {
      const [result] = await conmysql.execute(
        'INSERT INTO pronostico (id_usr, id_par, id_res, valor, fecha_registro) VALUES (?, ?, ?, ?, NOW())',
        [usuario, id_par, id_res, valor]
      );
      res.status(201).json({ message: 'Pronóstico registrado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar el pronóstico', error });
    }
  };

  export  const actualizarResultado =async (req, res) => {
try{
    const { id_res } = req.body;
    const { id } = req.params;
    //res.json({ok:id})
    await conmysql.execute(
      'UPDATE partido SET id_res = ?, estado_par = "cerrado" WHERE id_par = ?',
      [id_res, id]
    );
    
    res.status(201).json({ message: 'Pronóstico registrado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el pronóstico', error });
  }
};


export const ResultadoAcertaron = async (req, res) => {
  try {
    // Recupera todos los resultados disponibles
    const { id } = req.params;
    const [results] = await conmysql.execute(
      'SELECT Usuario.cedula, Usuario.nombres, Resultado.descripcion_res,Pronostico.valor FROM Partido INNER JOIN Pronostico ON Partido.id_par = Pronostico.id_par INNER JOIN Resultado ON Partido.id_res = Resultado.id_res AND Pronostico.id_res = Resultado.id_res INNER JOIN Usuario ON Pronostico.id_usr = Usuario.id_usr where Pronostico.id_par='+id
    );
    res.status(200).json(results);  // Devuelve todos los resultados disponibles
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar los resultados', error });
  }
};
export const ganador = async (req, res) => {
  try {
    // Recupera todos los resultados disponibles
    const { id } = req.params;
    const [results] = await conmysql.execute(
      'SELECT Usuario.cedula, Usuario.nombres, Resultado.descripcion_res,(select sum(valor) from Pronostico where id_par=?) as total,TRUNCATE((select sum(valor) from Pronostico where id_par=5)*0.1,2) as valorGana FROM Partido INNER JOIN Pronostico ON Partido.id_par = Pronostico.id_par INNER JOIN Resultado ON Partido.id_res = Resultado.id_res AND Pronostico.id_res = Resultado.id_res INNER JOIN Usuario ON Pronostico.id_usr = Usuario.id_usr where Pronostico.id_par=?',
      [id, id]
    );
    const cantidad=results.length
    const posGanador=getRandomInt(cantidad);
    res.status(200).json(results[posGanador]);  // Devuelve todos los resultados disponibles
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar los resultados', error });
  }
};


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


  