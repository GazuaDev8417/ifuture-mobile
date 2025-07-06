import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../global/Context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { url } from "../../constants/urls"
import axios from "axios"
import * as Location from 'expo-location'
import { API_KEY } from '@env'
import { Ionicons } from '@expo/vector-icons'
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, FlatList } from 'react-native'




const Detail = (props)=>{
    const { states } = useContext(AuthContext)
    const restaurant = states.restaurant
    const pratos = states.products
    const [loading, setLoading] = useState(false)
    const [places, setPlaces] = useState([])
    const [showlist, setShowlist] = useState(false)



    useEffect(()=>{
        getPermission()
    }, [])

    const getPermission = async()=>{
        try{
            setLoading(true)
            const { status } = await Location.requestForegroundPermissionsAsync()
            if(status !== 'granted'){
                console.error('Permissão de localização negada')        
                setLoading(false)
                return
            }

            getLocation()
        }catch(error){
            console.error(`Errio ao obter permissão: ${error}`)
            setLoading(false)
        }
    }

    const getLocation = async()=>{
        try{
            const location = await Location.getCurrentPositionAsync({})
            if(!location.coords){
                console.error('Sem dados de localização')
                setLoading(false)
                return
            }

            fetchNearbyPlaces(location.coords.latitude, location.coords.longitude)
        }catch(error){
            console.error(`Erro ao buscar localização: ${error}`)
            setLoading(false)
        }
    }

    const fetchNearbyPlaces = async(lat, long)=>{
        try{
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=5000&type=restaurant&keyword=${encodeURIComponent(restaurant.name)}&key=${API_KEY}`)
            if(!response.data){
                console.error('Sem dados de lugares próximos')
                setLoading(false)
                return
            }
            
            setPlaces(response.data.results)
            setLoading(false)
        }catch(error){
            console.error('Erro ao buscar lugares próximos: ', error)
            setLoading(false)
        }
    }


    const filteredPlaces = places && places.filter(place =>{
        return place.name.toLowerCase().includes(restaurant.name.toLowerCase())
    })
    


    const request = async(product)=>{
        const now = new Date()
        const headers = {
            headers: { authorization: await AsyncStorage.getItem('token') }
        }
        const body = {
            product: product.name, 
            price: product.price,
            photoUrl: product.photoUrl,
            quantity: 1,
            total: product.price,
            moment: `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`, 
            restaurant: product.provider,
            description: product.description
        }
        
        axios.post(`${url}/order`, body, headers).then(res=>{
            alert(res.data)
        }).catch(e=>{
            Alert.alert(
                '',
                e.response.data,
                [
                    {
                        text:'Cancelar'
                    },
                    {
                        text:'Ok',
                        onPress: () => props.navigation.navigate('MyTabs', { screen: 'Carrinho' }) 
                    }
                ]
            )
        })
    }
    



    return(
        <>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginTop: 10, marginLeft: 5 }}>
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <FlatList
            ListHeaderComponent={
                <>
                    <Text style={styles.title}>{restaurant.category}</Text>

                    <View style={styles.imgContainer}>
                        <Image style={{
                                    width: '90%',
                                    height: 200,
                                    borderRadius: 10
                                }}
                                source={{uri: restaurant.logourl}}/>                
                    </View>

                    <View style={[styles.textContainer]}>
                        <Text>{restaurant.description}{'\n\n'}</Text>
                        <TouchableOpacity 
                            style={[styles.button, { margin:'auto', width:'80%', backgroundColor:'blue' }]}
                            onPress={() => setShowlist(prev => !prev)}>
                            <Text style={{color:'white'}}>
                                {!showlist ? 'Ver lojas mais próximas' : 'Ocultar lojas'}
                            </Text>
                        </TouchableOpacity>
                        {showlist && loading ? (
                            <Text>Carrgando...</Text>
                        ) : showlist && !loading ? (
                            <View style={{margin:10}}>
                                <View style={{ borderWidth: 1, marginTop: 5 }}/>
                                <FlatList
                                    data={filteredPlaces}
                                    keyExtractor={(place => place.place_id)}
                                    renderItem={({ item: place }) =>(
                                        <View style={{margin:5}}>
                                            <Text>
                                                <Text style={{fontWeight:'bold'}}>{place.name}{'\n'}</Text>
                                                {place.vicinity}{'\n'}
                                                {place.opening_hours && (
                                                    place.opening_hours.open_now 
                                                    ? 
                                                    <Text style={{color:'green'}}>Aberto</Text> 
                                                    :
                                                    <Text style={{color:'red'}}>Fechado</Text>
                                                    
                                                )}
                                            </Text>
                                        </View>
                                )}/>
                                {filteredPlaces.length === 0 ? <Text>Não há {restaurant.name} nas proximidades</Text> : null}
                                <View style={{ borderWidth: 1, marginTop: 5 }}/>
                            </View>
                        ) : null }
                    </View>

                    <Text style={styles.menuTitle}>Cardápio principal</Text>
                    <View style={{ borderWidth: .5, width: '90%', margin:'auto'}}/>
                </>
            }
            data={pratos}
            keyExtractor={(prato => prato.id)}
            renderItem={({ item: prato }) => {
                return(
                    <View style={styles.card}>
                        <Image                            
                            style={styles.img} 
                            source={{uri: prato.photoUrl}}/>
                        <View style={styles.legendCard}>
                            <Text style={{color:'red', marginLeft:5}}>{prato.name}</Text>
                            <Text style={{marginLeft:5}}>R$ {Number(prato.price).toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.button}
                            onPress={()=> request(prato)}>
                            <Text style={{color:'white'}}>Pedir</Text>
                        </TouchableOpacity>
                    </View>
                )
            }}/>
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        textAlign: 'center',
        color: 'red'
    },
    imgContainer: {
        alignItems: 'center',
        margin: 10
    },
    textContainer: {
        marginHorizontal: 20
    },
    menuTitle: {
        textAlign:'center',
        fontSize: 20,
        color: 'red',
        marginBottom: 15,
        marginTop: 10
    },
    details: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 10,
        borderWidth: 1,
        padding: 5,
        borderRadius: 10
    },
    legendCard: {
        marginTop: 10,
        width: '80%',
        flexDirection:'column',
        alignItems:'center'
    },
    img: {
        backgroundColor: 'white',
        width: '100%',
        height: 100,
        borderRadius: 10
    },
    button: {
        margin: 10,
        width: '90%',
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 10,
    },
    btnNearbyPlaces: {
        margin: 10,
        width: '90%',
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 5,
        borderRadius: 10,
    }
})

export default Detail