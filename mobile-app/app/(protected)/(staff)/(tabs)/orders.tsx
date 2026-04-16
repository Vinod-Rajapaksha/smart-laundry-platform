import { Redirect } from 'expo-router';


export default function OrdersTab() {
  return <Redirect href="/(protected)/(staff)/orders/available" />;
}