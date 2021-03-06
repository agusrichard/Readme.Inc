//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
class SliderTitle extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.props.title}</Text>
                {this.props.viewAll &&
                    <Text style={styles.viewAll} onPress={() => this.props.onViewAllPressed()}>See More</Text>
                }
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 20,
        paddingLeft: 20,

    },
    title: { fontFamily: 'Nunito-Regular', fontSize: 20, },
    viewAll: { fontFamily: 'Nunito-Regular', fontSize: 16, color: '#0DAAFF', },
});

//make this component available to the app
export default SliderTitle;
