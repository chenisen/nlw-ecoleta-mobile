import React, { useEffect, useState } from 'react';
import { 
    View,
    ImageBackground,
    Image,
    Text,
    StyleSheet
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string,
};

interface IBGECityResponse {
  nome: string,
};

interface PickerItem {
  label: string,
  value: string,
  key: string
}

const Home = () => {
    const navigation = useNavigation();
    const [selectedCity, setSelectedCity] = useState<string>('0');
    const [selectedUF, setSelectedUF] = useState<string>('0');

    const [ufs, setUfs] = useState<PickerItem[]>([]);
    const [cities, setCities] = useState<PickerItem[]>([]);

    const valueAsc = (a: PickerItem, b: PickerItem) => {
      return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);
    }

    useEffect(() => {
      axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                setUfs(response.data.map(uf => (
                  {
                    label: uf.sigla,
                    value: uf.sigla,
                    key: uf.sigla
                  }
                )).sort(valueAsc));
            });
    }, []);

    useEffect(() => {
        selectedUF !== '0'
        && axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
            .then(response => {
              setCities(response.data.map(city => (
                {
                  label: city.nome,
                  value: city.nome,
                  key: city.nome
                }
              )).sort(valueAsc));
          })
    }, [selectedUF]);

    return (
        <ImageBackground 
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>
                    Seu marketplace de resíduos
                </Text>
                <Text style={styles.description}>
                    Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
                </Text>
            </View>
            <View style={styles.footer}>
                <RNPickerSelect
                    style={
                      {
                        inputIOS: styles.select,
                        inputAndroid: styles.select,
                        iconContainer: {
                          top: 15,
                          right: 12,
                        }
                      }
                    }
                    onValueChange={(value) => setSelectedUF(value)}
                    items={ufs}
                    placeholder={{ label: 'Selecione um estado (UF)', value: '0' }}
                    Icon={() => <Icon name="chevron-down" color="#ccc" size={24} />}
                />
                <RNPickerSelect
                    style={
                      {
                        inputIOS: styles.select,
                        inputAndroid: styles.select,
                        iconContainer: {
                          top: 15,
                          right: 12,
                        },
                      }
                    }
                    onValueChange={(value) => setSelectedCity(value)}
                    items={cities}
                    placeholder={{ label: 'Selecione uma cidade', value: '0' }}
                    Icon={() => <Icon name="chevron-down" color="#ccc" size={24} />}
                />
                <RectButton 
                  style={styles.button}
                  onPress={() => navigation.navigate('Points', { city: selectedCity, uf: selectedUF })}
                >
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    input: {
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
});

export default Home;
