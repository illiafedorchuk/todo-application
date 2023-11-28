import { ValidationChain, body } from 'express-validator';
import { Priority } from '../enums/Priority';
import { Status } from '../enums/Status';

export const createValidator: ValidationChain[] = [
  body('title')
    .not()
    .isEmpty()
    .withMessage('The task title mandatory')
    .trim()
    .isString()
    .withMessage('Title needs to be in text format'),
  body('date')
    .not()
    .isEmpty()
    .withMessage('The task date is mandatory')
    .isString()
    .withMessage('Date needs to be in text format'),
  body('description')
    .trim()
    .isString()
    .withMessage('Description needs to be in text format'),
  body('priority')
    .trim()
    .isIn([Priority.normal, Priority.higth, Priority.low])
    .withMessage('Priority needs to be in text format'),
  body('status')
    .trim()
    .isIn([
      Status.todo,
      Status.inProgress,
      Status.completed,
    ])
    .withMessage('Status needs to be in text format'),
];

export const updateValidator = [
  body('id')
    .not()
    .isEmpty()
    .withMessage('The task id is mandatory')
    .trim()
    .isString()
    .withMessage('Id needs to be in uuid format'),
  body('status')
    .trim()
    .isIn([
      Status.todo,
      Status.inProgress,
      Status.completed,
    ])
    .withMessage('Status needs to be in text format'),
];
