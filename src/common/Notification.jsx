/* eslint-disable react-hooks/exhaustive-deps */
import { css } from '@emotion/react'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link } from 'react-router-dom'
import {
  NOTIFICATION_GET_LIMIT,
  NOTIFICATION_LIMIT,
  USER_AVATAR_IMG,
} from '../constants/constants'
import parse from 'html-react-parser'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Spinner from 'react-bootstrap/Spinner'
import moment from 'moment'

const token = Cookies.get('authToken')

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

const spinner = css`
  height: 2.5rem;
  width: 2.5rem;
  margin: auto;
  color: #aacdaf;
`

const NotificationList = ({ list }) => {
  return list.map((ele, idx) => {
    return (
      <Link key={idx} css={notificationLink} to={'#'}>
        <ListGroup.Item css={notificationItem}>
          <img src={USER_AVATAR_IMG[0]} alt="avatar" />
          <p css={notificationItemContent}>
            {parse(ele.content)}
            <br />
            <span css={notificationItemTime}>
              {moment(ele.createTime).fromNow()}
            </span>
          </p>
        </ListGroup.Item>
      </Link>
    )
  })
}

function Notification() {
  const [noti, setNoti] = useState([])
  const [offset, setOffset] = useState(0)
  const loading = useRef(true)
  const offsetCurrent = useRef(0)
  const notiCount = useRef(0)
  const notificationCardRef = useRef(null)

  const handleScroll = () => {
    const container = notificationCardRef.current
    if (container && !loading.current) {
      const containerHeight = container.clientHeight
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight

      if (
        containerHeight + scrollTop >= scrollHeight - 10 &&
        offsetCurrent.current <= notiCount.current
      ) {
        loading.current = true
        setOffset((prevOffset) => prevOffset + NOTIFICATION_GET_LIMIT)
      }
    }
  }

  useEffect(() => {
    loadNotificationCount().then((res) => (notiCount.current = res))

    const container = notificationCardRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    if (noti.length > NOTIFICATION_LIMIT) {
      return
    }
    loadNotification(offset, NOTIFICATION_GET_LIMIT)
      .then((res) => {
        setNoti(noti.concat(res))
        offsetCurrent.current += NOTIFICATION_GET_LIMIT
      })
      .finally(() => {
        loading.current = false
      })
  }, [offset])

  return (
    <Card css={notificationCard} ref={notificationCardRef}>
      <Card.Body css={notificationCardBody}>
        <Card.Title css={notificationCardTitle}>Notification</Card.Title>
        <ListGroup variant="flush">
          <NotificationList list={noti} />
          <Spinner
            css={spinner}
            style={{ display: loading.current ? 'block' : 'none' }}
            animation="border"
          />
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default Notification

const loadNotificationCount = async () => {
  const { data } = await axios
    .get(`${import.meta.env.VITE_SERVER_HOST}/users/notification/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((err) => {
      console.error(err)
    })
  return data
}

const loadNotification = async (offset, limit) => {
  const { data } = await axios
    .get(
      `${
        import.meta.env.VITE_SERVER_HOST
      }/users/notification?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .catch((err) => {
      console.error(err)
    })
  return data
}
