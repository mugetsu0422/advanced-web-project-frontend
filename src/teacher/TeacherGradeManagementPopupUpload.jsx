import React, { useState } from 'react'
import { Modal, Button, Select, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const { Option } = Select

const TeacherGradeManagementPopupUpload = ({
  visible,
  onCancel,
  onUpload,
  uploadType,
  gradeCompositions,
}) => {
  const [file, setFile] = useState(null)
  const [gradeComposition, setGradeComposition] = useState(undefined)

  const handleFileChange = ({ file, fileList }) => {
    setFile(file)
  }

  const handleTypeChange = (value) => {
    setGradeComposition(value)
  }

  const handleUpload = () => {
    if (uploadType === 'grade') {
      if (gradeComposition == '' || !file) {
        message.error('Please select assignment and upload a file.')
        return
      }
    } else {
      if (!file) {
        message.error('Please upload a file.')
        return
      }
    }

    const fileExtension = file.name.split('.').pop().toLowerCase()
    if (!fileTypes.includes(fileExtension)) {
      message.error(`You can only upload ${fileTypes.join(', ')} files!`)
      return
    }

    // Perform your upload logic here
    onUpload({ gradeComposition, file })
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
      {uploadType === 'grade' && (
        <Select
          placeholder="Select Assignment"
          style={{ width: '100%', marginBottom: 16 }}
          onChange={handleTypeChange}>
          {gradeCompositions.map((composition) => (
            <Option key={composition} value={composition}>
              {composition}
            </Option>
          ))}
        </Select>
      )}

      <Upload
        fileList={file ? [file] : []}
        beforeUpload={beforeUpload}
        onChange={handleFileChange}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
    </Modal>
  )
}

export default TeacherGradeManagementPopupUpload
