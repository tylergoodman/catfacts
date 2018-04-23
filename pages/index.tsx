import '../styles.scss';
import 'isomorphic-fetch';
import { compose } from 'redux';
import withRedux from 'next-redux-wrapper';
import { reduxForm, Field, SubmissionError, InjectedFormProps } from 'redux-form';

import makeStore from '../store';
import CatBackgroundLayout from '../components/CatBackgroundLayout';
import Nav from '../components/Nav';
import PhoneInput from '../components/PhoneInput';
import AutoDismissingAlert from '../components/AutoDismissingAlert';


interface FormData {
  phone: string;
}

export default compose(
  withRedux(makeStore),
  reduxForm<FormData>({
    form: 'index',
    async onSubmit(fields, dispatch, { reset }) {
      try {
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            phone: fields.phone,
          }),
        });
        reset();
      }
      catch (err) {
        console.warn(err);
        throw new SubmissionError({ _error: 'Failed to submit your number. Please try again later.' });
      }
    },
  }),
)(({ handleSubmit, submitting, submitSucceeded, error }:  InjectedFormProps) =>
  <CatBackgroundLayout>
    <Nav />
    <div className='container vertical-center'>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Send Cat FACTS here:</label>
          <Field
            name='phone'
            component={PhoneInput}
          />
          <small className='form-text'>Please enter only your own phone number! :^)</small>
        </div>
        <div className='text-right mb-3'>
          <button className='btn btn-primary btn-block' type='submit' disabled={submitting}>Sign Me Up!</button>
        </div>
        {
          error ?
          <div className='alert alert-danger' role='alert'>{error}</div>
          : null
        }
        {
          submitSucceeded ?
          <AutoDismissingAlert className='alert alert-success' role='alert'>Subscribed successfully!</AutoDismissingAlert>
          : null
        }
      </form>
    </div>
  </CatBackgroundLayout>
);
