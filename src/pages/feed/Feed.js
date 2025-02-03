import { useContext, useEffect, useState, useCallback } from 'react'
import { url } from '../../constants/urls'
import axios from 'axios'
import { AuthContext } from '../../global/Context'
import { Searchbar } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    TouchableOpacity,
    Text,
    ScrollView,
    StyleSheet,
    View,
    BackHandler,
    RefreshControl,
    Image
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
                authorization: await AsyncStorage.getItem('token')
            }
        }    
          
        axios.get(`${url}/restaurants`, headers).then(res=>{
            setRestaurants(res.data)
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const restaurantDetail = async(id)=>{
        const headers = {
            headers: {
                authorization: await AsyncStorage.getItem('token')
            }
        }
        axios.get(`${url}/restaurants/${id}`, headers).then(res=>{
            setters.setRestaurant(res.data)
            const restaurantName = res.data.name
            axios.get(`${url}/restaurant_products/${id}`, headers).then(res=>{
                setters.setProducts(res.data)
                props.navigation.navigate('Detail', { title: restaurantName })
            }).catch(e=>{
                alert(e.response.data)
            })
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
        <View style={{marginBottom:65}}>
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
                                    <Image  style={styles.avatar}
                                        source={{uri: rest.logourl}}/>
                                </TouchableOpacity>
                                <Text style={styles.restName}>{rest.name}</Text>
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
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: 'red',
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 20,
        borderRadius: 10
    },
    avatar: {
        backgroundColor: 'white',
        width: '100%',
        height: 150,
        borderRadius: 10
    },
    restName: {
        fontSize: 20,
        textAlign: 'center',
        color: 'red',
        margin: 10 
    }
})

export default Feed
