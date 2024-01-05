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
import { SaveOutlined, SearchOutlined } from '@ant-design/icons'
import Cookies from 'js-cookie'
import axios from 'axios'

const originData = []

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

const ManageTeacherAccounts = () => {
  const token = Cookies.get('authToken')
  const [form] = Form.useForm()
  const [data, setData] = useState(originData)
  const [editingKey, setEditingKey] = useState('')

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
      await axios
        .get(`${import.meta.env.VITE_SERVER_HOST}/admins/teacher-accounts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const simplifiedData = response.data.map((item, i) => ({
            ...item,
            key: i.toString(),
          }))
          setData(simplifiedData)
        })
        .catch((error) => {})
    }

    fetchData()
  }, [])

  const SaveAll = async () => {
    try {
      await axios
        .post(
          `${import.meta.env.VITE_SERVER_HOST}/admins/teacher-accounts`,
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
            message.success('Save successful')
          } else {
            message.error('Save failed')
          }
        })
        .catch((error) => {
          // Handle the error if needed
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

  return (
    <>
      <div className={styles['button-container']}>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          className={styles['button-dropdown']}
          onClick={() => SaveAll()}>
          Save
        </Button>
      </div>
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

export default ManageTeacherAccounts
