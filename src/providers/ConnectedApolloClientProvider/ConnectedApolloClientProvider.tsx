import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React, { FC, useMemo } from "react";

const ConnectedApolloClientProvider: FC = ({ children }) => {
  const client = useMemo(() => {
    return new ApolloClient({
      // uri: "https://api.studio.thegraph.com/query/7076/waterfall-subgraph/v0.0.9",
      // uri: "https://subgraph-test.icarus.finance/subgraphs/name/ica/waterfall-subgraph",
      // uri: "https://api.waterfalldefi.org/subgraphs/name/ica/waterfall-subgraph",
      uri: "http://ec2-3-21-27-87.us-east-2.compute.amazonaws.com:8000/subgraphs/name/ica/waterfall-subgraph",
      cache: new InMemoryCache()
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ConnectedApolloClientProvider;
