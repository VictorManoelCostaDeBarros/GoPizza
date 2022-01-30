import React, { useState, useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons'
import { Alert, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from 'styled-components';
import firestore from '@react-native-firebase/firestore'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

import { Search } from '../../components/Search';
import { ProductCard, ProductProps } from '../../components/ProductCard';


import happyEmoji from '../../assets/happy.png'
import {
  Container,
  Header,
  Greeting,
  GreetingEmoji,
  GreetingText,
  Title,
  MenuHeader,
  MenuItemsNumber,
  NewProductButton
} from './styles';


export function Home() {
  const [pizzas, setPizzas] = useState<ProductProps[]>([])
  const [search, setSearch] = useState('')

  const { signOut, user } = useAuth()
  const { COLORS } = useTheme()
  const navigation = useNavigation()

  function fetchPizzas(value: string) {
    const formatedValue = value.toLowerCase().trim();

    firestore()
      .collection('pizzas')
      .orderBy('name_insensitive')
      .startAt(formatedValue)
      .endAt(`${formatedValue}\uf8ff`)
      .get()
      .then(response => {
        const data = response.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as ProductProps[]

        setPizzas(data)
      })
      .catch(() => Alert.alert('Consulta', 'Não foi possível realizar a consulta'))
  }

  function handleSearch() {
    fetchPizzas(search)
  }

  function handleSearchClear() {
    setSearch('')
    fetchPizzas('')
  }

  function handleOpen(id: string) {
    const route = user?.isAdmin ? 'product' : 'order'
    navigation.navigate(route, { id })
  }

  function handleAdd() {
    navigation.navigate('product', {})
  }


  useFocusEffect(
    useCallback(() => {
      fetchPizzas('')
    }, [])
  )

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Olá, Admin</GreetingText>
        </Greeting>

        <TouchableOpacity onPress={signOut}>
          <MaterialIcons name="logout" size={24} color={COLORS.TITLE} />
        </TouchableOpacity>
      </Header>

      <Search
        onChangeText={setSearch}
        value={search}
        onSearch={handleSearch}
        onClear={handleSearchClear}
      />

      <MenuHeader>
        <Title>Cardápio</Title>
        <MenuItemsNumber>{pizzas.length} pizzas</MenuItemsNumber>
      </MenuHeader>

      <FlatList
        data={pizzas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard
            data={item}
            onPress={() => handleOpen(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 125,
          marginHorizontal: 24
        }}
      />

      {
        user?.isAdmin && (
          <NewProductButton
            title="Cadastrar Pizza"
            type="secondary"
            onPress={handleAdd}
          />

        )
      }
    </Container>
  );
}