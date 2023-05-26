import { useContext, useState } from 'react'
import axios from 'axios'
import { url } from '../../constants/urls'
import { AuthContext } from '../../global/Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'

const Address = (props)=>{
    const { states, setters } = useContext(AuthContext)
    const [street, setStreet] = useState('')
    const [number, setNumber] = useState('')
    const [neighbourhood, setNeighbourhood] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [complement, setComplement] = useState('')



    const saveAddress = async()=>{
        const body = {
            street,
            number,
            neighbourhood,
            city,
            state,
            complement
        }
        const headers = {
            headers: {
                auth: await AsyncStorage.getItem('token')
            }
        }
        axios.put(`${url}/address`, body, headers).then(res=>{
            alert('Endereço cadastrado.')
            props.navigation.navigate('MyTabs')
        }).catch(e=>{
            alert(e.response.data)
        })
    }



    const limpar = ()=>{
        setCity('')
        setComplement('')
        setNeighbourhood('')
        setNumber('')
        setState('')
        setStreet('')
    }
    

    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.form}>
                    <TextInput style={styles.input}
                        onChangeText={setStreet}
                        value={street}
                        placeholder='Rua / Av.'/>

                    <TextInput style={styles.input}
                        onChangeText={setNumber}
                        value={number}
                        placeholder='Número'
                        keyboardType='numeric'/>

                    <TextInput style={styles.input}
                        onChangeText={setNeighbourhood}
                        value={neighbourhood}
                        placeholder='Bairro'/>

                    <TextInput style={styles.input}
                        onChangeText={setCity}
                        value={city}
                        placeholder='Cidade'/>

                    <TextInput style={styles.input}
                        onChangeText={setState}
                        value={state}
                        placeholder='Estado'/>

                    <TextInput style={styles.input}
                        onChangeText={setComplement}
                        value={complement}
                        placeholder='Complemento'/>

                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.button}
                            onPress={limpar}>
                            <Text style={{color:'whitesmoke'}}>Limpar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}
                            onPress={saveAddress}>
                            <Text style={{color:'whitesmoke'}}>Salvar</Text>
                        </TouchableOpacity>                    
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    form: {
        marginTop: 30
    },
    input: {
        backgroundColor: 'lightgray',
        margin: 10,
        height: 40,
        width: 300,
        fontSize: 18,
        borderRadius: 10,
        paddingHorizontal: 10
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10
    },
    button: {
        backgroundColor: '#e8222e',
        padding: 10,        
        alignItems: 'center',
        width: 100,
        borderRadius: 10
    }
})

export default Address