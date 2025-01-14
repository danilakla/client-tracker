
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../components/wrapper-desktop';
import { theme } from '../../../../ui-kit/themes/theme';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Column } from '../../../../ui-kit/column';

export type StudentQrCodeScanerViewProps = {

};

export const StudentQrCodeScanerView: FC<StudentQrCodeScanerViewProps> = memo(() => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<StudentQrCodeScanerMobileView
        />) :
      (<StudentQrCodeScanerDesktopView
        />)
  );
});


export const StudentQrCodeScanerMobileView: FC<StudentQrCodeScanerViewProps> = memo(() => {

  return (
    <WrapperMobile style={{padding: '50px 0px 60px 0px', height:'100vh'}} role='ROLE_STUDENT' header='QR-code сканер'>
      <Column style={{height: '100%', position: 'relative'}} horizontalAlign='center' verticalAlign='center'>
        <Scanner styles={{
            video: {
              position: 'fixed',
              top: 50,
              left: 0, 
              width: '100vw',
              height: 'calc(100vh - 110px)',
              objectFit: 'cover',
            },
            container: {
              visibility: 'collapse'
            }
          }} onScan={(result) => console.log(result)} />;
      </Column>
    </WrapperMobile>
  );
});

export const StudentQrCodeScanerDesktopView: FC<StudentQrCodeScanerViewProps> = memo(() => {

  return (
    <WrapperDesktop role='ROLE_STUDENT' header='QR-code сканер'>
    </WrapperDesktop>
  );
});

// html5-qrcode

// const QrCodeScanner: FC = () => {
//   const [scanResult, setScanResult] = useState<string | null>(null);
//   const scannerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const scannerId = "qr-code-scanner";
//     const config = {
//       fps: 10,
//       qrbox: 250, 
//     };


//     if (scannerRef.current) {
//       const html5QrCodeScanner = new Html5QrcodeScanner(scannerId, config, false);

//       html5QrCodeScanner.render(
//         (decodedText, decodedResult) => {
//           console.log("QR Code detected:", decodedText);
//           setScanResult(decodedText);
//         },
//         (errorMessage) => {
//           console.warn("QR Code error:", errorMessage);
//         }
//       );

//       return () => {
//         html5QrCodeScanner.clear().catch((error) => {
//           console.error("Failed to clear QR Code Scanner", error);
//         });
//       };
//     }
//   }, []);

//   return (
//     <div style={{ textAlign: "center" }}>
//       <div id="qr-code-scanner" ref={scannerRef} style={{ width: "100vw"}} />
//     </div>
//   );
// };
