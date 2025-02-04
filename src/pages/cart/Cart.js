import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { url } from '../../constants/urls'
import { AuthContext } from '../../global/Context'
import Edit from 'react-native-vector-icons/Entypo'
import { Picker } from "@react-native-picker/picker"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CreditCardInput } from 'react-native-credit-card-input'
import QRCode from 'react-native-qrcode-svg'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native'




const Cart = (props)=>{
    const { states, setters, requests } = useContext(AuthContext)
    const bag = states.bag
    const profile = states.profile
    const [value, setValue] = useState('money')
    const [total, setTotal] = useState(0)



    useEffect(()=>{
        requests.getProfile()
        requests.getAllOrders()
        //setTotal(bag.reduce((acc, item) => acc + item.total, 0))
    }, [])

    useEffect(()=>{
        setTotal(bag.reduce((acc, item) => acc + (item.price * item.quantity), 0))
    }, [bag])



    const handleNumber = async(e, id)=>{
        const newQuantity = Number(e)

        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        }

        setters.setBag(prevBag =>{
            const updatedBag = prevBag.map(item => {
                if(item.id === id){
                    return { ...item, quantity: newQuantity }
                }else{
                    return item
                }
            })
            
            return updatedBag 
        })
        
        const headers = {
            headers: { authorization: await AsyncStorage.getItem('token') }
        }
        
        axios.patch(`${url}/order/${id}`, {
            quantity: newQuantity
        }, headers).then(()=>{
            requests.getAllOrders()
        }).catch(e =>{
            console.error(e.response.data)
        } )
    }


    const removeFromCart = async(b)=>{
        const headers = {
            headers: { authorization: await AsyncStorage.getItem('token') }
        }
        axios.delete(`${url}/order/${b.id}`, headers).then(() =>{
            requests.getAllOrders()
        }).catch(e => alert(e.response.data))
    }


    const cleanCart = ()=>{
        Alert.alert(
            'Tem certeza que deseja excluir todos os itens do carrinho?',
            '',
            [
                {
                    text:'Cancelar'
                },
                {
                    text:'Ok',
                    onPress: async() =>{
                        const headers = {
                            headers: { authorization: await AsyncStorage.getItem('token') }
                        }
                
                        axios.delete(`${url}/requested_orders`, headers).then(()=>{
                            requests.getAllOrders()
                        }).catch(e => alert(e.response.data))
                    }
                }
            ]
        )        
    }


    const handleCardChange = (FormData)=>{

    }


    const endOrders = async()=>{
        const headers = {
            headers: { authorization: await AsyncStorage.getItem('token') }
        }
        
        Alert.alert(
            'Você está perstes a finalizar seus pedidos',
            `Seu total é de R$ ${total.toFixed(2)}`
        )
    }





    return(
        <ScrollView>
            <View style={styles.sectionOne}>
                <View>
                    <Text style={{fontSize:17}}>Endereço para entrega:</Text>
                    <Text style={{marginTop:5}}>
                        {profile.street} {profile.number}, {profile.neighbourhood}{'\n'}
                        {profile.city} - {profile.state}
                    </Text>
                </View>
                <TouchableOpacity onPress={()=> props.navigation.navigate('Endereço')}>
                    <Edit name='edit' size={18}/>
                </TouchableOpacity>
            </View>
            <View style={{borderWidth:1, marginBottom:30, margin:10}}/>
            {bag.length > 0 && (
                <TouchableOpacity 
                    style={[styles.button, {width:'35%', margin:'auto'}]}
                    onPress={cleanCart}>
                    <Text style={{color:'white'}}>Limpar carrinho</Text>
                </TouchableOpacity>
            )}
            {bag.length > 0 ? bag.map(b=>{
                return(
                    <View key={b.id} style={styles.container}>
                        <Text style={{textAlign:'center',fontSize:18, color:'red'}}>
                            {b.product} R$ {b.price.toFixed(2)}
                        </Text>
                        <Image
                            style={styles.img}
                            source={{uri: b.photoUrl}}/>
                        <View style={styles.section}>
                            <View style={styles.quantitySection}>
                                <Text>Quantidade: {b.quantity}</Text>
                                <TextInput
                                    style={styles.quantity}
                                    keyboardType='numeric'
                                    value={String(b.quantity)}
                                    onChangeText={(e) =>{
                                        const num = parseInt(e, 10)
                                        if((!isNaN(num) && num >= 1) || e === ''){
                                            handleNumber(e, b.id)
                                        }
                                    }}
                                    />
                            </View>
                            <Text style={{textAlign:'left'}}>
                                Total: R$ {((b.price) * (b.quantity)).toFixed(2)}
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
                Total: R$ {total.toFixed(2)}
            </Text>
            <View style={{borderWidth:1, margin:10}}/>
            <Picker style={{width:200, marginLeft:5}}
                selectedValue={value}
                onValueChange={(itemValue, itemIndex)=>
                setValue(itemValue)}>                
                <Picker.Item label='Dinheiro' value={'money'}/>
                <Picker.Item label='Cartão de crédito' value={'creditcard'}/>
            </Picker>

            {value === 'creditcard' ? (
                <CreditCardInput
                    requiresName
                    requiresCVC
                    requiresPostalCode={false}
                    onChange={handleCardChange}/>
            ) : (
                <View style={{marginHorizontal:'auto', marginVertical:10}}>
                    <QRCode
                        value='Bora embora'
                        size={100} />
                </View>
            ) }

            <TouchableOpacity style={[styles.btnShop, { backgroundColor: bag.length === 0 ? 'gray' : 'red' }] }
                disabled={bag.length === 0 ? true : false}
                onPress={endOrders}>
                <Text style={{textAlign:'center', color:'whitesmoke'}}>Finalizar compra</Text>
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
        marginHorizontal: 15,        
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
        display: 'flex'
    },
    quantitySection: {
        width:'100%',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    quantity: {
        borderWidth: .5,
        borderColor: 'gray',
        borderRadius: 10,
        paddingLeft: 10,
        width: 40
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
        borderRadius: 10,
        marginVertical: 10
    },
    totalStyle: {
        fontSize: 18,
        margin: 10
    },
    btnShop: {
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 5,
        margin: 5,
        marginBottom: 10
    }
})


export default Cart