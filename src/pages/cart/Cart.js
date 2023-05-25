import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { url } from '../../constants/urls'
import { AuthContext } from '../../global/Context'
import { Avatar } from 'react-native-paper'
import Edit from 'react-native-vector-icons/Entypo'
import { Picker } from "@react-native-picker/picker"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'




const Cart = (props)=>{
    const { states, setters, requests } = useContext(AuthContext)
    const bag = states.bag
    const profile = states.profile
    const restaurant = states.restaurant
    const request = states.request
    const [value, setValue] = useState('money')



    useEffect(()=>{
        requests.getProfile()
    }, [])


    const total = ()=>{
        let sum = 0
        for(let value of bag){
            sum += value.price * states.product
        }
        return sum.toFixed(2)
    }


    const removeFromCart = (item)=>{
        const newBag = bag.filter(b=>{
            return b.id !== item.id
        })
        setters.setBag(newBag)
    }


    const shopFinish = async()=>{
        const body = {
            products: [
                {
                    id: states.dishId,
                    quantity: states.product
                }
            ],
            paymentMethod: value
        }
        const headers = {
            headers: {
                auth: await AsyncStorage.getItem('token')
            }
        }

        axios.post(`${url}/restaurants/${states.restaurantId}/order`, body, headers).then(res=>{
            alert('Compra realizada com sucesso')
        }).catch(e=>{
            alert(e.response.data.message)
        })
    }


    const checkActiveRequest = ()=>{
        if(Object.keys(request).length === 0){
            alert('Não há pedidos no momento')
        }else{
            alert(`${request.restaurantName}\n\nData do pedido: ${new Date(request.createdAt).toLocaleString()}\nExpiração: ${new Date(request.expiresAt).toLocaleString()}\nTotal: R$ ${request.totalPrice}`)
        }
    }



    return(
        <ScrollView>
            <View style={styles.sectionOne}>
                <View>
                    <Text style={{fontSize:17}}>Endereço para entrega:</Text>
                    <Text style={{marginTop:5}}>{profile.address}</Text>
                </View>
                <TouchableOpacity onPress={()=> props.navigation.navigate('Endereço')}>
                    <Edit name='edit' size={18}/>
                </TouchableOpacity>
            </View>
            <View style={{margin:15}}>
                <Text style={styles.restStyle}>{restaurant.name}</Text>
                <Text style={{marginTop:10}}>{restaurant.address}</Text>
            </View>
            <View style={{borderWidth:1, marginBottom:30, margin:10}}/>
            {bag.length > 0 ? bag.map(b=>{
                return(
                    <View key={b.id} style={styles.container}>
                        <Image
                            style={styles.img}
                            source={{uri: b.photoUrl}}/>
                        <View style={styles.section}>
                            <Text style={{textAlign:'center',fontSize:18}}>
                                {b.name}
                            </Text>
                            <Text style={{textAlign:'left'}}>
                                {b.description}
                            </Text>
                            <Text style={{textAlign:'left'}}>
                                R$ {b.price.toFixed(2)}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.button}
                            onPress={()=> removeFromCart(b)}>
                            <Text style={{color:'whitesmoke'}}>Remover</Text>
                        </TouchableOpacity>
                    </View>
                )
            }) : <Text style={{textAlign:'center', 
                    fontSize:20}}>Seu carrinho está vázio</Text>}
            <Text style={styles.totalStyle}>
                Total: R$ {total()}
            </Text>
            <View style={{borderWidth:1, margin:10}}/>
            <Picker style={{width:200, marginLeft:5}}
                selectedValue={value}
                onValueChange={(itemValue, itemIndex)=>
                setValue(itemValue)}>                
                <Picker.Item label='Dinheiro' value={'money'}/>
                <Picker.Item label='Cartão de crédito' value={'creditcard'}/>
            </Picker>
            <TouchableOpacity style={styles.btnShop}
                onPress={shopFinish}>
                <Text style={{textAlign:'center', color:'whitesmoke'}}>Finalizar compra</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnShop}
                onPress={checkActiveRequest}>
                <Text style={{textAlign:'center', color:'whitesmoke'}}>Constultar pedido ativo</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    sectionOne:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 50,
        margin: 10,        
    },
    restStyle: {
        color: 'red',
        fontSize: 20,
    },
    container: {
        borderWidth: 1,
        padding: 5,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 15,
        justifyContent: 'space-between'
    },
    section: {
        width: '100%',
    },
    button: {
        backgroundColor: 'red',
        width: '100%',
        padding: 5,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center'
    },
    img: {
        backgroundColor: 'white',
        width: '100%',
        height: 100,
        borderRadius: 10
    },
    totalStyle: {
        fontSize: 18,
        margin: 10
    },
    btnShop: {
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 5,
        margin: 5
    }
})


export default Cart