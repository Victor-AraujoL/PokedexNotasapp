import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const LISTA_POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151';

export default function HomeScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function buscarPokemons() {
      try {
        const resposta = await fetch(LISTA_POKEMON_URL);
        const dados = await resposta.json();
        setPokemons(dados.results);
      } catch (error) {
        setErro('Nao foi possivel carregar os Pokemon.');
      } finally {
        setCarregando(false);
      }
    }

    buscarPokemons();
  }, []);

  function abrirDetalhes(pokemon) {
    navigation.navigate('Detalhes', {
      pokemonUrl: pokemon.url,
    });
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#e3350d" />
        <Text style={styles.textoCarregando}>Carregando Pokemon...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => abrirDetalhes(item)}>
            <Text style={styles.nome}>{item.name}</Text>
            <Text style={styles.subtitulo}>Toque para ver detalhes</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  lista: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#222222',
  },
  subtitulo: {
    marginTop: 4,
    fontSize: 14,
    color: '#666666',
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  textoCarregando: {
    marginTop: 12,
    fontSize: 16,
  },
  erro: {
    fontSize: 16,
    color: '#e3350d',
    textAlign: 'center',
  },
});
