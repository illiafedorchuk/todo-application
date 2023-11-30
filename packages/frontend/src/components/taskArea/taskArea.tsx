import React, { FC, ReactElement } from 'react';
import {
  Grid,
  Box,
  Alert,
  LinearProgress,
} from '@mui/material';

import { format } from 'date-fns';
import { TaskCounter } from '../taskCounter/taskCounter';
import { Task } from '../task/task';
import { useQuery, useMutation } from 'react-query';
import { sendApiRequest } from '../../helpers/sendApiRequest';
import { ITaskApi } from './interfaces/ITaskApi';
import { Status } from '../createTaskForm/enums/Status';

export const TaskArea: FC = (): ReactElement => {
  const { error, isLoading, data } = useQuery(
    'tasks',
    async () => {
      return await sendApiRequest<ITaskApi[]>(
        'http://localhost:3300/tasks',
        'GET',
      );
    },
  );

  // update task mutation
  const updateTaskMutation = useMutation((data) =>
    sendApiRequest(
      'http://localhost:3300/tasks',
      'PUT',
      data,
    ),
  );

  return (
    <Grid item md={8} px={4}>
      <Box mb={8} px={4}>
        <h2>Status of your task as on </h2>
        {format(new Date(), 'PPPP')}
      </Box>
      <Grid
        container
        display="flex"
        justifyContent="center"
      >
        <Grid
          item
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          md={10}
          xs={12}
          mb={8}
        >
          <>
            <TaskCounter />
            <TaskCounter />
            <TaskCounter />
          </>
        </Grid>
        <Grid
          item
          display="flex"
          flexDirection="column"
          xs={10}
          md={8}
        >
          <>
            {error && (
              <Alert severity="error">
                There was an error fetching your tasks
              </Alert>
            )}

            {!error &&
              Array.isArray(data) &&
              data.length === 0 && (
                <Alert severity="warning">
                  You dont have any tasks created yet.
                </Alert>
              )}

            {isLoading ? (
              <LinearProgress />
            ) : (
              Array.isArray(data) &&
              data.length > 0 &&
              data.map((each, index) =>
                each.status === Status.todo ||
                each.status === Status.inProgress ? (
                  <Task
                    key={index + each.priority}
                    id={each.id}
                    title={each.title}
                    date={new Date(each.date)}
                    description={each.description}
                    priority={each.priority}
                    status={each.status}
                  />
                ) : null,
              )
            )}
          </>
        </Grid>
      </Grid>
    </Grid>
  );
};
