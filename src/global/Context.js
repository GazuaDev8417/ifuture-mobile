import { createContext, useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { url } from "../constants/urls"
import axios from 'axios'


export const AuthContext = createContext()


function AuthProvider(props){
    const [restaurant, setRestaurant] = useState([])
    const [restaurantId, setRestaurantId] = useState('')
    const [product, setProduct] = useState(1)
    const [dish, setDish] = useState({})
    const [dishId, setDishId] = useState('')
    const [visible, setVisible] = useState(false)
    const [bag, setBag] = useState([])
    const [profile, setProfile] = useState({})
    const [demands, setDemands] = useState([])
    const [request, setRequest] = useState({})
    const [address, setAdress] = useState({})
    const navigation = useNavigation()



    const getToken = async(tk)=>{
        try{

            await AsyncStorage.setItem('token', tk)            

        }catch(e){
            alert(e)
        }
    }
    

    const add = (ds)=>{
        setDishId(ds.id)
        setDish(ds)
        setVisible(true)
    }


    const addToCart = (ds)=>{
        const newBag = [...bag, ds]
        setBag(newBag)
        navigation.navigate('Carrinho')
        setVisible(false)                
    }


    const getProfile = async()=>{
        const headers = {
            headers: {
                auth: await AsyncStorage.getItem('token')
            }
        }
        axios.get(`${url}/profile`, headers).then(res=>{
            setProfile(res.data.user)
        }).catch(e=>{
            alert(e.response.data)
        })
    }
    
    
    const historicRequests = async()=>{
        const headers = {
            headers: {
                auth: await AsyncStorage.getItem('token')
            }
        }
        axios.get(`${url}/orders/history`, headers).then(res=>{
            setDemands(res.data.orders)
        }).catch(e=>{
            alert(e.response.data.message)
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



    const states = { restaurant, product, visible, dish, bag, dishId, profile,
        restaurantId, demands, request, address }
    const setters = { getToken, setRestaurant, setProduct, setVisible, add, addToCart,
        setBag, setRestaurantId }
    const requests = { getProfile, historicRequests, activeRequest, registeredAddress }



    return(
        <AuthContext.Provider value={{ states, setters, requests }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthProvider