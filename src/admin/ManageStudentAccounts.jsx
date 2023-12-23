import { useState, useEffect, useRef } from 'react'
import Highlighter from 'react-highlight-words'
import styles from './ManageTeacherAccounts.module.css'
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
  Checkbox,
  Space,
} from 'antd'
import {
  SaveOutlined,
  SearchOutlined,
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,
} from '@ant-design/icons'
import Cookies from 'js-cookie'
import axios from 'axios'
import ManageStudentAccountsPopupMapStudent from './ManageStudentAccountsPopupMapStudent'

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
  let tempData = args.data.map(({ username, studentID }) => ({
    username,
    studentID: studentID || '',
  }));
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
  const inputNode =
    inputType === 'number' ? (
      <InputNumber />
    ) : inputType === 'checkbox' ? (
      <Input.Checkbox />
    ) : (
      <Input />
    )

  const validationRules = []

  if (dataIndex === 'email') {
    validationRules.push({
      type: 'email',
      message: 'Please enter a valid email address!',
    })
  } else if (dataIndex === 'phone') {
    validationRules.push({
      pattern: /^[0-9]*$/, // Adjust the pattern as needed
      message: 'Please enter a valid phone number!',
    })
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={validationRules}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const ManageStudentAccounts = () => {
  const token = Cookies.get('authToken')
  const [form] = Form.useForm()
  const [data, setData] = useState(originData)
  const [editingKey, setEditingKey] = useState('')
  const [uploadModalVisible, setUploadModalVisible] = useState(false)

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

  const handleCheckboxChangeFactory = (rowIndex, columnKey) => (event) => {
    const newData = [...data]
    newData[rowIndex][columnKey] = event.target.checked
    setData(newData)
  }

  useEffect(() => {
    const fetchData = async () => {
      let simplifiedData
      await axios
        .get(`${import.meta.env.VITE_SERVER_HOST}/admins/student-accounts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          simplifiedData = response.data.map((item, i) => ({
            ...item,
            key: i.toString(),
          }))
        })
        .catch((error) => {})

      await axios
        .get(`${import.meta.env.VITE_SERVER_HOST}/admins/map-student`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          simplifiedData = simplifiedData.map((student) => {
            const matchingAccount = response.data.find(
              (account) => account.id === student.UserID
            )
            if (matchingAccount) {
              return {
                ...student,
                studentID: matchingAccount.studentID,
              }
            }

            return student
          })
        })
        .catch((error) => {})

      setData(simplifiedData)
    }

    fetchData()
  }, [])

  const SaveAll = async () => {
    try {
      await axios
        .post(
          `${import.meta.env.VITE_SERVER_HOST}/admins/student-accounts`,
          {
            accountList: data,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.data === 'Upload completed') {
          } else {
            message.error('Save failed')
          }
        })
        .catch((error) => {
          // Handle the error if needed
          message.error('Save failed')
          return
        })

        let sendData = data.map(({ UserID, studentID }) => ({
          id: UserID,
          studentID: studentID || '',
        }));
  
        await axios
          .post(
            `${
              import.meta.env.VITE_SERVER_HOST
            }/admins/map-student`,
            {
              studentList: sendData,
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
          .catch((error) => {
            message.error('Save failed')
          })
    } catch (error) {
      message.error('Save failed')
    }
  }

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}>
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}>
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toString().toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'UserID',
      width: 200,
      fixed: 'left',
      ...getColumnSearchProps('UserID'),
      sorter: (a, b) => a.UserID.localeCompare(b.UserID),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'UserName',
      dataIndex: 'username',
      width: 200,
      editable: true,
      ...getColumnSearchProps('username'),
      sorter: (a, b) => a.username.localeCompare(b.username),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Full Name',
      dataIndex: 'fullname',
      width: 200,
      editable: true,
      ...getColumnSearchProps('fullname'),
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Student ID',
      dataIndex: 'studentID',
      width: 200,
      editable: true,
      ...getColumnSearchProps('studentID'),
      sorter: (a, b) => a.studentID.localeCompare(b.studentID),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Google ID',
      dataIndex: 'googleID',
      width: 200,
      editable: false,
      ...getColumnSearchProps('googleID'),
      sorter: (a, b) => a.googleID.localeCompare(b.googleID),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Facebook ID',
      dataIndex: 'facebookID',
      width: 200,
      editable: false,
      ...getColumnSearchProps('facebookID'),
      sorter: (a, b) => a.facebookID.localeCompare(b.facebookID),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
      editable: true,
      ...getColumnSearchProps('email'),
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: 200,
      editable: true,
      ...getColumnSearchProps('phone'),
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: 200,
      editable: true,
      ...getColumnSearchProps('address'),
      sorter: (a, b) => a.address.localeCompare(b.address),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Create time',
      dataIndex: 'createTime',
      width: 200,
      ...getColumnSearchProps('createTime'),
      sorter: (a, b) => a.createTime.localeCompare(b.createTime),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Activate',
      dataIndex: 'isActivated',
      width: 150,
      editable: false,
      render: (value, record, rowIndex) => (
        <Checkbox
          checked={value}
          onChange={handleCheckboxChangeFactory(rowIndex, 'isActivated')}
        />
      ),
      sorter: (a, b) => (a.isActivated ? 1 : 0) - (b.isActivated ? 1 : 0),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Lock',
      dataIndex: 'isLocked',
      width: 150,
      editable: false,
      render: (value, record, rowIndex) => (
        <Checkbox
          defaultChecked={value}
          onChange={handleCheckboxChangeFactory(rowIndex, 'isLocked')}
        />
      ),
      sorter: (a, b) => (a.isLocked ? 1 : 0) - (b.isLocked ? 1 : 0),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      width: 150,
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
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType || 'text', // Set default to 'text' if not specified
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  const handleUpload = ({ file }) => {
    let columnDelimiter
    if (navigator.platform.toUpperCase().includes('MAC')) {
      columnDelimiter = ';'
    } else if (navigator.platform.toUpperCase().includes('WIN')) {
      columnDelimiter = ','
    }
    const reader = new FileReader()
    reader.onload = async function (e) {
      const text = e.target.result
      const lines = text.split('\n')
      const expectedHeaders = ['username', 'studentID']
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

          if (header !== 'studentID' && header !== 'username') {
            entry[header] = isNaN(value) ? value : parseFloat(value)
          } else {
            entry[header] = value
          }
        }
        jsonData.push(entry)
      }
      let simplifiedData = data.map((student) => {
        const matchingAccount = jsonData.find(
          (account) => account.username === student.username
        )
        if (matchingAccount) {
          return {
            ...student,
            studentID: matchingAccount.studentID,
          }
        }

        return student
      })
      setData(simplifiedData)

      let sendData = simplifiedData.map(({ UserID, studentID }) => ({
        id: UserID,
        studentID: studentID || '',
      }));

      await axios
        .post(
          `${
            import.meta.env.VITE_SERVER_HOST
          }/admins/map-student`,
          {
            studentList: sendData,
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
  }

  const handleOpenUpload = () => {
    setUploadModalVisible(true)
  }

  const menu = () => (
    <Menu>
      <Menu.Item
        key="upload"
        onClick={() => handleOpenUpload()}
        icon={<UploadOutlined />}>
        Upload
      </Menu.Item>
      <Menu.Item
        key="download"
        onClick={() => downloadCSV({ filename: 'data.csv', data })}
        icon={<DownloadOutlined />}>
        Download Template
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <div className={styles['button-container']}>
        <Dropdown overlay={menu()} className={styles['button-dropdown']}>
          <Button type="primary">
            Map Student <DownOutlined />
          </Button>
        </Dropdown>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          className={styles['button-dropdown']}
          onClick={() => SaveAll()}>
          Save
        </Button>
      </div>

      <ManageStudentAccountsPopupMapStudent
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onUpload={handleUpload}
      />
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          className={styles['table']}
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

export default ManageStudentAccounts
