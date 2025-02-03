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
                <Text>Bora embora!</Text>            
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