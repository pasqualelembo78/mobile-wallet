// Copyright (C) 2018, Zpalmtree
//
// Please see the included LICENSE file for more information.

import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import { WalletBackend } from 'turtlecoin-wallet-backend';

import Config from './Config';
import { Styles } from './Styles';
import { Globals } from './Globals';
import { saveToDatabase } from './Database';
import { navigateWithDisabledBack, toastPopUp } from './Utilities';
import { BottomButton, SeedComponent } from './SharedComponents';

/**
 * Schermata iniziale: crea o importa wallet
 */
export class WalletOptionScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'flex-start',
                backgroundColor: this.props.screenProps.theme.backgroundColour
            }}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 50
                }}>
                    <Image
                        source={this.props.screenProps.theme.logo}
                        style={Styles.logo}
                    />
                    <Text style={{
                        fontSize: 20,
                        color: this.props.screenProps.theme.slightlyMoreVisibleColour,
                    }}>
                        {Config.sloganCreateScreen}
                    </Text>
                </View>

                <View style={[Styles.buttonContainer, {
                    bottom: 100,
                    position: 'absolute',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    width: '100%'
                }]}>
                    <Button
                        title='Create New Wallet'
                        onPress={() => this.props.navigation.navigate('Disclaimer', { nextRoute: 'CreateWallet' })}
                        color={this.props.screenProps.theme.primaryColour}
                    />
                </View>

                <View style={[Styles.buttonContainer, {
                    bottom: 40,
                    position: 'absolute',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    width: '100%'
                }]}>
                    <Button
                        title='Recover Wallet'
                        onPress={() => this.props.navigation.navigate('Disclaimer', { nextRoute: 'ImportWallet' })}
                        color={this.props.screenProps.theme.primaryColour}
                    />
                </View>
            </View>
        );
    }
}

/**
 * Creazione nuovo wallet
 */
export class CreateWalletScreen extends React.Component {
    static navigationOptions = {
        title: 'Create',
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            seed: '',
        };
    }

    async componentDidMount() {
        try {
            console.log('⏳ Creazione nuovo wallet in corso...');
            Globals.wallet = await WalletBackend.createWallet(Globals.getDaemon(), Config);

            // ✅ Otteniamo il seed mnemonico in modo sicuro
            const mnemonic = await Globals.wallet.getMnemonicSeed();
            const seed = Array.isArray(mnemonic) ? mnemonic[0] : mnemonic;

            console.log('✅ Seed generato:', seed);

            if (!seed || seed.trim() === '') {
                toastPopUp('Errore: seed vuoto!');
            }

            this.setState({ seed });

            // 💾 Salva wallet nel database
            await saveToDatabase(Globals.wallet);
        } catch (error) {
            console.error('❌ Errore durante la creazione del wallet:', error);
            toastPopUp('Errore durante la creazione del wallet');
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'flex-start',
                backgroundColor: this.props.screenProps.theme.backgroundColour
            }}>
                <View style={{
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 60,
                    marginLeft: 30,
                    marginRight: 10,
                }}>
                    <Text style={{
                        color: this.props.screenProps.theme.primaryColour,
                        fontSize: 25,
                        marginBottom: 40
                    }}>
                        Your wallet has been created!
                    </Text>

                    <Text style={{
                        fontSize: 15,
                        marginBottom: 20,
                        color: this.props.screenProps.theme.slightlyMoreVisibleColour
                    }}>
                        Please save the following backup words somewhere safe.
                    </Text>

                    <Text style={{
                        fontWeight: 'bold',
                        color: 'red',
                        marginBottom: 20
                    }}>
                        Without this seed, if your phone gets lost, or your wallet gets corrupted,
                        you cannot restore your wallet, and your funds will be lost forever!
                    </Text>
                </View>

                <View style={{
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'flex-start'
                }}>
                    {this.state.seed !== '' && (
                        <SeedComponent
                            seed={this.state.seed}
                            borderColour={'red'}
                            {...this.props}
                        />
                    )}

                    <BottomButton
                        title="Continue"
                        onPress={() => this.props.navigation.navigate('Home')}
                        {...this.props}
                    />
                </View>
            </View>
        );
    }
}
