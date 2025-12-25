import React, { useState } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import Header from '../../layout/Header';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import { ScrollView } from 'react-native-gesture-handler';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';

const postimage = [
    {
        id: "1",
        image: IMAGES.profilepic1
    },
    {
        id: "2",
        image: IMAGES.profilepic2
    },
    {
        id: "3",
        image: IMAGES.profilepic3
    },
    {
        id: "4",
        image: IMAGES.profilepic4
    },
    {
        id: "5",
        image: IMAGES.storypic2
    },
    {
        id: "6",
        image: IMAGES.storypic3
    },
    {
        id: "7",
        image: IMAGES.storypic4
    },
    {
        id: "8",
        image: IMAGES.storypic1
    },
    {
        id: "9",
        image: IMAGES.profilepic5
    },
    {
        id: "10",
        image: IMAGES.profilepic6
    },
    {
        id: "11",
        image: IMAGES.profilepic7
    },
    {
        id: "12",
        image: IMAGES.profilepic8
    },
    {
        id: "13",
        image: IMAGES.profilepic9
    },
    {
        id: "14",
        image: IMAGES.profilepic10
    },
    {
        id: "15",
        image: IMAGES.profilepic11
    },
    {
        id: "16",
        image: IMAGES.profile2
    },
];

type CreatePostScreenProps = StackScreenProps<RootStackParamList, 'createpost'>;

const CreatePost = ({ navigation } : CreatePostScreenProps) => {

    const [imageurl, setimageurl] = React.useState(IMAGES.profilepic1);

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <SafeAreaView style={[GlobalStyleSheet.container,{padding:0, backgroundColor:colors.card,flex:1}]}>
            <Header
                title="Select Post"
                next={true}
            />
            <View>
                <View style={{paddingVertical:30,backgroundColor:'rgba(71,90,119,.25)'}}>
                    <Image
                        style={{
                            height: SIZES.width < SIZES.container ? SIZES.width - (SIZES.width * (20 / 100)) : SIZES.container - (SIZES.container * (20 / 100)),
                            width: '100%',
                            resizeMode:'contain'
                        }}
                        source={imageurl}
                    />
               </View>
            </View>
            <View style={[GlobalStyleSheet.flexaling,{paddingHorizontal:15}]}>
                <Text style={{ flex: 1, ...FONTS.fontMedium, ...FONTS.h5, color: colors.title }}>Gallery</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('WriteCaption')}
                    style={{padding:10}}
                >
                    <Image
                        style={{ height: 24, width: 24, tintColor: colors.title }}
                        source={IMAGES.write}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{padding:10}}
                >
                    <Image
                        style={{height:24,width:24,tintColor:colors.title}}
                        source={IMAGES.camera}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
            >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {postimage.map((item,index) => {
                        return (
                            <View
                                key={index}
                                style={{ width: '25%', height: SIZES.width / 4, padding: 1 }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setimageurl(item.image)
                                    }}
                                >
                                    <Image
                                        style={{width:'100%',height:'100%'}}
                                        source={item.image}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CreatePost;