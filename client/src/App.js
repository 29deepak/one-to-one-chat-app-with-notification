import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import SetAvatar from './components/Avatar/SetAvatar';
import { AuthorizeUser } from './middleware/auth';
const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/", element: <Chat /> },
  { path: "/setAvatar", element: <AuthorizeUser><SetAvatar /></AuthorizeUser> },

])
function App() {
  return (
    <RouterProvider router={router} />
  );
}


export default App;
