export const theme ={ 
    colors: {
        background: '#131328',
       
        
        
        primary: '#33ccff',
        surface: '#FFFFFF',
        attentive: '#fc657e',
        secondary: '#FCFCFC',
        foreground: '#e9e9f2',
        success: "#16d977",
        gray: '#525266',
        nothing: '000000',
        gradients: {
            primary: 'linear-gradient(to right, #5252D3 0%, #00BDE3 100%)'
        },

        error: '#AA0020',
        surfaceGray: "#7B7B7B"
    },
    fonts: {
        
        h3: {
            family: "ApplePro-Medium",
            desktopSize: "14px",
            mobileSize: "14px",
            weight: "500",
        },
        h2: {
            family: "ApplePro-Medium",
            desktopSize: "16px",
            mobileSize: "16px",
            weight: "400",
        },
        ht1: {
            family: "ApplePro-Light",
            desktopSize: "16px",
            mobileSize: "16px",
            weight: "400",
        },
        ht2: {
            family: "ApplePro-Light",
            desktopSize: "14px",
            mobileSize: "14px",
            weight: "400",
        },
        ml: {
            family: "ApplePro-Light",
            desktopSize: "12px",
            mobileSize: "12px",
            weight: "400",
        },

        h1: {
            family: "ApplePro-Heavy",
            desktopSize: "32px",
            mobileSize: "26px",
            weight: "700",
        },
        b1: {
            family: "ApplePro-Bold",
            desktopSize: "31px",
            mobileSize: "20px",
            weight: "700",
        },
        bi1: {
            family: "ApplePro-Bold-Italic",
            desktopSize: "31px",
            mobileSize: "20px",
            weight: "700",
        },
        l1: {
            family: "ApplePro-Light",
            desktopSize: "16px",
            mobileSize: "14px",
            weight: "600",
        },
        m1: {
            family: "ApplePro-Medium",
            desktopSize: "16px",
            mobileSize: "14px",
            weight: "600",
        },
        r1: {
            family: "ApplePro-Regular",
            desktopSize: "14px",
            mobileSize: "12px",
            weight: "400",
        },
        ri1: {
            family: "ApplePro-RegularItalic",
            desktopSize: "16px",
            mobileSize: "14px",
            weight: "400",
        }
    },
    toMobileSize : 1200
  }
  
  export type FontProps = {
    family: string;
    desktopSize: string;
    mobileSize: string;
    weight: string;
  };