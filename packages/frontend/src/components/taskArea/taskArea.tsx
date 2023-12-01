import React, {
  FC,
  ReactElement,
  useEffect,
  useCallback,
} from 'react';
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
import { IUpdateTask } from '../createTaskForm/interfaces/IUpdateTask';
import { countTask } from './helpers/countTask';
import { TaskStatusChangedContext } from '../../context';

// Custom hook for managing tasks with React Query
const useTasks = () => {
  const tasksUpdatedContext = React.useContext(
    TaskStatusChangedContext,
  );

  const { error, isLoading, data, refetch } = useQuery(
    'tasks',
    async () => {
      return await sendApiRequest<ITaskApi[]>(
        'http://localhost:3300/tasks',
        'GET',
      );
    },
    {
      // Add any other necessary options
      onSuccess: () => {
        // Optionally, you can trigger a refetch when the data is successfully fetched
        // This is useful to ensure the latest data is always displayed
        refetch();
      },
    },
  );

  // Update task mutation
  const updateTaskMutation = useMutation(
    (data: IUpdateTask) =>
      sendApiRequest(
        'http://localhost:3300/tasks',
        'PUT',
        data,
      ),
    {
      // Use the onSettled callback to trigger a refetch after the mutation
      onSettled: () => {
        refetch();
      },
    },
  );

  // Callback for updating task status
  const onStatusChangeHandler = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      id: string,
    ) => {
      updateTaskMutation.mutate({
        id,
        status: e.target.checked
          ? Status.inProgress
          : Status.todo,
      });
    },
    [updateTaskMutation],
  );

  // Callback for marking task as complete
  const markCompleteHandler = useCallback(
    (
      e:
        | React.MouseEvent<HTMLButtonElement>
        | React.MouseEvent<HTMLAnchorElement>,
      id: string,
    ) => {
      updateTaskMutation.mutate({
        id,
        status: Status.completed,
      });
    },
    [updateTaskMutation],
  );

  return {
    error,
    isLoading,
    tasks: data || [],
    onStatusChangeHandler,
    markCompleteHandler,
  };
};

export const TaskArea: FC = (): ReactElement => {
  const {
    error,
    isLoading,
    tasks,
    onStatusChangeHandler,
    markCompleteHandler,
  } = useTasks();

  return (
    <Grid item md={8} px={4}>
      <Box mb={8} px={4}>
        <h2>
          Status Of Your Tasks As On{' '}
          {format(new Date(), 'PPPP')}
        </h2>
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
          alignItems="center"
          md={10}
          xs={12}
          mb={8}
        >
          <TaskCounter
            count={countTask(tasks, Status.todo)}
            status={Status.todo}
          />
          <TaskCounter
            count={countTask(tasks, Status.inProgress)}
            status={Status.inProgress}
          />
          <TaskCounter
            count={countTask(tasks, Status.completed)}
            status={Status.completed}
          />
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

            {!error && tasks.length === 0 && (
              <Alert severity="warning">
                You do not have any tasks created yet. Start
                by creating some tasks
              </Alert>
            )}

            {isLoading ? (
              <LinearProgress />
            ) : (
              tasks.map(
                (each, index) =>
                  (each.status === Status.todo ||
                    each.status === Status.inProgress) && (
                    <Task
                      key={index + each.priority}
                      id={each.id}
                      title={each.title}
                      date={new Date(each.date)}
                      description={each.description}
                      priority={each.priority}
                      status={each.status}
                      onStatusChange={onStatusChangeHandler}
                      onClick={markCompleteHandler}
                    />
                  ),
              )
            )}
          </>
        </Grid>
      </Grid>
    </Grid>
  );
};
