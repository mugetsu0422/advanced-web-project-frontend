import styles from './TeacherClassDetail.module.css'
import PropTypes from 'prop-types'
import Container from 'react-bootstrap/Container'
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionButton } from 'react-bootstrap/AccordionButton'
import { InfoCircle, InfoCircleFill, Share } from 'react-bootstrap-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { useEffect, useState } from 'react'
import { css } from '@emotion/react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom'

const token = Cookies.get('authToken')

const bannerImgShow = css`
  border-radius: 1rem 1rem 0 0;
`

const invitationCodeContainer = css`
  display: flex;
  justify-content: space-between;
  font-size: 2rem;
  padding: 0rem;
  margin: 1rem;

  @media (max-width: 576px) {
    font-size: 1.5rem;
  }
`

const invitationCodeText = css`
  font-weight: bold;
  color: #71aca9;
  display: flex;
  justify-content: center;
  align-items: center;
`

const invitationCodeIconContainer = css`
  font-weight: bold;
  color: #71aca9;

  &:hover {
    cursor: pointer;
  }
`

const invitationCodeIcon = css`
  padding: 1rem;

  &:hover {
    background-color: #aacdaf4c;
  }
`

const invitationClose = css`
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
`

const copyMsg = css`
  position: absolute;
  bottom: -3rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #808080bc;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  display: none;
  transition: display 0.5s ease-in-out;
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

const InvitationModal = ({ details, showInvitation, setShowInvitation }) => {
  const dismissingPopupMsg = () => {
    const copy = document.getElementById('copyMsg')
    copy.style.display = 'block'
    setTimeout(function () {
      copy.style.display = 'none'
    }, 2000)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(details.code)
    dismissingPopupMsg()
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.host + details.link)
    dismissingPopupMsg()
  }

  return (
    <>
      <Modal
        contentClassName={`${styles['invitation-modal']}`}
        centered
        animation={false}
        show={showInvitation}
        onHide={() => setShowInvitation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invitation code</Modal.Title>
        </Modal.Header>
        <Modal.Body css={invitationCodeContainer}>
          <div css={invitationCodeText}>{details.code}</div>
          <div css={invitationCodeIconContainer}>
            <FontAwesomeIcon
              css={invitationCodeIcon}
              icon={faLink}
              onClick={copyLink}
            />
            <FontAwesomeIcon
              css={invitationCodeIcon}
              icon={faCopy}
              onClick={copyCode}
            />
          </div>
          <div id="copyMsg" css={copyMsg}>
            Copied
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            css={invitationClose}
            variant="secondary"
            onClick={() => setShowInvitation(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

function TeacherClassDetail() {
  const [showDescription, setShowDescription] = useState(false)
  const [showInvitation, setShowInvitation] = useState(false)
  const [details, setDetails] = useState({
    name: '',
    description: '',
    code: '',
    link: '',
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
              <div className={`${styles['banner-text']}`}>{details.name}</div>
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
              <div className={`${styles['invitation']}`}>
                <Share
                  className={`${styles['invitation-icon']}`}
                  onClick={() => setShowInvitation(true)}
                />
                <InvitationModal
                  details={details}
                  showInvitation={showInvitation}
                  setShowInvitation={setShowInvitation}
                />
              </div>
            </div>

            <Accordion.Body>{details.description}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </>
  )
}

export default TeacherClassDetail

const loadClassDetails = async (id) => {
  const { data = null } = await axios
    .get(`${import.meta.env.VITE_SERVER_HOST}/teachers/class/${id}`, {
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

InvitationModal.propTypes = {
  details: PropTypes.object.isRequired,
  showInvitation: PropTypes.bool.isRequired,
  setShowInvitation: PropTypes.func.isRequired,
}
