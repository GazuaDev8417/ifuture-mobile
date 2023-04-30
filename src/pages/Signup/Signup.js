import { useContext, useState } from "react"
import axios from 'axios'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { url } from "../../constants/urls"
import { AuthContext } from "../../global/Context"



const Signup = (props)=>{
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')
    const [confSenha, setConfSenha] = useState('')
    const { setters } = useContext(AuthContext)


    
    const signup = ()=>{
        const body = {
            name:nome,
            email,
            cpf,
            password: senha,
        }

        if(senha !== confSenha){
            alert('As senhas não conferem!')
        }else{
            axios.post(`${url}/signup`, body).then(res=>{
                setters.getToken(res.data.token)
                props.navigation.navigate('Endereço')
            }).catch(e=>{
                alert(e.response.data.message)
            })
        }
    }


    const limpar = ()=>{
        setConfSenha('')
        setCpf('')
        setEmail('')
        setNome('')
        setSenha('')
    }

    
    return(
        <View style={styles.container}>
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
                    value={cpf}
                    onChangeText={setCpf}
                    keyboardType='numeric'
                    placeholder='CPF'/>
                
                <TextInput style={styles.input}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={true}
                    placeholder='Senha'/>

                <TextInput style={styles.input}
                    value={confSenha}
                    onChangeText={setConfSenha}
                    secureTextEntry={true}
                    placeholder='Confirme sua senha'/>

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
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',  
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
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25
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