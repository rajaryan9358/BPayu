
import {View, Button, NativeEventEmitter} from 'react-native';
import PayUBizSdk from 'payu-non-seam-less-react';
import {sha512} from 'js-sha512';
import {useEffect} from 'react';

export default function App() {
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter();
    const paymentSuccess = eventEmitter.addListener('onPaymentSuccess', e => {
      console.log(e.merchantResponse);
      console.log(e.payuResponse);
    });
    const paymentFailure = eventEmitter.addListener('onPaymentFailure', e => {
      console.log(e.merchantResponse);
      console.log(e.payuResponse);
    });
    const paymentCancel = eventEmitter.addListener('onPaymentCancel', e => {
      console.log('Payment cancelled -' + e);
    });
    const error = eventEmitter.addListener('onError', e => {
      console.log(e);
    });
    const generateHash = eventEmitter.addListener(
      'generateHash',
      ongenerateHash,
    );
    return () => {
      eventEmitter.removeAllListeners('paymentSuccess');
    };
  }, []);

  var payUPaymentParams = {
    key: 'MERCHANT-KEY',
    transactionId: new Date().getTime().toString(),
    amount: '1.0',
    productInfo: 'productInfo',
    firstName: 'firstName',
    email: 'test@gmail.com',
    phone: '7788996655',
    ios_surl: 'https://payu.herokuapp.com/ios_success',
    ios_furl: 'https://payu.herokuapp.com/ios_failure',
    android_surl: 'https://payu.herokuapp.com/ios_success',
    android_furl: 'https://payu.herokuapp.com/ios_failure',
    environment: '0',
    userCredential: 'merchantKey:test@gmail.com',
  };

  const ongenerateHash = (e) => {
    console.log(e.hashName);
    console.log(e.hashString);
    sendBackHash(
      e.hashName,
      e.hashString +
        'MERCHANT-SALT',
    );
  };

  const sendBackHash = (hashName, hashData) => {
    console.log(hashName);
    var hashValue = calculateHash(hashData);
    var result = {[hashName]: hashValue};
    console.log(result);
    PayUBizSdk.hashGenerated(result);
  };

  const calculateHash = (data) => {
    console.log(data);
    var result = sha512(data);
    console.log(result);
    return result;
  };

  const handlePayment = () => {
    console.log('Clicked on Payment');
    var paymentObject = {
      payUPaymentParams: payUPaymentParams
    };
    PayUBizSdk.openCheckoutScreen(paymentObject);
    console.log('PAYMENT SCREEN OPENED');
  };

  return (
    <View style={{flex: 1, margin: 20, justifyContent: 'center'}}>
      <Button title="Test Payment New" onPress={() => handlePayment()} />
    </View>
  );
}
