import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/auth';

import brandImg from '@assets/brand.png'

import {
  Brand,
  Container,
  Content,
  Title,
  ForgetPasswordButton,
  ForgetPasswordLabel
} from './styles';


export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn, isLogging, forgotPassword } = useAuth()

  function handleSingIn() {
    console.log('Aqui')
    signIn(email, password)
  }

  return (
    <Container>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Content>
          <Brand source={brandImg} />
          <Title>Login</Title>
          <Input
            placeholder="E-mail"
            type="secondary"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setEmail}
          />

          <Input
            placeholder="Senha"
            type="secondary"
            secureTextEntry
            onChangeText={setPassword}
          />

          <ForgetPasswordButton
            onPress={forgotPassword}
          >
            <ForgetPasswordLabel>Esqueci minha senha</ForgetPasswordLabel>
          </ForgetPasswordButton>

          <Button
            title="Entrar"
            type="secondary"
            onPress={handleSingIn}
            enabled={isLogging}
          />
        </Content>


      </KeyboardAvoidingView>
    </Container>
  );
}