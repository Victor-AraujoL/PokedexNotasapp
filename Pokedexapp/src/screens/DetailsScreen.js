import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  listarNotasDoPokemon,
  salvarPokemonFavorito,
} from '../database/database';

export default function DetailsScreen({ route }) {
  const { pokemonUrl } = route.params;

  const [pokemon, setPokemon] = useState(null);
  const [notasSalvas, setNotasSalvas] = useState([]);
  const [nota, setNota] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  async function carregarNotas(pokemonId) {
    const notas = await listarNotasDoPokemon(pokemonId);
    setNotasSalvas(notas);
  }

  useEffect(() => {
    async function buscarDetalhes() {
      try {
        const resposta = await fetch(pokemonUrl);
        const dados = await resposta.json();

        setPokemon(dados);
        await carregarNotas(dados.id);
      } catch (error) {
        setErro('Nao foi possivel carregar os detalhes.');
      } finally {
        setCarregando(false);
      }
    }

    buscarDetalhes();
  }, [pokemonUrl]);

  async function salvarNoSQLite() {
    const notaNumero = Number(nota);

    if (!pokemon) {
      return;
    }

    if (!Number.isInteger(notaNumero) || notaNumero < 1 || notaNumero > 10) {
      Alert.alert('Nota invalida', 'Informe uma nota inteira de 1 a 10.');
      return;
    }

    try {
      setSalvando(true);

      await salvarPokemonFavorito({
        pokemon_id: pokemon.id,
        nome: pokemon.name,
        tipo: pokemon.types[0].type.name,
        nota: notaNumero,
      });

      await carregarNotas(pokemon.id);
      Alert.alert('Sucesso', 'Nota salva no SQLite.');
      setNota('');
    } catch (error) {
      Alert.alert('Erro', 'Nao foi possivel salvar no SQLite.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#e3350d" />
        <Text style={styles.textoCarregando}>Carregando detalhes...</Text>
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

  const imagem = pokemon.sprites.other['official-artwork'].front_default;
  const tipos = pokemon.types.map((item) => item.type.name).join(', ');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={styles.card}>
        <Image source={{ uri: imagem }} style={styles.imagem} resizeMode="contain" />

        <Text style={styles.nome}>{pokemon.name}</Text>

        <View style={styles.infoLinha}>
          <Text style={styles.rotulo}>ID:</Text>
          <Text style={styles.valor}>{pokemon.id}</Text>
        </View>

        <View style={styles.infoLinha}>
          <Text style={styles.rotulo}>Altura:</Text>
          <Text style={styles.valor}>{pokemon.height}</Text>
        </View>

        <View style={styles.infoLinha}>
          <Text style={styles.rotulo}>Peso:</Text>
          <Text style={styles.valor}>{pokemon.weight}</Text>
        </View>

        <View style={styles.infoLinha}>
          <Text style={styles.rotulo}>Tipo(s):</Text>
          <Text style={styles.valor}>{tipos}</Text>
        </View>

        <Text style={styles.labelNota}>Nota de 1 a 10</Text>
        <TextInput
          style={styles.input}
          value={nota}
          onChangeText={setNota}
          keyboardType="numeric"
          placeholder="Ex: 10"
          maxLength={2}
        />

        <TouchableOpacity
          style={[styles.botao, salvando && styles.botaoDesabilitado]}
          onPress={salvarNoSQLite}
          disabled={salvando}
        >
          <Text style={styles.textoBotao}>
            {salvando ? 'Salvando...' : 'Salvar no SQLite'}
          </Text>
        </TouchableOpacity>

        <View style={styles.areaNotas}>
          <Text style={styles.tituloNotas}>Notas salvas deste Pokemon</Text>

          {notasSalvas.length === 0 ? (
            <Text style={styles.semNotas}>Nenhuma nota salva ainda.</Text>
          ) : (
            notasSalvas.map((item) => (
              <View key={item.id} style={styles.itemNota}>
                <Text style={styles.textoNota}>Nota: {item.nota}</Text>
                <Text style={styles.textoTipo}>Tipo salvo: {item.tipo}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  conteudo: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  imagem: {
    width: '100%',
    height: 220,
  },
  nome: {
    marginBottom: 16,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#222222',
  },
  infoLinha: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  rotulo: {
    width: 80,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  valor: {
    flex: 1,
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#333333',
  },
  labelNota: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  botao: {
    marginTop: 16,
    backgroundColor: '#e3350d',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    backgroundColor: '#999999',
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  areaNotas: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    paddingTop: 16,
  },
  tituloNotas: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 10,
  },
  semNotas: {
    fontSize: 15,
    color: '#666666',
  },
  itemNota: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  textoNota: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },
  textoTipo: {
    marginTop: 4,
    fontSize: 14,
    textTransform: 'capitalize',
    color: '#555555',
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
