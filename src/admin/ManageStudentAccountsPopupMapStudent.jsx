import React, { useState } from 'react'
import { Modal, Button, Select, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const { Option } = Select

const ManageStudentAccountsPopupMapStudent = ({
  visible,
  onCancel,
  onUpload,
}) => {
  const [file, setFile] = useState(null)

  const handleFileChange = ({ file, fileList }) => {
    setFile(file)
  }

  const handleUpload = () => {
    if (!file) {
      message.error('Please upload a file.')
      return
    }

    const fileExtension = file.name.split('.').pop().toLowerCase()
    if (!fileTypes.includes(fileExtension)) {
      message.error(`You can only upload ${fileTypes.join(', ')} files!`)
      return
    }

    // Perform your upload logic here
    onUpload({ file })
    setFile(null)

    // Reset state and close the modal
    onCancel()
  }

  const fileTypes = ['csv', 'xlsx'] // assuming these are the file types

  const beforeUpload = (file) => {
    // Get the file extension
    const fileExtension = file.name.split('.').pop().toLowerCase()

    // Check if the file type is allowed
    if (!fileTypes.includes(fileExtension)) {
      message.error(`You can only upload ${fileTypes.join(', ')} files!`)
      return Promise.reject() // Prevent file upload
    }

    return true // Allow file upload
  }

  const modalProps = {
    title: 'Upload File',
    visible,
    onCancel,
    footer: [
      <Button key="cancel" onClick={onCancel}>
        Cancel
      </Button>,
      <Button key="upload" type="primary" onClick={handleUpload}>
        Upload
      </Button>,
    ],
  }

  return (
    <Modal {...modalProps}>
      <Upload
        fileList={file ? [file] : []}
        beforeUpload={beforeUpload}
        onChange={handleFileChange}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
    </Modal>
  )
}

export default ManageStudentAccountsPopupMapStudent
