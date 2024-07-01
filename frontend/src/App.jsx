import './App.css'
import {  useRoutes } from 'react-router-dom';
import routes from './Routes'

function App() {
  let router = useRoutes(routes)
  return (
    <>
      {router}
    </>
  )
}

export default App