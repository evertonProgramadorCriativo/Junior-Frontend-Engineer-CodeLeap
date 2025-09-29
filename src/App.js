import React from 'react';
import Layout from './components/layout/Layout';
import Button from './components/ui/Button/Button';

function App() {
  return (
    <Layout>
      <Button
        variant='primary'

      >enter</Button>
      <Button
        variant='secondary'

      >enter</Button>
      <Button
        variant='disabled'

      >enter</Button>
       <Button
        variant='danger'

      >enter</Button>
        <Button
        variant='success'

      >enter</Button>
    </Layout>
  );
}

export default App;
