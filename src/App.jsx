import { Outlet } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
      <div className="nav">
        <a href="/revision" className="left">MATCHA</a>
        <nav className="navbar">
          <a className="Review" href="#">1</a>
          <a className="Learn" href="#">2</a>
          <a className="Handbook" href="#">3</a>
        </nav>
        {/* <div>
          <form id="frmLogout" action="/logout" method="post"></form>
          <a className="right" href="javascript: $('#frmLogout').submit();">Log out</a>
        </div> */}
        <a href="/login" className="right">Log in</a>
      </div>
      <Outlet />
    </>
  )
}

export default App
