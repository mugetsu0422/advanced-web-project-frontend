import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  const centerText = {
    textAlign: 'center',
  }

  return (
    <div id="error-page" style={centerText}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>
          {error.status} {error.statusText}
        </i>
      </p>
    </div>
  )
}
