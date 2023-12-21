import { css } from '@emotion/react'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link } from 'react-router-dom'
import { USER_AVATAR_IMG } from '../constants/constants'
import parse from 'html-react-parser';

const notificationCard = css`
  width: 25rem;
  height: 20rem;
  overflow-y: auto;
  border: none;
  box-shadow:
    0 12px 28px 0 rgba(0, 0, 0, 0.2),
    0 2px 4px 0 rgba(0, 0, 0, 0.1);

  /* width */
  ::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #f0f0f2;
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #bcc0c4;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #bcc0c4;
  }

  @media (max-width: 576px) {
    width: calc(100vw - 3rem);
  }
`

const notificationCardBody = css``

const notificationCardTitle = css`
  font-size: 1.5rem;
`

const notificationLink = css`
  border-radius: 10px;
`

const notificationItem = css`
  display: flex;
  border: none;

  & img {
    height: 56px;
    width: 56px;
    border-radius: 50%;
  }

  &:hover {
    background-color: #f2f2f2;
    font-weight: normal;
  }
`

const notificationItemContent = css`
  padding-left: 1rem;
  margin: 0;

  & strong {
    font-weight: 600;
  }
`

const notificationItemTime = css`
  color: #a1a1a1;
`

const Test = () => {
  const text = `Assignment <strong>X</strong>'s grading in 
  <strong>Class Name</strong> has been finalized`
  return parse(text)
}

function Notification() {
  return (
    <Card css={notificationCard}>
      <Card.Body css={notificationCardBody}>
        <Card.Title css={notificationCardTitle}>Notification</Card.Title>
        <ListGroup variant="flush">
          <Link css={notificationLink}>
            <ListGroup.Item css={notificationItem}>
              <img src={USER_AVATAR_IMG[0]} alt="avatar" />
              <p css={notificationItemContent}>
                {Test()}
                <br />
                <span css={notificationItemTime}>1d ago</span>
              </p>
            </ListGroup.Item>
          </Link>
          <Link css={notificationLink}>
            <ListGroup.Item css={notificationItem}>
              <img src={USER_AVATAR_IMG[0]} alt="avatar" />
              <p css={notificationItemContent}>
                Your teacher in <strong>Class Name</strong> has
                responded to your grade review.
                <br />
                <span css={notificationItemTime}>1d ago</span>
              </p>
            </ListGroup.Item>
          </Link>
          <Link css={notificationLink}>
            <ListGroup.Item css={notificationItem}>
              <img src={USER_AVATAR_IMG[0]} alt="avatar" />
              <p css={notificationItemContent}>
                A final decision has been made on your mark review in{' '}
                <strong>Class Name</strong>.
                <br />
                <span css={notificationItemTime}>1d ago</span>
              </p>
            </ListGroup.Item>
          </Link>
          <Link css={notificationLink}>
            <ListGroup.Item css={notificationItem}>
              <img src={USER_AVATAR_IMG[0]} alt="avatar" />
              <p css={notificationItemContent}>
                A student has requested a grade review in{' '}
                <strong>Class Name</strong>.
                <br />
                <span css={notificationItemTime}>1d ago</span>
              </p>
            </ListGroup.Item>
          </Link>
          <Link css={notificationLink}>
            <ListGroup.Item css={notificationItem}>
              <img src={USER_AVATAR_IMG[0]} alt="avatar" />
              <p css={notificationItemContent}>
                A student in <strong>Class Name</strong> has
                responded to your grade review.
                <br />
                <span css={notificationItemTime}>1d ago</span>
              </p>
            </ListGroup.Item>
          </Link>
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default Notification
