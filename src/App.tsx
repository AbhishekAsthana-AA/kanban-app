
import './index.css'
import AppRoutes from './Routes/AppRoutes';
import queryClient from "./queryClient";
import { QueryClientProvider } from "@tanstack/react-query";


function App() {

  return(
  <QueryClientProvider client={queryClient}>
    <AppRoutes />;
  </QueryClientProvider>
  )
}

export default App
