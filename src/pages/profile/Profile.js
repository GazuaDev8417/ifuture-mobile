import { useContext, useEffect } from 'react'
import { AuthContext } from '../../global/Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from "react-native-vector-icons/AntDesign"
import Edit from 'react-native-vector-icons/Entypo'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native"



const Profile = (props)=>{
    const { states, requests } = useContext(AuthContext)
    const profile = states.profile
    const demands = states.demands




    useEffect(()=>{
        requests.historicRequests()
        requests.getProfile()
    }, [])




    return(
        <ScrollView>
            <TouchableOpacity style={styles.logoutIcon}
              onPress={async()=>{
                await AsyncStorage.clear()
                props.navigation.navigate('Login')}}>
              <Icon name='logout' size={25}/>
            </TouchableOpacity>
            <View style={styles.sectionOne}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>Perfil do Usuário</Text>
                </View>
                <View style={styles.txtContainer}>                    
                    <View style={{maxWidth:'90%'}}>
                        <Text style={styles.values}>{profile.username}{'\n'}</Text>
                        <Text style={styles.values}>{profile.email}{'\n'}</Text>
                        <Text style={styles.values}>{profile.phone}</Text>
                    </View>
                    <TouchableOpacity onPress={()=> props.navigation.navigate('Atualizar')}>
                        <Edit name='edit' size={18}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{borderWidth:0.5, margin:5}}/>
            <View style={styles.sectionTwo}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>Endereço Cadastrado</Text>
                </View>
                <View style={styles.txtContainer}>
                    <View style={{maxWidth:'90%'}}>
                        <Text style={styles.properties}>
                            Local:<Text style={styles.values}> {profile.street}, {profile.number ? profile.number : 'S/N'}</Text>
                        </Text>
                        <Text style={styles.properties}>
                            Bairro:<Text style={styles.values}> {profile.neighbourhood}</Text>
                        </Text>
                        <Text style={styles.properties}>
                            Cidade/Estado:<Text style={styles.values}> {profile.city} - {profile.state}</Text>
                        </Text>
                        <Text style={styles.properties}>
                            CEP:<Text style={styles.values}> {profile.cep}</Text>
                        </Text>
                    </View>
                    <TouchableOpacity onPress={()=> props.navigation.navigate('Endereço')}>
                        <Edit name='edit' size={18}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{borderWidth:0.5, margin:5}}/>
            <Text style={styles.historicTitle}>Historico de pedidos</Text>
            <View style={{borderWidth:0.3, margin:5}}/>
            {demands.length > 0 ? demands.map(demand=>{
                return(
                    <View key={demand.id}
                        style={styles.card}>
                        <Text style={styles.cardTitle}>
                            {demand.product} R$ {demand.price}
                        </Text>
                        <Image
                            style={styles.img}
                            source={{ uri: demand.photoUrl }}/>
                        <View style={{flexDirection:'column', justifyContent:'space-between', margin:5}}>
                            <Text>
                                Quantidade: {demand.quantity}{'\n'}
                                Total: R$ {demand.total.toFixed(2)}{'\n'}
                            </Text>
                        </View>
                    </View>
                )
            }) : null}
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    logoutIcon: {
        margin: 10,
        position: 'absolute',
        right: 5
    },
    sectionOne: {
        marginTop: 50,
        marginHorizontal: 10        
    },
    sectionTwo: {
        marginTop: 20,
        marginHorizontal: 10        
    },
    titleWrapper: {
        width:'100%',
        alignItems: 'center',
        marginBottom: 20
    },
    properties: {
        fontWeight: 'bold'
    },
    values: {
        fontWeight: 'normal'
    },
    title: {
        fontSize: 20,
        fontWeight: 400
    },
    txtContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    historicTitle: {
        textAlign:'center',
        fontSize: 18,
        marginTop: 30
    },
    card: {
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 5
    },
    cardTitle: {
        textAlign: 'center',
        fontSize: 20,
        color: 'red',
        marginBottom: 10
    },
    img: {
        backgroundColor: 'white',
        width: '50%',
        height: 100,
        borderRadius: 10,
        margin: 'auto'
    }
})


export default Profile