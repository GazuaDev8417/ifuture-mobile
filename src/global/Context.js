import { createContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { url } from "../constants/urls"
import axios from 'axios'


export const AuthContext = createContext()


function AuthProvider(props){
    const [restaurant, setRestaurant] = useState({})
    const [restaurantId, setRestaurantId] = useState('')
    const [product, setProduct] = useState(1)
    const [products, setProducts] = useState([])
    const [bag, setBag] = useState([])
    const [dish, setDish] = useState({})
    const [dishId, setDishId] = useState('')
    const [visible, setVisible] = useState(false)
    const [profile, setProfile] = useState({})
    const [demands, setDemands] = useState([])
    const [request, setRequest] = useState({})
    const [address, setAdress] = useState({})
    
    

    const getToken = async(tk)=>{
        try{

            await AsyncStorage.setItem('token', tk)            

        }catch(e){
            alert(e)
        }
    }


    const getProfile = async()=>{
        const headers = {
            headers: {
                authorization: await AsyncStorage.getItem('token')
            }
        }
        axios.get(`${url}/profile`, headers).then(res=>{
            setProfile(res.data)
        }).catch(e=>{
            alert(e.response.data)
        })
    }
    
    
    const historicRequests = async()=>{
        const headers = {
            headers: {
                authorization: await AsyncStorage.getItem('token')
            }
        }
        axios.get(`${url}/active_orders`, headers).then(res=>{
            setDemands(res.data)
            console.log(res.data)
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const activeRequest = async()=>{
        const headers = {
            headers: {
                auth: await AsyncStorage.getItem('token')
            }
        }
        axios.get(`${url}/active-order`, headers).then(res=>{
            setRequest(res.data.order)
        }).catch(e=>{
            alert(e.response.data.message)
        })
    }


    const registeredAddress = async()=>{
        const headers = {
            headers: {
                auth: await AsyncStorage.getItem('token')
            }
        }
        axios.get(`${url}/profile/address`, headers).then(res=>{
            setAdress(res.data.address)
        }).catch(e=>{
            alert(e.response.data.message)
        })
    }


    const getAllOrders = async()=>{
        const headers = {
            headers: { authorization: await AsyncStorage.getItem('token') }
        }
        axios.get(`${url}/orders`, headers).then(res=>{
            setBag(res.data)
        }).catch(e => alert(e.response.data))
    }





    const states = { restaurant, product, visible, dish, dishId, profile, bag,
        restaurantId, demands, request, address, products }
    const setters = { getToken, setRestaurant, setProduct, setVisible, setRestaurantId, setProducts, setBag }
    const requests = { getProfile, historicRequests, activeRequest, registeredAddress, getAllOrders }



    return(
        <AuthContext.Provider value={{ states, setters, requests }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthProvider