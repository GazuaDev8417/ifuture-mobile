import { useContext } from "react"
import { Picker } from "@react-native-picker/picker"
import Icon from "react-native-vector-icons/FontAwesome"
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native"
import { AuthContext } from "../global/Context"



const Popup = ()=>{
    const { states, setters } = useContext(AuthContext)
    
 

    return(
        <View style={styles.container}>
            <Modal style={{width:300}}
                animationType="slide"
                visible={states.visible}
                transparent={true}>
                <View style={styles.modalContainer}>
                    <Text style={styles.txtStyle}>
                        {states.dish.name}{'\n'}                        
                    </Text>
                    <Text style={{fontSize:13, textAlign:'center', color:'whitesmoke'}}>
                            Informe a quantidade desejada
                    </Text>                
                    <View style={styles.modalStyle}>
                        <Picker style={styles.pickerContainer}
                            selectedValue={states.product}
                            onValueChange={(itemValue, itemIndex)=>
                            setters.setProduct(itemValue)}>
                            <Picker.Item style={styles.pickerContent}
                                label='1' value={1}/>
                            <Picker.Item style={styles.pickerContent}
                                label="2" value={2}/>
                            <Picker.Item style={styles.pickerContent}
                                label="3" value={3}/>
                            <Picker.Item style={styles.pickerContent}
                                label="4" value={4}/>
                            <Picker.Item style={styles.pickerContent}
                                label="5" value={5}/>
                            <Picker.Item style={styles.pickerContent}
                                label="6" value={6}/>
                            <Picker.Item style={styles.pickerContent}
                                label="7" value={7}/>
                            <Picker.Item style={styles.pickerContent}
                                label="8" value={8}/>
                            <Picker.Item style={styles.pickerContent}
                                label="9" value={9}/>
                            <Picker.Item style={styles.pickerContent}
                                label="10" value={10}/>
                        </Picker>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={styles.button}>
                                <Text style={{color:'whitesmoke'}}
                                    onPress={()=> setters.setVisible(false)}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}
                                onPress={()=> setters.addToCart(states.dish)}>
                                <Icon name="cart-plus" size={20} color='whitesmoke'/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>                
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    modalContainer: {        
        backgroundColor: '#151515',
        borderRadius: 10,
        margin: 10,
        marginTop: 120,
        padding: 10
    },
    txtStyle: {
        color: 'whitesmoke',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: -20
    },
    modalStyle: {
        margin: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pickerContainer: {
        width: 80,
        backgroundColor: 'white',
    },
    pickerContent: {
        width: 10,        
    },
    button: {
        margin: 5,
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center'
    },
    close: {
        fontSize: 35,
        position: 'absolute',
        right: '10%',
    }
})

export default Popup