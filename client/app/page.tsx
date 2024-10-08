"use client"
import React, { useState, useEffect } from "react";
import { toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
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
  setIsLoggedIn: (isLoggedIn: boolean) => void; 
}
function Login({ setIsLoggedIn}: LogoutProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
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
      if (isLoggingIn) return; // Prevent multiple login attempts
      setIsLoggingIn(true); // Set logging in state to true
      try {
          const loginResult = await sdk.login.show();
          if (loginResult && loginResult.success) {
              setIsLoggedIn(true);
              await generateWallets();
              toast.success('You are successfully logged in with MoonPay!', {
                  autoClose: 5000,
                  className: 'vip-toast'
              });
          } else {
              console.error('Login failed:', loginResult);
          }
      } catch (error) {
          console.error('Error during login:', error);
          toast.error('Login failed. Please try again.', { 
              autoClose: 5000,
              className: 'vip-toast'
          });
      } finally {
          setIsLoggingIn(false); // Reset logging in state
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
            <ToastContainer 
                position="top-center" // Center toast notifications at the top
                autoClose={3000} // Auto close after 3 seconds
                hideProgressBar={true} // Hide the progress bar for a cleaner look
                closeOnClick
                pauseOnHover
                draggable
                theme="colored" // Use a colored theme for better visibility
                style={{ fontSize: '16px' }} // Custom styling (optional)
            />
        </div>
    );
};

export default Home;
