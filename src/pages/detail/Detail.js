import { useContext } from "react"
import { AuthContext } from "../../global/Context"
import { Avatar } from "react-native-paper"
import Popup from "../../components/Modal"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'



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
                    <Text>Frete R$ {restaurant.shipping.toFixed(2)}</Text>
                </View>
                <Text style={{marginTop:10}}>{restaurant.address}</Text>
                <Text style={{marginTop: 20, textAlign:'center'}}>Cardápio principal</Text>
                <View style={styles.line}/>
            </View>
            <Popup/>
            {pratos && pratos.map(prato=>{
                return(
                    <View key={prato.id} style={styles.card}>
                        <Image                            
                            style={styles.img} 
                            source={{uri: prato.photoUrl}}/>
                        <View style={styles.legendCard}>
                            <Text style={{color:'red', marginLeft:5}}>{prato.name}</Text>
                            <Text style={{marginLeft:5}}>R$ {prato.price.toFixed(2)}</Text>
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 10,
        borderWidth: 1,
        padding: 5,
        borderRadius: 10
    },
    legendCard: {
        marginTop: 10,
        width: '80%',
        flexDirection:'column',
        alignItems:'center'
    },
    img: {
        backgroundColor: 'white',
        width: '100%',
        height: 100,
        borderRadius: 10
    },
    button: {
        margin: 10,
        width: '90%',
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 10,
    }
})

export default Detail