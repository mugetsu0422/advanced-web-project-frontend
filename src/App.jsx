import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <>
      <div className="nav">
        <Link to={'/'} className="left">
          MATCHA
        </Link>
        <nav className="navbar">
          <Link className="Review" to={'#'}>
            1
          </Link>
          <Link className="Learn" to={'#'}>
            2
          </Link>
          <Link className="Handbook" to={'#'}>
            3
          </Link>
        </nav>
        {/* <div>
          <form id="frmLogout" action="/logout" method="post"></form>
          <a className="right" href="javascript: $('#frmLogout').submit();">Log out</a>
        </div> */}
        <Link to={'/signin'} className="right">
          Log in
        </Link>
      </div>
      <Outlet />
    </>
  )
}

export default App
