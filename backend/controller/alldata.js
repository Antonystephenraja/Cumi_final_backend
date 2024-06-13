import LoginModel from "../components/login.js";
import InputModel from "../components/devicename.js";
import DataModel from "../components/data.js";
import axios from 'axios'
import  jwt from 'jsonwebtoken';
import  bcrypt from  'bcryptjs';

export const register = async(req,res) => {
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await LoginModel.create({
            email: req.body.email,
            password: newPassword,
        })
        res.json({status: 'ok'})
    } catch (error) {
        res.json({status: 'error', error: 'Duplicate email'})
    }
  }


  export const login =async (req, res) => {
    const user = await LoginModel.findOne({
        email: req.body.email,
    })
    if(!user) {
        return {status: 'error', error: 'Invalid User'}
    }
    const isPasswordVaild = await bcrypt.compare(
        req.body.password,
        user.password
    )
    if (isPasswordVaild) {
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email
            },
            'secret123'
        )
        return res.json({status: 'ok', user: token})
    } else {
        return res.json({status: 'error', user: false})
    }
  }



  
//-----------versin 3 api-------------

    // =======Add device Api==========
    export const addDevice = async (req, res  ) => {
      try {
        for (let i = 1; i <= 30; i++) {
          const deviceIndex = i.toString().padStart(5, '0'); // Pad the index with zeros
          const deviceNameWithIndex = `XY${deviceIndex}`;
          const Location = "ABCD"
          const Thickness_Value ="0";
          const maxthickenss = 0;
          const sleeptimeing= 0;
          const newDeviceData = {
            Device_ID :deviceNameWithIndex,
            Thickness :Thickness_Value,
            Device_Name: deviceNameWithIndex,
            Location:Location,
            MaxThickness:maxthickenss,
            Sleep_time:sleeptimeing,
          };

          const newDevice = new InputModel(newDeviceData);
          await newDevice.save();
        }
        return res.status(200).json({ message: 'Devices created successfully' });
      } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
      }
    };

    export const update_device_info = async (req, res) => {
      try {
        const Id = req.body.deviceId;
        const Devicename = req.body.devicenames;
        const Location = req.body.devcelocation;
        const MaxThickness =req.body.inputValue;
        const DropdownValue =req.body.dropdowndata;
        const result = await InputModel.updateOne(
          { Device_ID: Id },
          { $set: { Device_Name: Devicename, Location: Location,MaxThickness:MaxThickness ,Sleep_time:DropdownValue} }
        );
    
        if (result.nModified === 0) {
          return res.status(404).send('Device not found or no changes to update');
        }
    
        res.status(200).send('Device info updated successfully');
      } catch (error) {
        res.status(500).send('Internal server error');
      }
    };
  


    // ===========Get the all device Name=========
    
    export const getdevice = async (req,res)=>{
      try{
        const devices = await InputModel.find();
        if (devices.length === 0) {
          return res.status(404).json({ message: 'No devices found' });
        }
        return res.status(200).json({ devices});
      }catch(error){
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

// =========== Get the device Name data =========

export const deviceGetData = async (req, res) => {
  try {
    const device = req.query.device_id;
 
    const finddata = await DataModel.find({ device_name: device }).sort({_id:-1}).limit(30);
    if (finddata) {
      return res.status(200).json(finddata);
    } else {
      return res.status(404).json({ error: "Device not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

  export const insertData = async (req, res) => {
    const {device_name, device_status, thickness, signal_strength, battery } = req.query;
    if (!device_name ||!device_status || !thickness || !signal_strength || !battery) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    try {
      const limitResponse = await axios.get('http://localhost:4000/backend/getDevicename') ;
      if (limitResponse.status === 200) {
        const response_data =limitResponse.data.devices
        const device1 = response_data.find(item => item.Device_ID === "XY00001")
        const device2 = response_data.find(item => item.Device_ID === "XY00002")
        const device3 = response_data.find(item => item.Device_ID === "XY00003")
        const device4 = response_data.find(item => item.Device_ID === "XY00004")
        const device5 = response_data.find(item => item.Device_ID === "XY00005")
        const limit = response_data.limt;
        const $ = "$";
        const spl = "#";
        const date = new Date();
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        };
        const formattedTimestamp = date.toLocaleString('en-US', options);
        const responseData = [`#,${device1.Device_ID},${device1.MaxThickness},${device1.Sleep_time},#,${device2.Device_ID},${device2.MaxThickness},${device2.Sleep_time},#,${device3.Device_ID},${device3.MaxThickness},${device3.Sleep_time},#,${device4.Device_ID},${device4.MaxThickness},${device4.Sleep_time},#,${device5.Device_ID},${device5.MaxThickness},${device5.Sleep_time}`];
        //const responseData = [String($),String(device1.devicename),String(device1.limit),Number(day),String(char), String(spl),String(device2.devicename),String(device2.limit),Number(day),String(at), String(char),String(device3.devicename),String(device3.limit),Number(day),String($), String(spl),String(device4.devicename),String(device4.limit),Number(day),String(char)];
        const updatethickness =await InputModel.updateOne(
          {Device_ID:device_name},
          {$set:{Thickness:thickness}}
        );
        if (updatethickness.nModified === 0) {
          return res.status(404).send('Device not found or no changes to update');
        }
        const newData = {
          device_name:device_name,
          device_status: device_status,
          thickness: thickness,
          signal_strength: signal_strength,
          battery_status: battery,
          timestamp: formattedTimestamp,
        };
        await DataModel.create(newData);
        res.status(200).json(responseData);
      } else {
        res.status(500).json({ error: 'Failed to retrieve limit data' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  export const fetchAllData =  (req, res) => {
    DataModel.find({}) 
      .then(data => {
        if (data.length > 0) {
          res.status(200).json(data);
        } else {
          res.status(404).json({ error: 'No data found' });
        }
      })
      .catch(err => res.status(500).json({ error: err.message }));
  }

  export const getdata = async (req, res) => {
    try {
      const a = req.body.device;
      const startdate = new Date(req.body.startdate);
      const enddate = new Date(req.body.enddate);
  
      startdate.setHours(0);
      startdate.setMinutes(0);
      enddate.setHours(23); 
      enddate.setMinutes(59); 
  
      const formattedStartDate = `${(startdate.getMonth() + 1).toString().padStart(2, '0')}/${startdate.getDate().toString().padStart(2, '0')}/${startdate.getFullYear()}, ${startdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
      const formattedEndDate = `${(enddate.getMonth() + 1).toString().padStart(2, '0')}/${enddate.getDate().toString().padStart(2, '0')}/${enddate.getFullYear()}, ${enddate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
      const api = await fetch("http://localhost:4000/backend/fetchAllData");
      const info = await api.json();
      const flattenedInfo = info.flat();
  
      const startDate = new Date(formattedStartDate);
      const endDate = new Date(formattedEndDate);
  
      const isWithinRange = (timestamp) => {
        const date = new Date(timestamp);
        return date >= startDate && date <= endDate;
      };
  
      const DeviceDataInRange = flattenedInfo.filter(item => item.device_name === a && isWithinRange(item.timestamp));
      res.json({ data: DeviceDataInRange });
  
    } catch (error) {
      res.json({ status: 'error', error: 'Duplicate email' });
    }
  }

