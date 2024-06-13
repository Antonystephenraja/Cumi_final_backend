import express from 'express'
import { register,
    login,insertData,addDevice,getdevice,
update_device_info,deviceGetData,getdata,fetchAllData} from "../controller/alldata.js";


const router = express.Router();
router.post("/register", register)
router.post("/login",login)
router.get("/insertData",insertData)
///version-3 Apis
router.get('/addDevice',addDevice)
router.get('/getDevicename',getdevice)
router.post('/Update_Info',update_device_info)
router.get('/devicelast30data',deviceGetData)
router.post('/getData',getdata)
router.get('/fetchAllData',fetchAllData)

export default router;