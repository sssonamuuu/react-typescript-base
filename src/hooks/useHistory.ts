import { useHistory as useRcHistory } from 'react-router-dom';
import H from 'history';
import qs from 'qs';
import { useMemo } from 'react';

export default function useHistory <Q = {}, S = {}> (): H.History<S> & {query: Q} {
  const history = useRcHistory<S>();
  const query = useMemo<Q>(() => qs.parse(history.location.search.replace(/^\?/, '')) as unknown as Q, [history]);
  return { query, ...history };
}
