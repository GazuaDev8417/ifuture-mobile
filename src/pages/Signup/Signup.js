import { useContext, useState } from "react"
import axios from 'axios'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { url } from "../../constants/urls"
import { AuthContext } from "../../global/Context"
import { Feather } from '@expo/vector-icons'



const Signup = (props)=>{
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [senha, setSenha] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const { setters } = useContext(AuthContext)


    
    const signup = ()=>{
        const body = {
            name:nome,
            email,
            phone,
            password: senha,
        }

        axios.post(`${url}/signup`, body).then(res=>{
            setters.getToken(res.data.token)
            props.navigation.navigate('Endereço')
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const limpar = ()=>{
        setPhone('')
        setEmail('')
        setNome('')
        setSenha('')
    }

    
    return(
        <View style={styles.container}>
           <ScrollView> 
                <View style={styles.form}>
                    <TextInput style={styles.input}
                        value={nome}
                        onChangeText={setNome}
                        placeholder='Nome completo'/>

                    <TextInput style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder='nome@gmail.com'/>
                    
                    <TextInput style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        maxLength={11}
                        keyboardType='numeric'
                        placeholder='Telefone'/>
                    
                   <View style={styles.passwordContainer}>
                     <TextInput style={styles.input}
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry={showPassword ? false : true}
                        placeholder='Senha'/>
                        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                            <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} style={styles.icon}/>
                        </TouchableOpacity>
                   </View>

                    <View style={styles.btnContainer}>
                        <TouchableOpacity onPress={limpar}
                            style={styles.button}>
                            <Text style={{color:'whitesmoke'}}>Limpar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={signup}
                            style={styles.button}>
                            <Text style={{color:'whitesmoke'}}>Registrar</Text>
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
    passwordContainer: {
        position: 'relative'
    },
    icon: {
        position: 'absolute',
        right: 25,
        bottom: 20
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
    },
})

export default Signup