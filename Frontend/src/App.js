import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './component/Home';
import Login from './component/Login';
import Registration from './component/Registration';
import Dashboard from './component/Dashboard';
import Main from './component/Main'
import ArticleDetails from './component/ArticleDetails'
import ProtectedRoute from './component/ProtectedRoute'
import Subscription from './component/Subscription';
import WalletScreen from './component/WalletScreen';
import TransactionHistoryScreen from './component/TransactionHistoryScreen';
import ContentPage from './component/ContentPage';
import 'react-toastify/dist/ReactToastify.css';
import PaymentOption from './component/PaymentOption';
import EditProfile from './component/EditProfile';
import { DarkModeProvider } from './component/DarkModeContext';
import EmailPage from './component/EmailPage';
import Epaper from './component/Epaper';
import EpaperSubscription from './component/EpaperSubscription';

function App() {
  return (
    <DarkModeProvider>
    <Router>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Registration />} />
        <Route path='/home' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path='/epaperSubscription' element={<EpaperSubscription/>}/>
        <Route path='/contents' element={<Main/>}/>
        <Route path="/walletscreen" element={<WalletScreen />} />
        <Route path="/ContentPage" element={<ContentPage />} />
        <Route path="/transaction-history" element={<TransactionHistoryScreen />} />
        <Route path="/payment-option" element={<PaymentOption />} />
        <Route path="/contents/article/:id" element={
            // <ProtectedRoute>
              <ArticleDetails/>
            // </ProtectedRoute>
          }
        />
        {/* <Route
          path="/article/:id"
          element={
            // <ProtectedRoute>
              <ArticleDetails/>
            // </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/payment-option/contents/article/:id"
          element={
            // <ProtectedRoute>
              <ArticleDetails/>
            // </ProtectedRoute>
          }
        /> */}
        <Route path="/email" element={<EmailPage />} />
        <Route path="/epaper" element={<Epaper />} />
      </Routes>
    </Router>
    </DarkModeProvider>
  );
}

export default App;