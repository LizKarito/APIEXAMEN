import {Router} from 'express'
import {login,
    listarEquipos,
    obtenerPartidosActivos,
    obtenerPartidosCerrados,
    listarResultado,
    registrarPartido,
    registrarPronostico,
    actualizarResultado,
    ResultadoAcertaron,
    ganador} from '../controladores/examenCtrl.js'
const router=Router()
// armar nuestras rutas

router.get('/equipos',listarEquipos) //select
router.post('/login',login) //insert
router.get('/partidosactivos',obtenerPartidosActivos) //select
router.get('/partidoscerrados',obtenerPartidosCerrados) //select
router.get('/resultados',listarResultado) //select
router.post('/partido',registrarPartido) //insert
router.post('/pronostico',registrarPronostico) //insert
router.put('/actualizarPartido/:id',actualizarResultado)//update
router.get('/acertaron/:id',ResultadoAcertaron)
router.get('/ganador/:id',ganador)

/*router.patch('/clientes/:id',patchCliente)//update
router.delete('/clientes/:id',deleteCliente)//delete
*/
export default router