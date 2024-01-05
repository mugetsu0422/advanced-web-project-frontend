import { useState, useEffect } from 'react'
import styles from './TeacherGradeManagement.module.css'
import {
  DownloadOutlined,
  UploadOutlined,
  DownOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Button,
  Dropdown,
  Menu,
  message,
} from 'antd'
import TeacherGradeManagementPopupUpload from './TeacherGradeManagementPopupUpload'
import Cookies from 'js-cookie'
import axios from 'axios'

const originData = []

const convertArrayOfObjectsToCSV = (args) => {
  const data = args.data
  if (!data || !data.length) return

  let columnDelimiter

  if (navigator.platform.toUpperCase().includes('MAC')) {
    columnDelimiter = ';'
  } else if (navigator.platform.toUpperCase().includes('WIN')) {
    columnDelimiter = ','
  }

  const lineDelimiter = '\n'

  const keys = Object.keys(data[0])

  let result = ''
  result += keys.join(columnDelimiter)
  result += lineDelimiter

  data.forEach((item) => {
    let ctr = 0
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter
      result += item[key]
      ctr++
    })
    result += lineDelimiter
  })

  return result
}

const downloadCSV = (args) => {
  let tempData
  if (args.type === 'studentList') {
    tempData = [
      {
        StudentID: '',
        FullName: '',
      },
    ]
  } else if (args.type === 'grade') {
    const modifiedData = args.data.map((item) => ({
      ...item,
      Grade: '',
    }))

    const simplifiedData = modifiedData.map(({ StudentID, Grade }) => ({
      StudentID,
      Grade,
    }))

    tempData = simplifiedData
  } else if (args.type === 'all') {
    const modifiedData = args.data.map((item) => ({
      ...item,
      Overall: item['Overall'] || '',
    }))

    tempData = modifiedData.map(({ key, UserName, ...rest }) => {
      const orderedFields = [
        { name: 'StudentID', value: rest.StudentID },
        { name: 'FullName', value: rest.FullName },
        ...args.gradeCompositionNames.map((name) => ({
          name,
          value: rest[name] || '',
        })),
        { name: 'Overall', value: rest.Overall },
      ]

      const reorderedObject = Object.fromEntries(
        orderedFields.map(({ name, value }) => [name, value])
      )

      return reorderedObject
    })
  }
  let csv = convertArrayOfObjectsToCSV({
    data: tempData,
  })
  if (!csv) return

  const filename = args.filename || 'export.csv'

  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv
  }

  const data = encodeURI(csv)

  const link = document.createElement('a')
  link.setAttribute('href', data)
  link.setAttribute('download', filename)
  link.click()
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: false,
            },
          ]}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const TeacherGradeManagement = () => {
  const token = Cookies.get('authToken')
  const [uploadModalVisible, setUploadModalVisible] = useState(false)
  const [uploadType, setUploadType] = useState('')

  const [form] = Form.useForm()
  const [data, setData] = useState(originData)
  const [editingKey, setEditingKey] = useState('')
  const [classID, setClassID] = useState('')

  const isEditing = (record) => record.key === editingKey

  const edit = (record) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (key) => {
    try {
      const row = await form.validateFields()

      const newData = [...data]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {}
  }

  const [gradeCompositionList, setGradeCompositionList] = useState([])
  const [gradeCompositionNames, setGradeCompositionNames] = useState([])

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/')
    const tempClassID = pathSegments[pathSegments.length - 2]
    setClassID(tempClassID)

    let tempGradeCompositionList
    let simplifiedData

    const fetchData = async () => {
      await axios
        .get(
          `${
            import.meta.env.VITE_SERVER_HOST
          }/teachers/class/${tempClassID}/grade-compositions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setGradeCompositionList(response.data)
          tempGradeCompositionList = response.data
          const listName = response.data.map((item) => item.name)
          const sortedListName = listName.sort((a, b) => {
            const orderA =
              response.data.find((item) => item.name === a)?.order || 0
            const orderB =
              response.data.find((item) => item.name === b)?.order || 0
            return orderA - orderB
          })
          setGradeCompositionNames(sortedListName)
        })
        .catch((error) => {})

      await axios
        .get(
          `${import.meta.env.VITE_SERVER_HOST}/teachers/class/${tempClassID}/student-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          simplifiedData = response.data.map(({ id, fullname }, i) => ({
            StudentID: id,
            FullName: fullname,
            key: i.toString(),
          }))
        })
        .catch((error) => {})

      await axios
        .get(
          `${
            import.meta.env.VITE_SERVER_HOST
          }/teachers/class/${tempClassID}/student-account-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          simplifiedData = simplifiedData.map((student) => {
            const matchingAccount = response.data.find(
              (account) => account.studentID === student.StudentID
            )
            if (matchingAccount) {
              return {
                ...student,
                UserName: matchingAccount.username,
              }
            }

            return student
          })
        })
        .catch((error) => {})

      await axios
        .get(
          `${import.meta.env.VITE_SERVER_HOST}/teachers/class/${tempClassID}/all-grade`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          simplifiedData = simplifiedData.map((student) => {
            const studentGrades = response.data
              .filter((data) => data.studentID === student.StudentID)
              .map(({ gradeCompositionID, grade }) => {
                const gradeCompositionName = tempGradeCompositionList.find(
                  (composition) => composition.id === gradeCompositionID
                )?.name

                return { [gradeCompositionName]: grade }
              })

            return {
              ...student,
              ...Object.assign({}, ...studentGrades),
            }
          })
        })
        .catch((error) => {})

      await await axios
        .get(
          `${import.meta.env.VITE_SERVER_HOST}/teachers/class/${tempClassID}/overall-grade`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          simplifiedData = simplifiedData.map((student) => {
            const matchingAccount = response.data.find(
              (account) => account.studentID === student.StudentID
            )
            if (matchingAccount) {
              return {
                ...student,
                Overall: matchingAccount.grade,
              }
            }

            return student
          })

          setData(simplifiedData)
        })
        .catch((error) => {})
    }

    fetchData()
  }, [])

  const SaveAll = async () => {
    const pathSegments = window.location.pathname.split('/')
    const tempClassID = pathSegments[pathSegments.length - 2]
    try {
      const requests = gradeCompositionNames.map(
        async (gradeCompositionName) => {
          const gradeCompositionFind = gradeCompositionList.find(
            (item) => item.name === gradeCompositionName
          )

          const modifiedData = data.map((item) => ({
            ...item,
            gradeCompositionID: gradeCompositionFind.id,
          }))

          const simplifiedData = modifiedData.map(
            ({ gradeCompositionID, StudentID, ...rest }) => ({
              gradeCompositionID,
              studentID: StudentID,
              grade: rest[gradeCompositionName],
            })
          )

          const response = await axios.post(
            `${
              import.meta.env.VITE_SERVER_HOST
            }/teachers/class/${tempClassID}/specific-grade`,
            {
              gradeList: simplifiedData,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (response.status === 200) {
          }
        }
      )

      await Promise.all(requests)

      const scaleList = gradeCompositionList.map((item) => ({
        name: item.name,
        scale: item.scale,
      }))

      const studentsWithOverall = data.map((student) => {
        const grades = gradeCompositionNames.map((gradeName) => ({
          gradeCompositionName: gradeName,
          grade: student[gradeName] || 0,
        }))

        const overall = calculateOverall(grades, scaleList)

        return {
          ...student,
          Overall: overall,
        }
      })
      setData(studentsWithOverall)

      const modifiedData1 = studentsWithOverall.map((item) => ({
        ...item,
        classID: classID,
      }))

      const simplifiedData1 = modifiedData1.map(
        ({ StudentID, classID, Overall }) => ({
          studentID: StudentID,
          classID: classID,
          grade: Overall,
        })
      )

      axios
        .post(
          `${import.meta.env.VITE_SERVER_HOST}/teachers/class/${tempClassID}/overall-grade`,
          {
            overallGradeList: simplifiedData1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.data === 'Upload completed') {
          }
        })
        .catch((error) => {})

      message.success('Save successful')
    } catch (error) {
      console.log(error)
      message.error('Save failed')
    }
  }

  const fixedColumns = [
    {
      title: 'Student ID',
      dataIndex: 'StudentID',
      width: 70,
      fixed: 'left',
    },
    {
      title: 'Full Name',
      dataIndex: 'FullName',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'UserName',
      dataIndex: 'UserName',
      width: 100,
      fixed: 'left',
    },
  ]

  const dynamicColumns = gradeCompositionNames.map((item, index) => {
    const isFinalized = gradeCompositionList.find(
      (composition) => composition.name === item
    )?.isFinalized || false;
  
    return {
      title: item,
      dataIndex: item,
      width: 50,
      editable: !isFinalized,
      render: (text, record) => record[item] || 0.0,
    };
  });

  const overallColumn = {
    title: 'Overall',
    dataIndex: 'Overall',
    width: 50,
    fixed: 'right',
    render: (text, record) => record['Overall'] || 0.0,
  }

  const operationColumn = {
    title: 'Operation',
    dataIndex: 'operation',
    width: 100,
    fixed: 'right',
    render: (_, record) => {
      const editable = isEditing(record)
      return editable ? (
        <span>
          <Typography.Link
            onClick={() => save(record.key)}
            style={{ marginRight: 8 }}>
            Save
          </Typography.Link>
          <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
            <a>Cancel</a>
          </Popconfirm>
        </span>
      ) : (
        <Typography.Link
          disabled={editingKey !== ''}
          onClick={() => edit(record)}>
          Edit
        </Typography.Link>
      )
    },
  }

  const columns = [
    ...fixedColumns,
    ...dynamicColumns,
    overallColumn,
    operationColumn,
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  const calculateOverall = (grades, scaleList) => {
    const total = grades.reduce((overall, grade) => {
      const scale =
        scaleList.find((item) => item.name === grade.gradeCompositionName)
          ?.scale || 0
      return overall + (grade.grade * scale) / 100
    }, 0)

    const roundedOverall = total.toFixed(2)
    return parseFloat(roundedOverall)
  }

  const handleUpload = ({ gradeComposition, file }) => {
    const pathSegments = window.location.pathname.split('/')
    const tempClassID = pathSegments[pathSegments.length - 2]
    let columnDelimiter
    if (navigator.platform.toUpperCase().includes('MAC')) {
      columnDelimiter = ';'
    } else if (navigator.platform.toUpperCase().includes('WIN')) {
      columnDelimiter = ','
    }
    if (uploadType === 'studentList') {
      const reader = new FileReader()
      reader.onload = async function (e) {
        const text = e.target.result
        const lines = text.split('\n')
        const expectedHeaders = ['StudentID', 'FullName']
        const headers = lines[0]
          .split(columnDelimiter)
          .map((header) => header.trim())

        if (!headers.every((header) => expectedHeaders.includes(header))) {
          message.error(
            'File is in wrong format. Please use the correct template.'
          )
          return
        }

        const jsonData = []

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(columnDelimiter)
          if (values.length === 1 && values[0].trim() === '') {
            continue
          }
          const entry = { key: i.toString() }

          for (let j = 0; j < headers.length; j++) {
            const value = values[j].trim()
            const header = headers[j]

            if (header !== 'StudentID' && header !== 'FullName') {
              entry[header] = isNaN(value) ? value : parseFloat(value)
            } else {
              entry[header] = value
            }
          }

          // Rest of your code
          for (let j = 0; j < gradeCompositionNames.length; j++) {
            entry[gradeCompositionNames[j]] = 0.0
          }
          entry['Overall'] = 0.0
          jsonData.push(entry)
        }
        setData(jsonData)

        const modifiedData = jsonData.map((item) => ({
          ...item,
          classID: classID,
        }))

        const simplifiedData = modifiedData.map(
          ({ StudentID, FullName, classID }) => ({
            id: StudentID,
            fullname: FullName,
            classID: classID,
          })
        )

        await axios
          .post(
            `${
              import.meta.env.VITE_SERVER_HOST
            }/teachers/class/${tempClassID}/student-list`,
            {
              classStudentList: simplifiedData,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            if (response.data === 'Upload completed') {
              message.success('File uploaded successfully!')
            }
            else {
              message.error('File uploaded failed!')
            }
          })
          .catch((error) => {})
      }
      reader.readAsText(file.originFileObj)
    } else {
      const gradeCompositionFind = gradeCompositionList.find(item => item.name === gradeComposition)
      if (gradeCompositionFind) {
        if (gradeCompositionFind.isFinalized) {
          message.error(
            'Grade composition has been finalized. Cannot edit anymore.'
          )
          return
        }
      }
      const reader = new FileReader()
      reader.onload = function (e) {
        const text = e.target.result
        const lines = text.split('\n')
        const expectedHeaders = ['StudentID', 'Grade']
        const headers = lines[0]
          .split(columnDelimiter)
          .map((header) => header.trim())

        if (!headers.every((header) => expectedHeaders.includes(header))) {
          message.error(
            'File is in wrong format. Please use the correct template.'
          )
          return
        }

        const jsonData = []
        const oldData = [...data]

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(columnDelimiter)
          if (values.length === 1 && values[0].trim() === '') {
            continue
          }
          const entry = { key: i.toString() }

          for (let j = 0; j < headers.length; j++) {
            const value = values[j].trim()

            entry[headers[j]] = isNaN(value) ? value : parseFloat(value)

            if (headers[j] === 'Grade') {
              entry[gradeComposition] = entry[headers[j]]
            }
          }
          delete entry['Grade']
          jsonData.push({ ...oldData[i - 1], ...entry })
        }

        gradeCompositionNames.map(async (gradeCompositionName) => {
          const gradeCompositionFind = gradeCompositionList.find(
            (item) => item.name === gradeCompositionName
          )
        })

        const scaleList = gradeCompositionList.map((item) => ({
          name: item.name,
          scale: item.scale,
        }))

        const studentsWithOverall = jsonData.map((student) => {
          const grades = gradeCompositionNames.map((gradeName) => ({
            gradeCompositionName: gradeName,
            grade: student[gradeName] || 0,
          }))

          const overall = calculateOverall(grades, scaleList)

          return {
            ...student,
            Overall: overall,
          }
        })

        setData(studentsWithOverall)

        const gradeCompositionFind = gradeCompositionList.find(
          (item) => item.name === gradeComposition
        )

        const modifiedData = jsonData.map((item) => ({
          ...item,
          gradeCompositionID: gradeCompositionFind.id,
        }))

        const simplifiedData = modifiedData.map(
          ({ gradeCompositionID, StudentID, ...rest }) => ({
            gradeCompositionID,
            studentID: StudentID,
            grade: rest[gradeComposition],
          })
        )

        axios
          .post(
            `${
              import.meta.env.VITE_SERVER_HOST
            }/teachers/class/${tempClassID}/specific-grade`,
            {
              gradeList: simplifiedData,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            if (response.data === 'Upload completed') {
            }
          })
          .catch((error) => {})

        const modifiedData1 = studentsWithOverall.map((item) => ({
          ...item,
          classID: classID,
        }))

        const simplifiedData1 = modifiedData1.map(
          ({ StudentID, classID, Overall }) => ({
            studentID: StudentID,
            classID: classID,
            grade: Overall,
          })
        )

        axios
          .post(
            `${import.meta.env.VITE_SERVER_HOST}/teachers/class/${tempClassID}/overall-grade`,
            {
              overallGradeList: simplifiedData1,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            if (response.data === 'Upload completed') {
              message.success('File uploaded successfully!')
            }
          })
          .catch((error) => {})
      }
      reader.readAsText(file.originFileObj)
    }
  }

  const handleOpenUpload = (type) => {
    setUploadModalVisible(true)
    setUploadType(type)
  }

  const menu = (type) => (
    <Menu>
      <Menu.Item
        key="upload"
        onClick={() => handleOpenUpload(type)}
        icon={<UploadOutlined />}>
        Upload
      </Menu.Item>
      <Menu.Item
        key="download"
        onClick={() => downloadCSV({ filename: 'data.csv', type, data })}
        icon={<DownloadOutlined />}>
        Download Template
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <div className={styles['button-container']}>
          <Dropdown
            overlay={menu('studentList')}
            className={styles['button-dropdown']}>
            <Button type="primary">
              Student List <DownOutlined />
            </Button>
          </Dropdown>

          <Dropdown
            overlay={menu('grade')}
            className={styles['button-dropdown']}>
            <Button type="primary">
              Grade <DownOutlined />
            </Button>
          </Dropdown>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            className={styles['button-dropdown']}
            onClick={() =>
              downloadCSV({
                filename: 'data.csv',
                type: 'all',
                data,
                gradeCompositionNames,
              })
            }>
            Export
          </Button>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            className={styles['button-dropdown']}
            onClick={() => SaveAll()}>
            Save
          </Button>
        </div>

      <TeacherGradeManagementPopupUpload
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onUpload={handleUpload}
        uploadType={uploadType}
        gradeCompositions={gradeCompositionNames}
      />

      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          className={styles['table-score']}
          dataSource={data}
          columns={mergedColumns}
          rowClassName={styles['editable-row']}
          pagination={{
            onChange: cancel,
          }}
          scroll={{ x: 1000, y: 600 }}
        />
      </Form>
    </>
  )
}

export default TeacherGradeManagement
