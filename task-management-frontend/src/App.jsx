import './App.css';
import { GlobalProvider } from './context/GlobalContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SetPassword from './pages/SetPassword';
import ResetPassword from './pages/ResetPassword';
import DashBoard from './pages/DashBoard';
import AddTask from './pages/AddTask';
import 'react-toastify/dist/ReactToastify.css';
import TaskDetails from './pages/TaskDetails';
import { PageNotFound } from './pages/PageNotFound';

function App() {
  return (
    <div className='min-h-screen relative bg-slate-900 text-white'>
    <GlobalProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element ={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/set-password' element={<SetPassword />} />
        <Route path='/user/reset-password/:id/:token' element={<ResetPassword />} />
        <Route path='/dashboard' element={<DashBoard />} />
        <Route path='/add-task' element={<AddTask />} />
        <Route path='/task-details/:id' element={<TaskDetails />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      </BrowserRouter>
    </GlobalProvider>
    </div>
  );
}

export default App;
