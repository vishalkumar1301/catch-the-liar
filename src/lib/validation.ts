// lib/validation.ts
import * as yup from 'yup';

export const tweetSchema = yup.object().shape({
  tweetUrl: yup
    .string()
    .url('Invalid URL format')
    .required('Tweet URL is required'),
  personName: yup.string().required('Person name is required'),
  twitterHandle: yup.string().optional(),
  datePosted: yup
    .date()
    .typeError('Invalid date format')
    .optional(), // Made optional
  context: yup.string().optional(),
});

export const validateTweet = async (data: any) => {
  return await tweetSchema.validate(data, { abortEarly: false });
};
