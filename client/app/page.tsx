"use client"
import React, { useState, useEffect } from "react";
import { MoonPayAuthSDK, LoginComponents, OAuthProviders } from "@moonpay/auth-sdk";


const apiKey = "pk_test_Gmd8mQs1ELMyeBqwnXbr76yiVNw8pUDv";

const sdk = new MoonPayAuthSDK(apiKey, {
    components: [LoginComponents.EmailOtp, LoginComponents.SocialLogin],
    oauthOptions: {
        providers: [OAuthProviders.Google, OAuthProviders.Apple],
        mode: 'horizontal',
        appleAllowHideMyEmail: true,
    },
    linkVerifiedWallet: true,
    walletOptions: {
        generateWallet: true,
        isMainnet: false,
    }
});
interface LogoutProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void; // Function that sets login state
}
function Login({ setIsLoggedIn}: LogoutProps) {
    useEffect(() => {
        const initializeSdk = async () => {
            await sdk.init();
            const isLoggedIn = await sdk.isLoggedIn();
            setIsLoggedIn(isLoggedIn);
        };

        initializeSdk();
    }, [setIsLoggedIn]);

    const generateWallets = async () => {
        try {
            const walletsResponse = await sdk.createWallet();
            console.log('Generated Wallets:', walletsResponse.wallets);
            walletsResponse.wallets.forEach(wallet => {
                console.log(`Chain: ${wallet.network}, Address: ${wallet.address}`);
            });
        } catch (error) {
            console.error('Error generating wallets:', error);
        }
    };

    const handleLogin = async () => {
        try {
            const loginResult = await sdk.login.show();
            if (loginResult && loginResult.success) {
                setIsLoggedIn(true);
                await generateWallets();
            } else {
                console.error('Login failed:', loginResult);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Login to Your Wallet</h1>
            <button className="login-button" onClick={handleLogin}>Login with MoonPay</button>
        </div>
    );
}

function Logout({ setIsLoggedIn }: LogoutProps) {
    const handleLogout = async () => {
        await sdk.logout();
        setIsLoggedIn(false);
    };

    return (
        <button className="logout-button" onClick={handleLogout}>Logout</button>
    );
}

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div className="App">
            <div className="app-content">
                {isLoggedIn ? (
                    <div className="welcome-container">
                        <p className="welcome-message">Welcome, you are logged in!</p>
                        <Logout setIsLoggedIn={setIsLoggedIn} />
                    </div>
                ) : (
                    <Login setIsLoggedIn={setIsLoggedIn} />
                )}
            </div>
        </div>
    );
};

export default Home;
