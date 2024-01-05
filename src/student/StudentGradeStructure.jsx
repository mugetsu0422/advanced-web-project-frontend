import { css } from '@emotion/react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

const token = Cookies.get('authToken')

const container = css`
  display: grid;
  place-items: center;
`

const headerCardContainer = css`
  width: 80%;
  border: none;
  max-width: 70rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const cardBody = css`
  padding: 0rem;
`

const cardTitle = css`
  font-size: 2rem;
  color: #71aca9;
  border-bottom: 1px solid #71aca9;
  display: flex;
  justify-content: space-between;

  @media (max-width: 576px) {
    font-size: 1.5rem;
  }
`

const titleText = css`
  display: grid;
  place-items: center;
  margin-left: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`

const percent = css`
  margin-right: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

const gradeCompositionContainer = css`
  width: 80%;
  border: none;
  max-width: 70rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const gradeCompositionBody = css`
  padding: 0rem;
`

const gradeCompositionTitle = css`
  font-size: 1.2rem;
  border-bottom: 1px solid #a1a1a1;
  display: flex;
  justify-content: space-between;

  @media (max-width: 576px) {
    font-size: 1rem;
  }
`

const gradeCompositionText = css`
  display: grid;
  place-items: center;
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

const gradeCompositionPercent = css`
  margin-right: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

const GradeCompositionList = ({ gpList }) => {
  return gpList.map((ele, idx) => {
    return (
      <Card key={idx} css={gradeCompositionContainer}>
        <Card.Body css={gradeCompositionBody}>
          <Card.Text as={'div'} css={gradeCompositionTitle}>
            <div css={gradeCompositionText}>{ele.name}</div>
            <div css={gradeCompositionPercent}>{ele.scale}%</div>
          </Card.Text>
        </Card.Body>
      </Card>
    )
  })
}

function StudentGradeStructure() {
  const [gpList, setGpList] = useState([])
  const { id } = useParams()

  const totalPercent = gpList.reduce((total, currentValue) => {
    return total + currentValue.scale
  }, 0)

  useEffect(() => {
    loadGradeComposition(id).then((res) => {
      if (res) {
        setGpList(res)
      }
    })
  }, [id])

  return (
    <Container css={container} fluid>
      <Card css={headerCardContainer}>
        <Card.Body css={cardBody}>
          <Card.Title css={cardTitle}>
            <div css={titleText}>Total</div>
            <div css={percent}>{totalPercent}%</div>
          </Card.Title>
        </Card.Body>
      </Card>
      <GradeCompositionList gpList={gpList} />
    </Container>
  )
}

export default StudentGradeStructure

GradeCompositionList.propTypes = {
  gpList: PropTypes.array.isRequired,
}

const loadGradeComposition = async (id) => {
  const { data = null } = await axios
    .get(
      `${
        import.meta.env.VITE_SERVER_HOST
      }/students/class/${id}/grade-compositions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .catch(() => {})
  return data
}
