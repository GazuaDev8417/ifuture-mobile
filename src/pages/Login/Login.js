import { useContext, useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { url } from "../../constants/urls"
import axios from 'axios'
import { AuthContext } from "../../global/Context"
import { Feather } from '@expo/vector-icons'
import { Text,
    TextInput,
    View,
    TouchableOpacity,
    BackHandler,
    ScrollView
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"



const Login = (props)=>{
    const [email, setEmail] = useState('visitante@email.com')
    const [password, setPassword] = useState('123456')
    const [showPassword, setShowPassword] = useState(false)
    const { setters } = useContext(AuthContext)



    useEffect(()=>{
        (async()=>{
            const token = await AsyncStorage.getItem('token')

            if(token){
                props.navigation.navigate('MyTabs')
            }
        })()
    }, [])


    BackHandler.addEventListener('hardwareBackPress', ()=>{
        return true
    })


    const login = ()=>{
        const body = {
            email,
            password
        }

        axios.post(`${url}/login`, body).then(res=>{ 
            setters.getToken(res.data)
            props.navigation.navigate('MyTabs')
        }).catch(e=>{
            alert(e.response.data)
        })
        
    }


    const limpar = ()=>{
        setEmail('')
        setPassword('')
    }

    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.form}>
                    <TextInput style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="nome@email.com"/>
                    
                    <View style={styles.passwordContainer}>
                        <TextInput style={styles.input}
                        value={password}
                        onChangeText={setPassword}
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
                        <TouchableOpacity onPress={login}
                            style={styles.button}>
                            <Text style={{color:'whitesmoke'}}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.linkContainer}>
                        Ainda não tem cadastro?
                        <Text style={styles.link}
                            onPress={()=> props.navigation.navigate('Signup')}> Clique aqui.</Text>                
                    </Text>
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
      marginTop: 100  
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
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#e8222e',
        padding: 10,        
        alignItems: 'center',
        width: 100,
        borderRadius: 10,
    },
    linkContainer: {
        alignItems: 'center',
        marginTop: 30,
        textAlign: 'center'
    },
    link: {
        color: 'blue'
    }
})

export default Login