import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styles from './TeacherGradeStructure.module.css'
import {
  UndoOutlined,
  PlusOutlined,
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { Button, Input } from 'antd'
import { Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import Cookies from 'js-cookie'

const TeacherGradeStructure = () => {
  const { id } = useParams()
  const token = Cookies.get('authToken')
  const [showAlert, setShowAlert] = useState('')
  const [gradeCompositions, setGradeCompositions] = useState([])
  const [originalGradeCompositions, setOriginalGradeCompositions] = useState([])
  const [editingIndex, setEditingIndex] = useState(-1)

  const fetchData = () => {
    axios
      .get(
        `${
          import.meta.env.VITE_SERVER_HOST
        }/teachers/class/${id}/grade-compositions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const sortedCompositions = response.data.sort(
          (a, b) => a.order - b.order
        )
        setGradeCompositions([...sortedCompositions])
        const copyOfSortedCompositions = JSON.parse(
          JSON.stringify(sortedCompositions)
        )
        setOriginalGradeCompositions(copyOfSortedCompositions)
      })
      .catch((err) => {
        showAlertFunction(err.response.data.message, 'danger')
      })
    const copyOfGradeCompositions = JSON.parse(
      JSON.stringify(gradeCompositions)
    )
    setOriginalGradeCompositions(copyOfGradeCompositions)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const showAlertFunction = (message, type = 'info', dismissible = true) => {
    setShowAlert({ message, type })
    if (dismissible) {
      setTimeout(() => {
        setShowAlert('')
      }, 5000)
    }
  }

  const calculateTotalPercentage = () => {
    let totalPercentage = 0
    gradeCompositions.forEach((composition) => {
      totalPercentage += parseFloat(composition.scale) || 0
    })
    return totalPercentage
  }

  const handleResetChanges = () => {
    const copyOfOridinalGradeCompositions = JSON.parse(
      JSON.stringify(originalGradeCompositions)
    )
    setGradeCompositions(copyOfOridinalGradeCompositions)
  }

  const handleAddRow = () => {
    const newComposition = {
      id: gradeCompositions.length + 1,
      name: 'Assignment',
      scale: '0',
    }
    setGradeCompositions([...gradeCompositions, newComposition])
  }

  const handleEdit = (index) => {
    if (editingIndex === -1) {
      setEditingIndex(index)
    }
  }

  const isUUID = (id) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const handleSave = () => {
    const compositionsToSend = gradeCompositions.map((composition, index) => ({
      id: isUUID(composition.id) ? composition.id : '',
      name: composition.name,
      scale: composition.scale,
      isFinalized: composition.isFinalized,
      order: index + 1,
    }))

    axios
      .post(
        `${
          import.meta.env.VITE_SERVER_HOST
        }/teachers/class/${id}/grade-compositions`,
        compositionsToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        showAlertFunction('Compositions saved', 'success')
        fetchData()
      })
      .catch((err) => {
        showAlertFunction(err.response.data.message, 'danger')
      })
  }

  const handleCancelEdit = (id) => {
    const index = originalGradeCompositions.findIndex(
      (composition) => composition.id === id
    )
    if (index !== -1) {
      const updatedCompositions = [...gradeCompositions]
      updatedCompositions[editingIndex] = {
        ...originalGradeCompositions[index],
      }
      setGradeCompositions(updatedCompositions)
      setEditingIndex(-1)
    }
  }

  const handleDelete = (index) => {
    if (editingIndex === -1) {
      const updatedCompositions = gradeCompositions.filter(
        (_, i) => i !== index
      )
      setGradeCompositions(updatedCompositions)
    }
  }

  const handleNameChange = (e, index) => {
    const editedCompositions = [...gradeCompositions]
    editedCompositions[index].name = e.target.value
    setGradeCompositions(editedCompositions)
  }

  const handleGradeScaleChange = (e, index) => {
    const editedCompositions = [...gradeCompositions]
    editedCompositions[index].scale = e.target.value
    setGradeCompositions(editedCompositions)
  }

  const handleFinalizeChange = (e, index) => {
    const editedCompositions = [...gradeCompositions]
    editedCompositions[index].isFinalized = true
    setGradeCompositions(editedCompositions)
  }

  const handleSaveTemporaryChanges = (index) => {
    const editedCompositions = [...gradeCompositions]
    const editedComposition = editedCompositions[index]
    if (!editedComposition.name) {
      showAlertFunction('Name cannot be empty', 'danger')
      return
    }
    if (!editedComposition.scale) {
      showAlertFunction('Grade Scale cannot be empty', 'danger')
      return
    }
    const inputValue = editedComposition.scale
    const isValidInput = /^-?\d*\.?\d+$/.test(inputValue)
    if (!isValidInput && inputValue !== '') {
      showAlertFunction('Grade Scale must be a valid number', 'danger')
      return
    }
    editedCompositions[index] = editedComposition
    setGradeCompositions([...editedCompositions])
    setEditingIndex(-1)
  }

  const handleDragStart = (e, index) => {
    if (editingIndex === -1) {
      e.dataTransfer.setData('index', index.toString())
    }
  }

  const handleDragOver = (e) => {
    if (editingIndex === -1) {
      e.preventDefault()
    }
  }

  const handleDrop = (e, targetIndex) => {
    if (editingIndex === -1) {
      const startIndex = Number(e.dataTransfer.getData('index'))
      const compositionsCopy = [...gradeCompositions]
      const [draggedItem] = compositionsCopy.splice(startIndex, 1)
      compositionsCopy.splice(targetIndex, 0, draggedItem)
      setGradeCompositions(compositionsCopy)
    }
  }

  return (
    <div className={styles.gradeTableContainer}>
      {showAlert && (
        <Alert variant={showAlert.type} className={styles['alert']} dismissible>
          {showAlert.message}
        </Alert>
      )}
      <div className={styles.buttonContainer}>
        <div className={styles['button-container']}>
          <Button
            className={styles['add-save-button']}
            onClick={handleResetChanges}>
            <UndoOutlined />
            Reset changes
          </Button>
          <Button className={styles['add-save-button']} onClick={handleAddRow}>
            <PlusOutlined />
            Add
          </Button>
          <Button className={styles['add-save-button']} onClick={handleSave}>
            <SaveOutlined />
            Save
          </Button>
        </div>
      </div>
      <table className={styles.gradeTable}>
        <thead>
          <tr className={styles['non-draggable']}>
            <th>Name</th>
            <th>Grade Scale (%)</th>
            <th>Finalize</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          {gradeCompositions.map((composition, index) => (
            <tr
              key={composition.id}
              draggable={index !== gradeCompositions.length}
              className={
                editingIndex !== -1 ? `${styles['non-draggable']}` : ''
              }
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}>
              <td>
                {editingIndex === index ? (
                  <Input
                    className={styles['input']}
                    value={composition.name}
                    onChange={(e) => handleNameChange(e, index)}
                  />
                ) : (
                  composition.name
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <Input
                    className={styles['input']}
                    value={composition.scale}
                    onChange={(e) => handleGradeScaleChange(e, index)}
                  />
                ) : (
                  composition.scale
                )}
              </td>
              <td className={styles['checkbox-cell']}>
                <input
                  type="checkbox"
                  className={styles['checkbox']}
                  checked={composition.isFinalized}
                  onChange={(e) => handleFinalizeChange(e, index)}
                  disabled={editingIndex !== index}
                />
              </td>
              <td className={styles['operation-cell']}>
                {editingIndex === index ? (
                  <>
                    <Button
                      className={styles['edit-button']}
                      onClick={() => handleSaveTemporaryChanges(index)}>
                      <SaveOutlined />
                      Save
                    </Button>
                    <Button
                      className={styles['cancel-button']}
                      onClick={() => handleCancelEdit(composition.id)}>
                      <CloseOutlined />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className={styles['edit-button']}
                      onClick={() => handleEdit(index)}>
                      <EditOutlined />
                      Edit
                    </Button>
                    <Button
                      className={styles['delete-button']}
                      onClick={() => handleDelete(index)}>
                      <DeleteOutlined />
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
          <tr className={`${styles['non-draggable']} ${styles['total-row']}`}>
            <td>Total</td>
            <td>{calculateTotalPercentage()}%</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default TeacherGradeStructure
