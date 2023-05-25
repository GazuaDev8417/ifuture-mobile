import { useState, useContext } from 'react'
import { AuthContext } from '../../global/Context'
import axios from 'axios'
import { url } from '../../constants/urls'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'


const UpdateProfile = (props)=>{
    const { states, requests } = useContext(AuthContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [cpf, setCpf] = useState('')


    
    const upToDate = async()=>{
        const body = {
            name,
            email,
            cpf
        }
        const headers = {
            headers: {
                auth: await AsyncStorage.getItem('token')
            }
        }
        axios.put(`${url}/profile`, body, headers).then(res=>{
            requests.getProfile()
            props.navigation.navigate('Perfil')
        }).catch(e=>{
            alert(e.response.data.message)
        })
    }
    


    const cleanUp = ()=>{
        setName('')
        setEmail('')
        setCpf('')
    }


    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.form}>
                    <TextInput style={styles.input}
                        onChangeText={setName}
                        value={name}
                        placeholder='Nome'/>
                    <TextInput style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholder='nome@email.com'/>
                    <TextInput style={styles.input}
                        onChangeText={setCpf}
                        value={cpf}
                        placeholder='CPF'
                        keyboardType='numeric'/>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.button}
                            onPress={cleanUp}>
                            <Text style={{color:'whitesmoke'}}>Limpar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}
                            onPress={upToDate}>
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
        alignItems: 'center'
    },
    form: {
        marginTop: 50
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
        margin: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        backgroundColor: '#e8222e',
        padding: 10,        
        alignItems: 'center',
        width: 100,
        borderRadius: 10,
    }
})


export default UpdateProfile
