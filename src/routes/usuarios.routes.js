import {Router} from 'express'
import	{getUsuarios,getUsarioxid,postUsuarios,putUsuarios,patchUsuarios,deleteUsuarios} from '../controladores/usuarios.Ctrl.js'

const router=Router()

router.get('/usuarios',getUsuarios) //select
router.get('/usuarios/:id',getUsarioxid) //select
router.post('/usuarios',postUsuarios)
router.put('/usuarios/:id',putUsuarios)
router.patch('/usuarios/:id',patchUsuarios)
router.delete('/usuarios/:id',deleteUsuarios)
export default router