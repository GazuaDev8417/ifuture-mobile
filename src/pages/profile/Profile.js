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
                <Text style={styles.txtContainer}>
                    {profile.username}{'\n'}
                    {profile.email}{'\n'}
                </Text>
                <TouchableOpacity onPress={()=> props.navigation.navigate('Atualizar')}>
                    <Edit name='edit' size={18}/>
                </TouchableOpacity>
            </View>
            <View style={{borderWidth:0.5, margin:5}}/>
            <View style={styles.sectionOne}>
                <Text style={styles.txtContainer}>
                    {profile.street} {profile.number}, {profile.neighbourhood}{'\n'}{profile.city} - {profile.state}
                </Text>
                <TouchableOpacity onPress={()=> props.navigation.navigate('Endereço')}>
                    <Edit name='edit' size={18}/>
                </TouchableOpacity>
            </View>
            <Text style={styles.historicTitle}>Historico de pedidos</Text>
            <View style={{borderWidth:0.5, margin:5}}/>
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
        margin: 15,
        marginTop: '20%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    txtContainer: {
        fontSize: 17
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