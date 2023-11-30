import styles from '../student/StudentHome.module.css'
import PropTypes from 'prop-types'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function LoadClassList() {
  return [
    {
      className: 'Nhập môn lập trình',
      classShortName: '1',
      classDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dignissim velit ac lacus laoreet venenatis. Donec auctor tempus semper. Suspendisse posuere vitae justo sed vehicula. Fusce ultrices suscipit cursus. Vivamus bibendum, nisl non sodales lobortis, tellus est blandit dui, eu vehicula metus mi non lorem. Suspendisse commodo neque et ultricies vehicula. Sed et fringilla lorem.',
      creator: 'Trương Toàn Thịnh',
    },
    {
      className: 'Kỹ thuật lập trình',
      classShortName: '2',
      classDescription: '2',
    },
    {
      className: 'Cấu trúc dữ liệu và giải thuật',
      classShortName: '3',
      classDescription: '3',
    },
    {
      className: 'Phương pháp lập trình hướng đối tượng',
      classShortName: '4',
      classDescription: '4',
    },
    {
      className: 'Nhập môn công nghệ phần mềm',
      classShortName: '5',
      classDescription: '5',
    },
  ]
}

function CreateClassList() {
  const classList = LoadClassList()

  return (
    <>
      {classList.map((ele) => {
        return (
          <>
            <Col className="mb-4 d-flex">
              <ClassCard classElement={ele} />
            </Col>
          </>
        )
      })}
    </>
  )
}

function ClassCard({ classElement }) {
  return (
    <>
      <Card className={`${styles['class-card']}`}>
        <Card.Header className={`${styles['class-card-header']}`}>
          <Card.Title className={`${styles['truncate-text-one-line']}`}>
            {classElement.className}
          </Card.Title>
        </Card.Header>
        <Card.Body className={`${styles['class-card-body']}`}>
          <Card.Text className={`${styles['truncate-text-multi-line']}`}>
            {classElement.classDescription}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  )
}

function TeacherHome() {
  return (
    <Container fluid className={`${styles['container-fluid']} pt-4 px-5`}>
      <Row xs="1" sm="2" md="3" lg="4">
        {CreateClassList()}
      </Row>
    </Container>
  )
}

export default TeacherHome

ClassCard.propTypes = {
  classElement: PropTypes.object.isRequired,
}
