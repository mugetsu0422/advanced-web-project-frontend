import { Outlet } from 'react-router-dom'
import MatchaNavBar from './common/MatchaNavBar'

function App() {
  return (
    <>
      <MatchaNavBar />
      <Outlet />
    </>
  )
}

export default App
