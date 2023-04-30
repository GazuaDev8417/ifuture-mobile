import { useContext } from "react"
import { AuthContext } from "../../global/Context"
import { Avatar } from "react-native-paper"
import Popup from "../../components/Modal"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'



const Detail = ()=>{
    const { states, setters } = useContext(AuthContext)
    const restaurant = states.restaurant
    const pratos = restaurant.products


    

    return(
        <ScrollView>
            <Text style={styles.title}>{restaurant.name}</Text>
            <View style={styles.imgContainer}>
                <Avatar.Image size={250}
                    source={{uri: restaurant.logoUrl}}/>                
            </View>
            <View style={styles.textContainer}>
                <Text style={{fontSize:20, marginBottom:10}}>{restaurant.category}</Text>
                <Text>{restaurant.description}</Text>
                <View style={styles.details}>
                    <Text>{restaurant.deliveryTime} - {restaurant.deliveryTime + 10} min</Text>
                    <Text>Frete R$ {restaurant.shipping},00</Text>
                </View>
                <Text style={{marginTop:10}}>{restaurant.address}</Text>
                <Text style={{marginTop: 20, textAlign:'center'}}>Cardápio principal</Text>
                <View style={styles.line}/>
            </View>
            <Popup/>
            {pratos && pratos.map(prato=>{
                return(
                    <View key={prato.id} style={styles.card}>
                        <Avatar.Image style={styles.img} 
                            source={{uri: prato.photoUrl}}/>
                        <View>
                            <Text style={{color:'red', marginLeft:5}}>{prato.name}</Text>
                            <Text style={{marginLeft:5}}>R$ {prato.price},00</Text>
                        </View>
                        <TouchableOpacity style={styles.button}
                            onPress={()=> setters.add(prato)}>
                            <Text style={{color:'white'}}>Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                )
            })}    
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        textAlign: 'center'
    },
    imgContainer: {
        alignItems: 'center',
        margin: 10
    },
    textContainer: {
        margin: 20
    },
    details: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    },
    line: {
        borderWidth: 1,
        marginTop: 5
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 10,
        borderWidth: 1,
        padding: 5,
        borderRadius: 10
    },
    img: {
        backgroundColor: 'white'
    },
    button: {
        margin: 10,
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 10,
    }
})

export default Detail