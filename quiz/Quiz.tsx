import React, { useEffect, useState } from 'react';
import { Card, Typography, Modal, Button } from 'antd';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import CreateQuizModal from 'app/modules/modals/CreateQuizModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector, useAppDispatch } from 'app/config/store';
import { IQuiz } from 'app/shared/model/quiz.model';
import { getEntities } from './quiz.reducer';
import {PlusOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const { Title } = Typography;

const images = ['/content/images/mathCategorie.jpg', '/content/images/giography.webp', '/content/images/physic.jpg'];

const getRandomImage = () => images[Math.floor(Math.random() * images.length)];


const Quiz: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const dispatch = useAppDispatch();
  const quizList: IQuiz[] = useAppSelector(state => state.quiz.entities);
  const navigate = useNavigate();
  const groupedQuizzes = quizList.reduce((groups, quiz) => {
    const level = quiz.niveau;
    if (!groups[level]) {
      groups[level] = [];
    }
    groups[level].push(quiz);
    return groups;
  }, {});

  console.log(quizList);
  useEffect(() => {
    dispatch(getEntities({}));
  }, [dispatch]);

  const scrollLeft = () => {
    const element = document.getElementById('scroll-container');
    if (element) {
      element.scrollTo({
        left: element.scrollLeft - 300,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    const element = document.getElementById('scroll-container');
    if (element) {
      element.scrollTo({
        left: element.scrollLeft + 300,
        behavior: 'smooth',
      });
    }
  };

  const showModal = quiz => {
    setSelectedQuiz(quiz);
    setIsModalVisible(true);
  };

  const showNewQuizModal = () => {
    setSelectedQuiz(null);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };



  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ margin: '0px' }}>
        Quiz
      </Title>
      <div className="d-flex justify-content-end">
        <Button className="me-2" color="info">
          <FontAwesomeIcon icon="sync" /> Actualiser la liste
        </Button>
        <Button className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton" onClick={() => navigate('/quiz/new')}>
          <FontAwesomeIcon icon="plus" />
          &nbsp; Créer un nouveau Quiz
        </Button>
      </div>
      {quizList.map(quiz => (
        <div key={quiz.niveau} style={{ marginBottom: '20px' }}>
          <Title level={3}>{quiz.niveau}</Title>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <MdChevronLeft onClick={scrollLeft} style={{ cursor: 'pointer', fontSize: '24px' }} />
            <div
              id="scroll-container"
              style={{
                display: 'flex',
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {groupedQuizzes[quiz.niveau]?.map((quiz, index) => (
                <Card key={index} hoverable style={{ width: 240, minWidth: 240, marginRight: '20px' }}>
                  <img alt={quiz.name} src={quiz.image} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <Card.Meta title={quiz.name} description={`Catégorie: ${quiz.category}`} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <Button type="primary" onClick={() => navigate(`/quiz/${quiz.id}/edit`)}>
                      Modifier
                    </Button>
                    <Button danger onClick={() => console.log('Delete logic here')}>
                      Supprimer
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <MdChevronRight onClick={scrollRight} style={{ cursor: 'pointer', fontSize: '24px' }} />
          </div>
        </div>
      ))}

      <Modal
        title={selectedQuiz ? selectedQuiz.name : 'Créer un nouveau Quiz'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <CreateQuizModal q={selectedQuiz} />
      </Modal>
    </div>
  );
};

export default Quiz;
