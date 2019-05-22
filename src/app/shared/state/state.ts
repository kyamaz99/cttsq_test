interface StateLess<T> {
  _get: () => T;
  _set: (payload: T) => void;
}

interface SimpleState<T> {
  get: () => T;
  set: (payload: T) => void;
}

function useSimpleState<T>(init: T): StateLess<T> {
  let val = init;
  const _get = () => val;
  const _set = (x: T) => (val = x);
  return Object.freeze({ _get, _set });
}

const _appLng: () => SimpleState<string> = () => {
  const { _get, _set } = useSimpleState<string>(null);
  return Object.freeze({ get: _get, set: _set });
};

export const AppLng = _appLng();
