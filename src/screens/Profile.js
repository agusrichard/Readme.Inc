//import liraries
import React, { Component } from 'react';
import SliderTitle from '../components/SliderTitle';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, PermissionsAndroid, ToastAndroid, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { logout, changePhoto } from '../redux/actions/auth';
import { withNavigationFocus } from 'react-navigation';
import { APP_IMAGE_URL, APP_URL } from '../config/config';

// create a component
class ProfileOriginal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            photo: null,
            isLoading: false,
            isSuccess: false,
            message: '',
        }
    }

    async handleLogout() {
        const jwt = await this.props.auth.data.token
        if (jwt !== null) {
            await this.props.dispatch(logout(jwt))
        }
    }

    async componentDidMount() {
        await this.setState({
            photo: { uri: APP_IMAGE_URL.concat(this.props.auth.data.photo) }
        });
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.auth.isLoading !== this.state.isLoading && this.props.navigation.isFocused()) {
            if (prevProps.auth.isLoading === true) {
                this.setState({
                    isLoading: true
                })
                console.log('masih loading')
            } else {
                console.log('sudah fulfill')
                if (this.props.auth.isSuccess) {
                    console.log('berhasil logout')
                    await this.setState({
                        isLoading: false,
                        isSuccess: true,
                        message: "Logout Success.",
                    })
                    this.handleRedirect()
                } else {
                    console.log('gagal logout')
                    await this.setState({
                        isLoading: false,
                        isSuccess: false,
                        message: "Logout Failed. Try Again.",
                    })
                    this.handleRedirect()
                }
            }
        }
    }

    async handleRedirect() {
        if (this.state.isSuccess) {
            Alert.alert('Logout Message', this.state.message, [
                { text: 'OK', onPress: () => this.props.navigation.navigate('Splash') },
            ])
        } else {
            Alert.alert('Logout Message', this.state.message)
        }
    }

    requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ]);
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        catch (error) {
            console.warn(err);
            return false;
        }
    }

    updateProfilePic = async () => {

        const jwt = this.props.auth.data.token;

        const options = {
            title: 'Change Photo Profile',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            mediaType: 'photo',
        };

        let cameraPermission =
            (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) &&
            PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ) &&
            PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
        if (!cameraPermission) {
            cameraPermission = await this.requestCameraPermission();
        } else {
            ImagePicker.showImagePicker(options, response => {
                if (response.didCancel) {
                    ToastAndroid.show('Action Cancelled', ToastAndroid.LONG);
                } else if (response.error) {
                    ToastAndroid.show(response.error, ToastAndroid.LONG);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    ToastAndroid.show('loading...', ToastAndroid.LONG);
                    this.setState({
                        photo: { uri: response.uri }
                    });
                    RNFetchBlob.fetch('PATCH', `${APP_URL}/profile/photo`, {
                        Authorization: `Bearer ${jwt}`,
                        'Content-Type': 'multipart/form-data',
                    }, [
                        { name: 'image', filename: response.fileName, type: response.type, data: RNFetchBlob.wrap(response.path) },
                    ]).then(async (resp) => {
                        const data = JSON.parse(resp.data);
                        this.props.dispatch(changePhoto(data.data.photo));
                        ToastAndroid.show('Change Photo Profile Success', ToastAndroid.LONG);
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            });
        }
    };


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerWrapper}>
                    {/* <View style={{ flexDirection: 'row' }}>
                        <SliderTitle title="Profile"/>
                    </View> */}
                    <TouchableOpacity style={{ backgroundColor: '#ffcc00', padding: 10, flexDirection: 'row-reverse', alignItems: 'center' }} onPress={() => this.handleLogout()}>
                            <Feather name="log-out" size={25} color="red" />
                            <Text style={{ fontFamily: 'Nunito-Regular', fontSize: 18, marginRight: 10, color: 'red' }}>Log Out</Text>
                        </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => this.updateProfilePic()} style={{ borderWidth: 3, borderRadius: 15, padding: 10, borderRadius: 100,borderColor:'#008080' }}>
                            {this.state.photo !== null
                                ? <Image source={this.state.photo} style={{ width: 100, height: 100, borderRadius: 100 }} />
                                : <ActivityIndicator size="large" color="#008080" />
                            }
                            <Feather name="edit" size={25} style={{ position: 'absolute', right: -15, bottom: -10,color:'#008080' }} />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'Nunito-Regular', fontSize: 30, color: '#111', textAlign: 'center', marginTop: 10 }}>{this.props.auth.data.name}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', width: '100%' }}>
                    <ScrollView style={{ width: '100%', height: '100%', }} showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', elevation: 1, marginTop: 20, padding: 20 }}>
                            <View>
                                <Text style={{ fontFamily: 'Nunito-Regular', fontSize: 15 }}>Email            : {this.props.auth.data.email}</Text>
                                <Text style={{ fontFamily: 'Nunito-Regular', color: '#333', fontSize: 15 }}>Username    : {this.props.auth.data.username}</Text>
                                <Text style={{ fontFamily: 'Nunito-Regular', color: 'green', fontSize: 15,paddingTop:20 }} onPress={() => this.props.navigation.navigate('ProfileSetting')}>Edit Profile</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={{ backgroundColor: 'white', elevation: 1, marginTop: 20, padding: 10, flexDirection: 'row',justifyContent:'center' }} onPress={() => this.props.navigation.navigate('OrderHistory')} onPress={() => this.props.navigation.navigate('OrderHistory')}>
                            <Feather name="file-text" size={25} />
                            <Text style={{ fontFamily: 'Nunito-Regular', fontSize: 18, marginLeft: 10 }}>Order History</Text>
                        </TouchableOpacity>
                        
                        {/* <TouchableOpacity style={{ backgroundColor: 'white', elevation: 1, padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.handleLogout()}>
                            <Feather name="log-out" size={25} color="red" />
                            <Text style={{ fontFamily: 'Nunito-Regular', fontSize: 18, marginLeft: 10, color: 'red' }}>Log Out</Text>
                        </TouchableOpacity> */}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
    },
    headerWrapper: {
        backgroundColor: '#ffcc00',
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        padding: 20
    },
});

const Profile = withNavigationFocus(ProfileOriginal);

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
};

//make this component available to the app
export default connect(mapStateToProps)(Profile);
