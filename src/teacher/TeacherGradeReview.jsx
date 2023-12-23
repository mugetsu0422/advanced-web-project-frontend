import styles from './TeacherGradeReview.module.css';
import Pagination from 'react-bootstrap/Pagination'
import { getVisiblePage } from '../utils/helper'
import { GRADE_REVIEW_GET_LIMIT, VISIBLE_PAGES } from '../constants/constants'
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import {
  Alert,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Cookies from 'js-cookie';


const PaginationComponent = ({ count, curPage, setCurPage }) => {
  const totalPages = Math.ceil(count / GRADE_REVIEW_GET_LIMIT)
  const pages = getVisiblePage(totalPages, VISIBLE_PAGES, curPage)

  const handlePagination = async (destPage) => {
    if (destPage == 0 || destPage == totalPages + 1) {
      return
    }
    setCurPage(destPage)
  }

  const items = pages.map((ele, idx) => {
    if (ele.value === curPage) {
      return (
        <Pagination.Item
          key={idx}
          linkClassName={`${styles['page-btn']} ${styles['selected']}`}
          active={true}>
          {ele.value}
        </Pagination.Item>
      )
    }
    return (
      <Pagination.Item
        key={idx}
        onClick={() => setCurPage(ele.value)}
        linkClassName={`${styles['page-btn']}`}>
        {ele.value}
      </Pagination.Item>
    )
  })

  return (
    <Pagination
      className={`${styles['pagination']} d-flex justify-content-center align-items-center`}>
      <Pagination.First
        disabled={curPage === 1}
        onClick={() => setCurPage(1)}
        linkClassName={`${styles['page-btn']}`}
      />
      <Pagination.Prev
        disabled={curPage === 1}
        onClick={() => handlePagination(curPage - 1)}
        linkClassName={`${styles['page-btn']}`}
      />
      {items}
      <Pagination.Next
        disabled={curPage === totalPages}
        onClick={() => handlePagination(curPage + 1)}
        linkClassName={`${styles['page-btn']}`}
      />
      <Pagination.Last
        disabled={curPage === totalPages}
        onClick={() => setCurPage(totalPages)}
        linkClassName={`${styles['page-btn']}`}
      />
    </Pagination>
  )
}

const TeacherGradeReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = Cookies.get('authToken');
  const [showAlert, setShowAlert] = useState('');
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchAllGradeReviews = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_HOST}/teachers/class/${id}/grade-reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.sort((a, b) => {
        if (a.isFinal !== b.isFinal) {
          return a.isFinal ? 1 : -1;
        }
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
      });
    } catch (err) {
      showAlertFunction(err.response.data.message, 'danger');
      return [];
    }
  };

  const paginateReviews = (allReviews) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allReviews.slice(startIndex, endIndex);
  };

  useEffect(() => {
    fetchAllGradeReviews().then((allReviews) => {
      setReviews(allReviews);
    });
  }, []);

  const paginatedReviews = paginateReviews(reviews);

  const handleRowClick = (gradeid, userId) => {
    const searchParams = new URLSearchParams();
    searchParams.set('gradeid', gradeid);
    searchParams.set('userid', userId);
    navigate(`${location.pathname}/detail?${searchParams.toString()}`);
  };

  return (
    <div className={styles['table-container']}>
      {showAlert && (
        <Alert
          variant={showAlert.type}
          className={styles['alert']}
          dismissible>
          {showAlert.message}
        </Alert>
      )}
      <table className={styles.gradeTable}>
         <thead>
           <tr className={styles['']}>
             <th>Student ID</th>
             <th>Assignment</th>
             <th>Current Grade</th>
             <th>Expected Grade</th>
             <th>Status</th>
           </tr>
         </thead>
         <tbody>
           {paginatedReviews.map((review, index) => (
             <tr key={index} onClick={() => handleRowClick(review.gradeCompositionID, review.userID)}>
               <td>{review.studentID}</td>
               <td>{review.gradeCompositionName}</td>
               <td>{review.currentGrade}</td>
               <td>{review.expectationGrade}</td>
               <td className={review.isFinal ? `${styles['resolved']}` : `${styles['unresolved']}`}>{review.isFinal ? <CheckOutlined/> : <CloseOutlined/>}</td>
             </tr>
           ))}
         </tbody>
       </table>

       <PaginationComponent 
        count={reviews.length} 
        curPage={currentPage} 
        setCurPage={setCurrentPage} 
       />
    </div>
  );
};

export default TeacherGradeReview;