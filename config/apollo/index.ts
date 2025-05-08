import { ApolloClient, InMemoryCache } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        pokemon_v2_pokemon: offsetLimitPagination()
      },
    },
  },
});

export const client = new ApolloClient({
  uri: "https://beta.pokeapi.co/graphql/v1beta",
  cache,
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network" },
  },
});
