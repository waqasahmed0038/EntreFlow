import React, { useEffect,useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import { db } from "../Firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { AppDispatch, RootState } from "../redux/store";
import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import {setCustomerEmail, setLoading} from '../redux/slices/authSlice'
import Link from 'next/link';
import VendorNavbar from '../components/VendorEmployeeNavbar';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../components/Loading';
import { log } from 'console';
function VendorCustomers() {
    const state=useSelector((state:any)=>state.auth)
    const user=useSelector((state:any)=>state.auth.user)

    const dispatch=useDispatch<AppDispatch>()
    const [searchString,setSearchString]=useState("")
    const [searchValue,setSearchValue]=useState("")
    const loading=useSelector((state:any)=>state.auth.loading)
 const userID=useSelector((state:any)=>state.auth.id)

    const router=useRouter()
  const [allcustomers, setAllCustomers]: any = useState([]);
    
  const [customers, setCustomers]: any = useState([]);
  const getData = async () => {
    let arr: any = [];
    const data = await getDocs(collection(db, "orders"));
    data.forEach((doc: any) => {
      
        arr.push({...doc.data(),id:doc.id})
      
    });
    arr.reverse()    
    await setCustomers(arr);
    await setAllCustomers(arr)
  };
  

    useEffect(()=>{
       getData()
    },[])
    const onSearchChange=async(e:any)=>{
        setCustomers([])
        let arr=[]

        if(e.target.value=="all"){
          setSearchString(e.target.value)

            setCustomers(allcustomers)
        }else if(e.target.value="myOrders"){
          setSearchString(e.target.value)
          arr=[]
                      allcustomers.forEach((c:any)=>{
                        if(userID==c.employee.id){
                            arr.push(c)
                        }
                })
                setCustomers(arr)


        }
        
        
        else{
          arr=[]
            setSearchString(e.target.value)
            allcustomers.forEach((c:any)=>{
                    if(e.target.value==c.status){
                        arr.push(c)
                    }
            })
            setCustomers(arr)
        }
       

       
        
        
    }

    const handleClick=(email:any)=>{
        // dispatch(setCustomerEmail(email))
        // router.push(`/VendorCustomerDashboard`)
  }
const convertDate=(date:any)=>{
    return new Date(date.seconds * 1000).toLocaleDateString()
}
const compareDate=(a:any)=>{
  const date=(new Date().getTime())
              
              
  const date2= (new Date(a.seconds * 1000).getTime())
  const time=date2-date
  const res=Math.round(time /(1000*3600*24))
  
  
 
if(res<=0){
  return true
}else{
  return false
}
      

}
const handleStatus=async(e:any,id:any)=>{
    try {
        dispatch(setLoading(true))
        await updateDoc(doc(db,"orders",id),{status:e.target.value})
        getData()


        dispatch(setLoading(false))

    } catch (error) {
        dispatch(setLoading(false))

        toast.error(error.message)
        
    }
}
  return (<>
    <VendorNavbar/>
    <Toaster/>

{loading?<Loading/>:" "}





    <div className="container  mt-5 pt-5">
   

      
        <div className='row mb-4'>
<div className="col-md-6">

<select name="status" value={searchString} onChange={onSearchChange} className="form-control mt-2" >

<option value="all">all</option>
<option value="myOrders">my orders</option>
<option value="open">open</option>
<option value="qualityCheck">Quality Check</option>
<option value="packaging">packaging</option>
<option value="Delivery">Delivery</option>
<option value="pickedUp">picked up</option>
<option value="Return">Return</option>
<option value="closed">Closed</option>


</select>
</div>


</div>
        <Table striped bordered hover responsive>
      <thead  className={style.table_head}>
        <tr>
          
          <th>product Name</th>
          <th>price</th>
          <th>customer Id</th>
          <th>delivery date</th>
          <th>status</th>

        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

      return  <tr onClick={()=>handleClick(customer.email)}  key={index}>

            <td  className={compareDate(customer.deliveryDate)==false ?'': style.overDate}>{customer.product.name}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '': style.overDate}>{customer.totalPrice}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '':style.overDate} >{customer.customer}</td>
            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>{convertDate(customer.deliveryDate)}</td>
            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>

            <select name="status" value={customer.status} onChange={(e)=>handleStatus(e,customer.id)} className="form-control mt-2" >


                    <option value="open">open</option>
                    <option value="qualityCheck">Quality Check</option>
                    <option value="packaging">packaging</option>
                    <option value="Delivery">Delivery</option>
                    <option value="pickedUp">picked up</option>
                    <option value="Return">Return</option>
                    <option value="closed">Closed</option>


</select>
            </td>
            


      </tr>
    }
    )

:<tr><td>...</td>
<td>...</td>
<td>...</td>
<td>...</td>
<td>...</td>
</tr>}
       
      </tbody>
    </Table>
            
        </div>
    </>


    
  )
}

export default VendorCustomers