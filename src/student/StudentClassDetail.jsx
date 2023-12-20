import styles from '../teacher/TeacherClassDetail.module.css'
import PropTypes from 'prop-types'
import Container from 'react-bootstrap/Container'
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionButton } from 'react-bootstrap/AccordionButton'
import { InfoCircle, InfoCircleFill } from 'react-bootstrap-icons'
import { useEffect, useState } from 'react'
import { css } from '@emotion/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom'

const token = Cookies.get('authToken')

const bannerImgShow = css`
  border-radius: 1rem 1rem 0 0;
`

const creatorText = css`
  font-weight: normal;

  @media (min-width: 576px) {
    font-size: 0.8rem;
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }

  @media (min-width: 992px) {
    font-size: 1.5rem;
  }
`

function MoreToggle({
  children,
  eventKey,
  showDescription,
  setShowDescription,
}) {
  const decoratedOnClick = useAccordionButton(eventKey, () => {
    setShowDescription(!showDescription)
  })

  return (
    <div className={`${styles['more']}`} onClick={decoratedOnClick}>
      {children}
    </div>
  )
}

function StudentClassDetail() {
  const [showDescription, setShowDescription] = useState(false)
  const [details, setDetails] = useState({
    name: '',
    description: '',
    creator: '',
  })
  const { id } = useParams()

  useEffect(() => {
    loadClassDetails(id).then((res) => {
      if (res) {
        setDetails(res)
      }
    })
  }, [id])

  return (
    <>
      <Container fluid className={`mx-0 px-md-5 my-3`}>
        <Accordion className={`${styles['accordion']}`}>
          <Accordion.Item
            eventKey="0"
            className={`${styles['accordion-item']}`}>
            <div className={`${styles['banner']}`}>
              <img
                css={showDescription ? bannerImgShow : null}
                className={`${styles['banner-img']}`}
                src="https://www.gstatic.com/classroom/themes/img_bookclub.jpg"
                alt="Banner Image"
              />
              <div className={`${styles['banner-text']}`}>
                {details.name}
                <div css={creatorText}>{details.creator}</div>
              </div>
              <MoreToggle
                eventKey="0"
                showDescription={showDescription}
                setShowDescription={setShowDescription}>
                {showDescription ? (
                  <InfoCircleFill className={`${styles['info-icon']}`} />
                ) : (
                  <InfoCircle className={`${styles['info-icon']}`} />
                )}
              </MoreToggle>
            </div>

            <Accordion.Body>{details.description}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </>
  )
}

export default StudentClassDetail

const loadClassDetails = async (id) => {
  const { data = null } = await axios
    .get(`${import.meta.env.VITE_SERVER_HOST}/students/class/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((err) => {
      // Dont have access to this class
      if (err.response.status == 404) {
        window.location.href = '/teacher'
        return {}
      }
    })
  return data
}

MoreToggle.propTypes = {
  children: PropTypes.any.isRequired,
  eventKey: PropTypes.string.isRequired,
  showDescription: PropTypes.bool.isRequired,
  setShowDescription: PropTypes.func.isRequired,
}
