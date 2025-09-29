import React from 'react';
import Layout from './components/layout/Layout';
import Button from './components/ui/Button/Button';
import { 
  Input, 
  Textarea, 
  Label // Se quiser usar o genérico
} from './components/ui/Input/Input';
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
      <br/>
         <Input
        type="text"
        id="title"
      
        placeholder="Titulo aqui"
      />
      <Input
        type="text"
        id="username"
      
        placeholder="John doe"
      />

     

      {/* Exemplo usando Label genérico */}
      <Label htmlFor="email">Email Address</Label>
      <Input
        type="text"
        id="email"
        placeholder="your@email.com"
      />

       <Textarea
        id="content"
       
        placeholder="Content here"
        rows="4"
      />
    </Layout>
  );
}

export default App;
