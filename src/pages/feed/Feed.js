import { useContext, useEffect, useState, useCallback } from 'react'
import { url } from '../../constants/urls'
import axios from 'axios'
import { AuthContext } from '../../global/Context'
import { Searchbar, Avatar } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    TouchableOpacity,
    Text,
    ScrollView,
    StyleSheet,
    View,
    BackHandler,
    RefreshControl
} from 'react-native'




const Feed =(props)=>{
    const { setters } = useContext(AuthContext)
    const [refresh, setRefresh] = useState(false)
    const [restaurants, setRestaurants] = useState([])
    const [searchQuery, setSearchQuery] = useState('')


    
    BackHandler.addEventListener('hardwareBackPress', ()=>{
        return true
    })
    

    useEffect(()=>{
        getRestaurants()
    }, [])


    const onRefresh = useCallback(()=>{
        setRefresh(true)
        setTimeout(()=>{
            setRefresh(false)
        }, 2000)

        getRestaurants()
    }, [])


    const getRestaurants = async()=>{
        const headers = {
            headers: {
                auth: await AsyncStorage.getItem('token')
            }
        }        
        axios.get(`${url}/restaurants`, headers).then(res=>{
            setRestaurants(res.data.restaurants)
        }).catch(e=>{
            alert(e.response.data.message)
        })
    }


    const restaurantDetail = async(id)=>{
        const headers = {
            headers: {
                auth: await AsyncStorage.getItem('token')
            }
        }
        axios.get(`${url}/restaurants/${id}`, headers).then(res=>{
            setters.setRestaurant(res.data.restaurant)
            setters.setRestaurantId(id)
            props.navigation.navigate('Detail')
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const onChangeSearch = (query)=>{
        setSearchQuery(query)
    }


    const found = restaurants.filter(rest=>{
        return rest.name.toLowerCase().includes(searchQuery.toLocaleLowerCase())
    })



    return(
        <View>
            <Searchbar style={styles.searchBarStyle} onChangeText={onChangeSearch} value={searchQuery}/>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={onRefresh}/>
                    }>
                <View style={styles.logo}>
                    {found && found.map(rest=>{
                        return(
                            <View key={rest.id}
                                style={styles.container}>
                                <TouchableOpacity onPress={()=> restaurantDetail(rest.id)}>                            
                                    <Avatar.Image size={250} style={styles.avatar}
                                        source={{uri: rest.logoUrl}}/>
                                </TouchableOpacity>
                                <Text style={styles.restName}>{rest.name}</Text>
                                <Text style={styles.content}>
                                    Entrega em: {rest.deliveryTime}min{'\n'}
                                    Frete: R$ {rest.shipping.toFixed(2)}
                                </Text>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    searchBarStyle: {
        margin: 10
    },
    logo: {
        alignItems: 'center'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: 'red',
        padding: 10,
        margin: 10,
    },
    avatar: {
        margin: 10
    },
    restName: {
        fontSize: 20,
        color: 'red',
        fontWeight: 'bold'
    },
    content: {
        
    }
})

export default Feed
