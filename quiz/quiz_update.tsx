import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, createEntity, updateEntity, reset } from './quiz.reducer';
import { Form, Input, Select, Button as AntButton, Card, Checkbox, Spin } from 'antd';
import { Row, Col, Button as ReactstrapButton } from 'reactstrap';
import { IQuiz } from 'app/shared/model/quiz.model';

const { Option } = Select;

export const QuizUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const quizEntity = useAppSelector(state => state.quiz.entity);
  const loading = useAppSelector(state => state.quiz.loading);
  const updating = useAppSelector(state => state.quiz.updating);
  const updateSuccess = useAppSelector(state => state.quiz.updateSuccess);

  const [form] = Form.useForm();

  const handleClose = () => {
    navigate('/quiz' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
  }, [id, isNew]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity: IQuiz = {
      ...quizEntity,
      ...values,
      questions: values.questions || [],
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
        ...quizEntity,
        questions: quizEntity.questions || [],
      };

  const handleAddQuestion = () => {
    const questions = form.getFieldValue('questions') || [];
    form.setFieldsValue({ questions: [...questions, { text: '', choices: [{ text: '', correct: false }] }] });
  };

  const handleAddChoice = index => {
    const questions = form.getFieldValue('questions');
    questions[index].choices.push({ text: '', correct: false });
    form.setFieldsValue({ questions });
  };

  const handleCorrectChange = (qIndex, cIndex) => {
    const questions = form.getFieldValue('questions');
    questions[qIndex].choices = questions[qIndex].choices.map((choice, index) => ({
      ...choice,
      correct: index === cIndex,
    }));
    form.setFieldsValue({ questions });
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="goSchoolApp.quiz.home.createOrEditLabel" data-cy="QuizCreateUpdateHeading">
            {isNew ? 'Create a Quiz' : 'Edit Quiz'}
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <Spin size="large" />
          ) : (
            <Form
              form={form}
              initialValues={defaultValues()}
              onFinish={saveEntity}
              layout="vertical"
            >
              {!isNew && (
                <Form.Item name="id" label="ID">
                  <Input readOnly />
                </Form.Item>
              )}
              <Form.Item
                name="name"
                label="Quiz Name"
                rules={[{ required: true, message: 'Please enter the quiz name' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select>
                  <Option value="Mathématiques">Mathématiques</Option>
                  <Option value="Géographie">Géographie</Option>
                  <Option value="Science">Science</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="niveau"
                label="Niveau"
                rules={[{ required: true, message: 'Please select a level' }]}
              >
                <Select>
                  <Option value="Facile">Facile</Option>
                  <Option value="Moyen">Moyen</Option>
                  <Option value="Difficile">Difficile</Option>
                </Select>
              </Form.Item>
              <Form.List name="questions">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Card key={field.key} style={{ marginBottom: '20px' }}>
                        <Form.Item {...field} name={[field.name, 'text']} label={`Question ${index + 1}`}>
                          <Input />
                        </Form.Item>
                        <Form.List name={[field.name, 'choices']}>
                          {(choiceFields, { add: addChoice, remove: removeChoice }) => (
                            <>
                              {choiceFields.map((choiceField, choiceIndex) => (
                                <Form.Item
                                  key={choiceField.key}
                                  {...choiceField}
                                  name={[choiceField.name, 'text']}
                                  label={`Choice ${choiceIndex + 1}`}
                                >
                                  <Input
                                    addonAfter={
                                      <Checkbox
                                        checked={form.getFieldValue(['questions', index, 'choices', choiceIndex, 'correct'])}
                                        onChange={() => handleCorrectChange(index, choiceIndex)}
                                      >
                                        Correct
                                      </Checkbox>
                                    }
                                  />
                                </Form.Item>
                              ))}
                              <AntButton type="dashed" onClick={() => addChoice()} style={{ width: '100%' }}>
                                Add a choice
                              </AntButton>
                            </>
                          )}
                        </Form.List>
                      </Card>
                    ))}
                    <AntButton type="dashed" onClick={handleAddQuestion} style={{ width: '100%' }}>
                      Add a question
                    </AntButton>
                  </>
                )}
              </Form.List>
              <Form.Item>
                <ReactstrapButton tag={Link} to="/quiz" replace style={{ marginRight: '8px' }}>
                  <span className="d-none d-md-inline">Back</span>
                </ReactstrapButton>
                <AntButton type="primary" htmlType="submit" loading={updating}>
                  Save
                </AntButton>
              </Form.Item>
            </Form>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default QuizUpdate;
