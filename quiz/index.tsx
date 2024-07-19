import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Quiz from './Quiz';
import RessourceUpdate from "app/entities/ressource/ressource-update";
import QuizUpdate from "app/entities/quiz/quiz_update";
import RessourceDetail from "app/entities/ressource/ressource-detail";
import RessourceDeleteDialog from "app/entities/ressource/ressource-delete-dialog";

const QuizRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Quiz />} />
    <Route path="new" element={<QuizUpdate/>}/>
    <Route path=":id">
      <Route path="edit" element={<QuizUpdate/>}/>
    </Route>
  </ErrorBoundaryRoutes>
);

export default QuizRoutes;
